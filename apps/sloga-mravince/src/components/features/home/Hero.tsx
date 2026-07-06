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
import type { FrontendTenant } from "@/lib/payload/types";
import type { News } from "@/types/news";

type HeroProps = {
  tenant: FrontendTenant;
  news: News[];
  crestSrc: string;
};

const AUTOPLAY_MS = 6000;

/**
 * Homepage hero. Fullscreen crossfade slider koji prikazuje najnovije vijesti:
 * pozadinska slika preko cijelog viewporta, naslov + CTA dolje-lijevo, slide
 * indikatori i pause kontrola dolje-desno, auto-rotacija svakih 6s.
 * Ako nema vijesti sa slikom, pada natrag na tekstualni prikaz kluba.
 */
export default function Hero({ tenant, news, crestSrc }: HeroProps) {
  if (news.length === 0) {
    return <HeroFallback tenant={tenant} />;
  }
  const clubName = tenant.branding?.shortName ?? tenant.displayName;
  return <HeroSlider news={news} crestSrc={crestSrc} clubName={clubName} />;
}

function HeroSlider({
  news,
  crestSrc,
  clubName,
}: {
  news: News[];
  crestSrc: string;
  clubName: string;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = news.length;
  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

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
    <section className="relative min-h-0 w-full flex-1 overflow-hidden bg-navy-deep">
      {/* Pozadinske slike — crossfade */}
      <AnimatePresence initial={false}>
        <motion.div
          key={active.id}
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          {active.thumbnailPath ? (
            <HeroSlide
              src={active.thumbnailPath}
              title={active.title}
              priority={index === 0}
            />
          ) : (
            <CrestBackdrop
              crestSrc={crestSrc}
              clubName={clubName}
              priority={index === 0}
              reduced={reduced ?? false}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Kino-tretman slike — svaka (i loša/nasumična) fotka postaje
          atmosferska pozadina, tekst uvijek čitljiv. Slojevi:
          1) blagi opći scrim za ujednačenje  2) težina pri dnu
          3) tama slijeva (ispod teksta)  4) suptilna vinjeta gore
          5) jedva vidljivi brand-ton (crveno-navy) da poveže boje */}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/30 via-40% to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/70 via-black/15 via-45% to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-club-red/10 mix-blend-multiply" />

      {/* Sadržaj dolje-lijevo */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-24 md:px-14 md:pb-20">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.h1
              key={active.id}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-4xl md:text-6xl"
            >
              {active.title}
            </motion.h1>
          </AnimatePresence>

          <Link
            href={`/novosti/${active.slug}`}
            className="mt-6 inline-flex items-center rounded-full bg-club-red px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-transform hover:scale-105 sm:mt-7 sm:px-7 sm:py-3 sm:text-sm"
          >
            Pročitajte više
          </Link>
        </div>
      </div>

      {/* Kontrole — Monaco stil: duga segmentirana linija + crveni progress */}
      {count > 1 && (
        <div className="absolute inset-x-6 bottom-8 flex items-center justify-end gap-5 md:inset-x-14">
          <div className="flex w-full max-w-lg items-center gap-2">
            {news.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Prikaži vijest ${i + 1}`}
                aria-current={i === index}
                className="group relative h-1.5 flex-1 skew-x-[-18deg] overflow-hidden bg-white/70 transition-colors hover:bg-white"
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

/**
 * Pozadina slajda kad vijest nema thumbnail — velik grb kluba na čistoj
 * bijeloj bazi s blagim radijalnim tonovima za dubinu, suptilnim zlatnim
 * prstenom, jedva vidljivim watermarkom imena kluba i laganim lebdenjem grba
 * (osim za reduced-motion). Premium, "clean" izgled.
 */
function CrestBackdrop({
  crestSrc,
  clubName,
  priority,
  reduced,
}: {
  crestSrc: string;
  clubName: string;
  priority: boolean;
  reduced: boolean;
}) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white">
      {/* Blagi radijalni tonovi za dubinu — bijela u centru, jedva siva prema rubu */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#f3f4f6_58%,#e6e8ec_100%)]" />
      {/* Watermark imena kluba — jedva vidljiv, svijetlo sivi */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-[42%] -translate-y-1/2 select-none text-[26vw] font-black uppercase leading-none tracking-tighter text-black/[0.035]"
      >
        {clubName}
      </span>
      {/* Grb — velik medaljon s tankim zlatnim prstenom i mekom sjenom */}
      <motion.div
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative aspect-square w-56 translate-y-[-6%] sm:w-72 md:w-104"
      >
        <div className="absolute -inset-8 rounded-full border border-club-gold/20" />
        <Image
          src={crestSrc}
          alt=""
          fill
          sizes="(max-width: 768px) 70vw, 420px"
          priority={priority}
          className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.22)]"
        />
      </motion.div>
    </div>
  );
}

function HeroFallback({ tenant }: { tenant: FrontendTenant }) {
  const { displayName } = tenant;
  const motto = tenant.branding?.motto ?? null;
  const founded = tenant.branding?.founded ?? null;

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
      {founded && (
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Osnovan {founded}.
        </p>
      )}
      <h1 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-6xl">
        {displayName}
      </h1>
      {motto && <p className="mt-4 max-w-xl text-muted-foreground">{motto}</p>}
      <Link
        href="#utakmice"
        className="mt-8 inline-flex items-center rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-wide"
      >
        Utakmice
      </Link>
    </section>
  );
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <rect x="2" y="1.5" width="3" height="9" rx="1" />
      <rect x="7" y="1.5" width="3" height="9" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M3 1.8v8.4a.6.6 0 0 0 .92.5l6.5-4.2a.6.6 0 0 0 0-1L3.92 1.3A.6.6 0 0 0 3 1.8Z" />
    </svg>
  );
}
