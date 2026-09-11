"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import NewsFallbackArt from "@/components/features/news/NewsFallbackArt";
import { formatDateLong } from "@/lib/helpers/date";
import type { FrontendTenant } from "@/lib/payload/types";
import type { News } from "@/types/news";

type HeroProps = {
  tenant: FrontendTenant;
  news: News[];
};

const AUTOPLAY_MS = 6000;
const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Homepage hero — kino-editorial slider najnovijih vijesti: full-bleed
 * fotografija, masivni Anton naslov s clip-reveal ulaskom, veliki redni broj
 * slajda, vertikalna heritage traka lijevo, segmentirani crveni progress.
 * Ako nema vijesti, pada natrag na tekstualni prikaz kluba.
 */
export default function Hero({ tenant, news }: HeroProps) {
  if (news.length === 0) {
    return <HeroFallback tenant={tenant} />;
  }
  const clubName = tenant.branding?.shortName ?? tenant.displayName;
  return (
    <>
      {/* Naslovnici h1 pripada klubu, ne naslovu vijesti koji se rotira svakih
          nekoliko sekundi. Vizualno vodeći ostaje naslov aktivne vijesti. */}
      <h1 className="sr-only">{tenant.displayName}</h1>
      <HeroSlider news={news} clubName={clubName} />
    </>
  );
}

function HeroSlider({
  news,
  clubName,
}: {
  news: News[];
  clubName: string;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = news.length;
  const goTo = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count],
  );

  // Crveni progress puni aktivni segment (motion value → deklarativno preko
  // style), a po završetku sam pomiče na sljedeću vijest — segmenti se pune
  // redom. Motion value se vezuje deklarativno pa nema utrke pri montaži
  // segmenta koji se mijenja sa svakom promjenom indexa.
  const width = useMotionValue(0);
  const widthPercent = useTransform(width, (v) => `${v}%`);
  useEffect(() => {
    if (reduced || count < 2) {
      width.set(reduced ? 100 : 0);
      return;
    }
    if (paused) return; // ostavlja width zamrznut na trenutnoj vrijednosti
    width.set(0);
    const controls = animate(width, 100, {
      duration: AUTOPLAY_MS / 1000,
      ease: "linear",
      onComplete: () => setIndex((i) => (i + 1) % count),
    });
    return () => controls.stop();
  }, [index, paused, reduced, count, width]);

  const active = news[index];

  return (
    <section className="relative min-h-0 w-full flex-1 overflow-hidden bg-ink-deep">
      {/* Pozadinske slike — crossfade + spori Ken Burns zoom */}
      <AnimatePresence initial={false}>
        <motion.div
          key={active.id}
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduced ? false : { scale: 1 }}
            animate={reduced ? undefined : { scale: 1.06 }}
            transition={{ duration: AUTOPLAY_MS / 1000 + 1.2, ease: "linear" }}
          >
            {active.thumbnailPath ? (
              <HeroSlide
                src={active.thumbnailPath}
                title={active.title}
                priority={index === 0}
              />
            ) : (
              <NewsFallbackArt clubName={clubName} size="hero" />
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Kino-tretman slike — svaka (i loša/nasumična) fotka postaje
          atmosferska pozadina, tekst uvijek čitljiv. */}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/95 via-black/30 via-40% to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/70 via-black/15 via-45% to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-club-red/10 mix-blend-multiply" />
      {/* Filmsko zrno */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay"
      />

      {/* Sadržaj dolje-lijevo */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-24 md:px-14 md:pb-24 lg:pl-24">
        <div className="max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.09 } },
                exit: { opacity: 0, transition: { duration: 0.3 } },
              }}
            >
              {/* Kicker: crvena pločica + datum */}
              <motion.p
                variants={{
                  hidden: reduced ? {} : { opacity: 0, y: 14 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: EXPO_OUT },
                  },
                }}
                className="flex flex-wrap items-center gap-3"
              >
                <span className="bg-club-red px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.24em] text-white">
                  Novosti
                </span>
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/60">
                  {formatDateLong(active.date)}
                </span>
              </motion.p>

              {/* Naslov — clip reveal */}
              {/* Razmak redaka mora primiti kvačice na verzalu (Š, Č, Ž) — ispod
                  1.3 caron gornjeg reda dodiruje slova iznad. */}
              <h2 className="mt-5 font-display uppercase leading-[1.4] tracking-normal text-white sm:leading-[1.36] md:leading-[1.34]">
                <span className="block overflow-hidden pt-[0.3em] pb-[0.12em]">
                  <motion.span
                    variants={{
                      hidden: reduced ? {} : { y: "110%" },
                      show: {
                        y: 0,
                        transition: { duration: 0.75, ease: EXPO_OUT },
                      },
                    }}
                    // `text-7xl` nosi i `line-height: 1`, pa `leading` mora stajati OVDJE —
                    // na h2 ga Tailwindov razred za veličinu pregazi.
                    className="block pt-[0.04em] text-balance text-4xl leading-[1.4] sm:text-5xl sm:leading-[1.36] md:text-7xl md:leading-[1.34]"
                  >
                    {active.title}
                  </motion.span>
                </span>
              </h2>

              <motion.div
                variants={{
                  hidden: reduced ? {} : { opacity: 0, y: 14 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: EXPO_OUT },
                  },
                }}
                className="mt-7"
              >
                <Link
                  href={`/novosti/${active.slug}`}
                  className="group inline-flex items-center gap-3 bg-white px-7 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-ink-deep transition-colors duration-300 hover:bg-club-red hover:text-white"
                >
                  Pročitajte više
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Kontrole — duga segmentirana linija + crveni progress */}
      {count > 1 && (
        <div className="absolute inset-x-6 bottom-8 flex items-center justify-end gap-5 md:inset-x-14 lg:left-24">
          <div className="flex w-full max-w-lg items-center gap-2">
            {news.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Prikaži vijest ${i + 1}`}
                aria-current={i === index}
                className="group relative h-1.5 flex-1 skew-x-[-18deg] overflow-hidden bg-white/60 transition-colors hover:bg-white"
              >
                {i < index && <span className="absolute inset-0 bg-club-red" />}
                {i === index && (
                  <motion.span
                    style={{ width: widthPercent }}
                    className="absolute inset-y-0 left-0 bg-club-red"
                  />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Pokreni" : "Pauziraj"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 text-white transition-colors hover:border-white hover:bg-white/10"
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        </div>
      )}
    </section>
  );
}

/**
 * Jedan slajd hero-a. Bira način prikaza prema omjeru slike:
 * - slika koja lijepo pokriva hero (mali izrez) → `cover`, popuni cijeli prostor
 * - slika koja bi se ružno rezala (portret, netipičan format) → `contain` uz
 *   zamućenu pozadinu iste slike, pa se subjekt nikad ne reže
 * Odluka pada nakon učitavanja (naturalWidth/Height vs stvarni omjer hero-a);
 * dok se ne zna, pretpostavlja `cover` da dobre slike nemaju bljesak blura.
 */
const MAX_CROP_FRACTION = 0.4;

function HeroSlide({
  src,
  title,
  priority,
}: {
  src: string;
  title: string;
  priority: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contain, setContain] = useState(false);

  const decideFit = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = containerRef.current;
    if (!el || !el.clientHeight) return;
    const img = e.currentTarget;
    if (!img.naturalWidth || !img.naturalHeight) return;

    const containerAspect = el.clientWidth / el.clientHeight;
    // Na uskim (portret) ekranima letterbox s blur trakama izgleda lošije od
    // blagog izreza — landscape fotku uvijek popuni preko cijelog frame-a.
    if (containerAspect < 1) {
      setContain(false);
      return;
    }
    const imageAspect = img.naturalWidth / img.naturalHeight;
    const cropFraction =
      imageAspect >= containerAspect
        ? 1 - containerAspect / imageAspect // reže se lijevo/desno
        : 1 - imageAspect / containerAspect; // reže se gore/dolje
    setContain(cropFraction > MAX_CROP_FRACTION);
  };

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Zamućena, uvećana ista slika popunjava prazninu — samo kad je contain */}
      {contain && (
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          priority={priority}
          sizes="100vw"
          className="scale-110 object-cover blur-2xl"
        />
      )}
      <Image
        src={src}
        alt={title}
        fill
        priority={priority}
        sizes="100vw"
        onLoad={decideFit}
        className={contain ? "object-contain" : "object-cover"}
      />
    </div>
  );
}


function HeroFallback({ tenant }: { tenant: FrontendTenant }) {
  const { displayName } = tenant;
  const motto = tenant.branding?.motto ?? null;
  const founded = tenant.branding?.founded ?? null;

  return (
    <section className="mx-auto flex min-h-[60dvh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
      {founded && (
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Osnovan {founded}.
        </p>
      )}
      <h1 className="mt-3 font-display text-5xl uppercase tracking-tight md:text-7xl">
        {displayName}
      </h1>
      {motto && <p className="mt-4 max-w-xl text-muted-foreground">{motto}</p>}
      <Link
        href="#utakmice"
        className="mt-8 inline-flex items-center border border-foreground/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide"
      >
        Utakmice
      </Link>
    </section>
  );
}

function PauseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden
    >
      <rect x="2" y="1.5" width="3" height="9" rx="1" />
      <rect x="7" y="1.5" width="3" height="9" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3 1.8v8.4a.6.6 0 0 0 .92.5l6.5-4.2a.6.6 0 0 0 0-1L3.92 1.3A.6.6 0 0 0 3 1.8Z" />
    </svg>
  );
}
