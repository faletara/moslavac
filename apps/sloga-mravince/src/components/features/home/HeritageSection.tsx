"use client";

import Image from "next/image";
import { AnimatedCounter, FadeInView } from "@/components/animations";

const STATS = [
  { value: 1925, label: "Godina osnivanja" },
  { value: 101, label: "Godina tradicije" },
  { value: 1500, label: "Kapacitet stadiona" },
] as const;

/**
 * Heritage — ink sekcija stoljetne priče: ogroman Anton "OD 1925.", brojači,
 * jubilarni grb 100 godina u chalk okviru sa zlatnim prstenom.
 */
export default function HeritageSection() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-deep py-24 text-white md:py-32">
      {/* Zlatni hairline gore + zrno */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-club-gold/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.06] mix-blend-overlay"
      />
      {/* Outlined watermark godine u pozadini */}
      <span
        aria-hidden
        className="[--text-stroke-color:rgba(255,255,255,0.05)] pointer-events-none absolute -bottom-8 left-0 -z-10 select-none font-display text-[26vw] leading-none tabular-nums text-stroke-thick md:text-[18vw]"
      >
        1925
      </span>

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center gap-4">
          <span className="font-display text-sm tabular-nums tracking-[0.2em] text-club-gold">
            N°05
          </span>
          <span aria-hidden className="h-px flex-1 bg-white/15" />
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-white/45">
            Naša povijest
          </span>
        </div>

        <div className="mt-12 grid gap-16 md:grid-cols-2 md:items-center md:gap-20">
          <div>
            <h2 className="font-display uppercase leading-[0.9] tracking-normal">
              <span className="block text-5xl text-white sm:text-6xl md:text-7xl">
                Jedno stoljeće
              </span>
              <span className="block text-5xl text-club-red sm:text-6xl md:text-7xl">
                Sloge
              </span>
            </h2>

            <p className="mt-8 max-w-md text-base leading-relaxed text-white/55">
              Od 1925. u srcu Mravinca. Generacije igrača, navijača i klupskih
              ljudi koji čine Slogu onim što jest.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {STATS.map(({ value, label }) => (
                <div key={label} className="border-l border-white/12 pl-4">
                  <AnimatedCounter
                    value={value}
                    className="font-display text-4xl tabular-nums text-white md:text-5xl"
                  />
                  <p className="mt-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/40">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Jubilarni grb — chalk okvir, zlatni prsten */}
          <FadeInView
            direction="none"
            className="flex justify-center md:justify-end"
          >
            <div className="relative bg-chalk p-8 clip-corner sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-3 border border-club-gold/40"
              />
              <Image
                src="/sloga-mravince-100.jpeg"
                alt="HNK Sloga Mravince — 100 godina"
                width={340}
                height={340}
                className="relative max-w-60 md:max-w-80"
              />
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}
