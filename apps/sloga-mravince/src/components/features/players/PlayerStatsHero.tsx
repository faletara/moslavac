"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

interface PlayerStatsHeroProps {
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  crestSrc: string;
  jerseyNumber: number | null;
  eyebrowParts: string[];
  subParts: string[];
  backHref: string;
}

function initials(first: string, last: string): string {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

/**
 * Ink hero profila igrača — HNS portret u kadru s crvenim potpisom, masivni
 * ghost broj u pozadini i Anton prezime koje izlazi iza maske. Usklađeno s
 * InkPageHero brandingom (crveni hairline, grain, watermark).
 */
export default function PlayerStatsHero({
  firstName,
  lastName,
  photoUrl,
  crestSrc,
  jerseyNumber,
  eyebrowParts,
  subParts,
  backHref,
}: PlayerStatsHeroProps) {
  const reduced = useReducedMotion();

  const lineReveal = {
    hidden: reduced ? { opacity: 0 } : { y: "110%" },
    show: reduced
      ? { opacity: 1 }
      : { y: 0, transition: { duration: 0.7, ease: EXPO_OUT } },
  };

  return (
    <section className="relative isolate overflow-hidden bg-ink-deep text-chalk">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-club-red" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent,transparent_11px,rgba(255,255,255,0.04)_11px,rgba(255,255,255,0.04)_22px)]"
      />
      <div aria-hidden className="absolute inset-0 bg-grain opacity-[0.06]" />

      {/* Ghost broj u pozadini */}
      {jerseyNumber != null && (
        <motion.span
          aria-hidden
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EXPO_OUT }}
          className="pointer-events-none absolute -right-6 top-1/2 -z-10 -translate-y-1/2 select-none font-display text-[16rem] uppercase leading-none tabular-nums text-white/[0.04] sm:text-[24rem] lg:text-[30rem]"
        >
          {jerseyNumber}
        </motion.span>
      )}

      <div className="mx-auto grid min-h-[30rem] max-w-6xl content-center items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        {/* Portret */}
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EXPO_OUT }}
          className="group relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-ink clip-corner lg:mx-0"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 z-10 w-1 bg-club-red"
          />
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={`${firstName} ${lastName}`.trim()}
              fill
              sizes="(min-width: 1024px) 24rem, 90vw"
              priority
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_38%,#2a2a30_0%,#17171b_70%)]">
              <Image
                src={crestSrc}
                alt=""
                width={160}
                height={160}
                className="h-28 w-auto object-contain opacity-80 sm:h-36"
              />
              <span className="absolute bottom-5 right-6 select-none font-display text-6xl uppercase leading-none text-white/10">
                {initials(firstName, lastName)}
              </span>
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-ink-deep via-ink-deep/10 to-transparent"
          />
        </motion.div>

        {/* Tekst */}
        <div>
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EXPO_OUT }}
          >
            <Link
              href={backHref}
              className="group inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-chalk/55 transition-colors hover:text-chalk"
            >
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-x-1"
              >
                ←
              </span>
              Momčad
            </Link>

            {eyebrowParts.length > 0 && (
              <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.66rem] font-bold uppercase tracking-[0.26em] text-club-red">
                {eyebrowParts.map((part, i) => (
                  <span key={part} className="flex items-center gap-3">
                    {i > 0 && (
                      <span aria-hidden className="text-chalk/25">
                        /
                      </span>
                    )}
                    {part}
                  </span>
                ))}
              </p>
            )}
          </motion.div>

          {/* Ime — clip reveal iza maske */}
          <motion.h1
            aria-label={`${firstName} ${lastName}`.trim()}
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            className="mt-4 font-display text-6xl uppercase leading-[0.92] text-chalk sm:text-8xl lg:text-9xl"
          >
            {firstName && (
              <span aria-hidden className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  variants={lineReveal}
                  className="block text-chalk/55"
                >
                  {firstName}
                </motion.span>
              </span>
            )}
            <span aria-hidden className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={lineReveal} className="block">
                {lastName}
              </motion.span>
            </span>
          </motion.h1>

          {subParts.length > 0 && (
            <motion.p
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EXPO_OUT }}
              className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.22em] text-chalk/45"
            >
              {subParts.map((part, i) => (
                <span key={part} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden className="text-chalk/20">
                      ·
                    </span>
                  )}
                  {part}
                </span>
              ))}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
