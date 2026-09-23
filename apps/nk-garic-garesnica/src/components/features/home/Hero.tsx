"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";

type HeroProps = {
  tenant: FrontendTenant;
};

/**
 * Naslovni hero — full-bleed zračni snimak igrališta u klupskoj plavoj
 * (duoton umjesto sirove fotke), golemi condensed naziv kluba uz donji rub
 * (prva riječ puna, druga iscrtana bijelo). Grb se ne ponavlja — već je u
 * headeru. Godina osnutka stoji kao tihi žig u donjem desnom kutu.
 */
export default function Hero({ tenant }: HeroProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const typeY = useTransform(scrollYProgress, [0, 1], [0, 36]);
  // Grb se pomiče sporije od tipografije — dubina, ne pokret.
  const crestY = useTransform(scrollYProgress, [0, 1], [0, 12]);

  const founded = tenant.branding?.founded ?? 1923;

  const crest =
    tenant.branding?.logo ?? null;

  const [first, ...rest] = tenant.displayName.replace(/^NK\s+/i, "").split(" ");
  const wordLeft = first ?? "Garić";
  const wordRight = rest.join(" ") || "Garešnica";

  const anim = (delay: number, from: Record<string, number>) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, ...from },
          animate: { opacity: 1, x: 0, y: 0 },
          transition: {
            duration: 0.85,
            delay,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        };

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-navy-deep"
    >
      {/* Zračni snimak igrališta — full-bleed, u duotonu (grayscale + plavi overlay). */}
      <Image
        src="/photos/stadion.png"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover grayscale contrast-125"
      />
      <div aria-hidden className="absolute inset-0 bg-club mix-blend-color" />
      {/* Scrim — taman dolje-lijevo (gdje stoji tekst), rasvijetljen gore-desno. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top right, oklch(0.14 0.05 262 / 0.92), oklch(0.14 0.05 262 / 0.5) 46%, oklch(0.14 0.05 262 / 0.15) 78%)",
        }}
      />

      {/* Halftone raster iz ramena dresa — gornji desni kut, samo grafika. */}
      <div
        aria-hidden
        className="halftone pointer-events-none absolute -right-16 -top-16 hidden h-105 w-105 rotate-18 opacity-30 md:block"
        style={
          // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
          // standardna svojstva, pa ga inline stil ovdje mora proširiti.
          {
            "--halftone-size": "15px",
            "--halftone-color": "rgba(255,255,255,0.7)",
            maskImage:
              "radial-gradient(circle at 35% 60%, black 0%, black 22%, transparent 62%)",
          } as React.CSSProperties
        }
      />


      <motion.div
        style={reduce ? undefined : { y: typeY }}
        className="relative z-10 mx-auto flex w-full max-w-350 flex-col items-center px-4 text-center sm:px-6 lg:px-10"
      >
        {/* Grb otvara lockup: hairline — grb — hairline, pa naziv, pa godina.
            Linije daju grbu mjesto u kompoziciji; bez njih lebdi. */}
        {crest?.url && (
          <motion.div
            {...anim(0, { y: 18 })}
            className="mb-8 flex w-full max-w-md items-center gap-5 sm:mb-10 sm:gap-6"
          >
            <span className="h-px flex-1 bg-linear-to-r from-transparent to-white/45" />
            <span className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
              <Image
                src={crest.url}
                alt=""
                aria-hidden
                fill
                priority
                sizes="64px"
                className="object-contain"
              />
            </span>
            <span className="h-px flex-1 bg-linear-to-l from-transparent to-white/45" />
          </motion.div>
        )}

        <h1 className="font-display uppercase leading-[0.84] text-white">
          <motion.span
            {...anim(0.1, { x: -36 })}
            className="block text-[clamp(4.6rem,17vw,13.5rem)] tracking-tight"
          >
            {wordLeft}
          </motion.span>
          <motion.span
            {...anim(0.22, { x: -36 })}
            className="text-stroke mt-4 block text-[clamp(2.9rem,10.5vw,8.5rem)] tracking-tight sm:mt-5 md:mt-6"
            // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
            // standardna svojstva, pa ga inline stil ovdje mora proširiti.
            style={{ "--text-stroke-color": "#ffffff" } as React.CSSProperties}
          >
            {wordRight}
          </motion.span>
        </h1>

        {/* Godina osnutka — ispod naslova, centrirano. */}
        <motion.div {...anim(0.4, { y: 14 })} className="mt-10">
          <span className="block font-mono text-xs uppercase tracking-[0.32em] text-white/75">
            Osnovan
          </span>
          <span
            className="text-stroke mt-1 block font-display text-6xl leading-none tracking-tight sm:-mt-1 sm:text-7xl md:-mt-2 md:text-8xl"
            // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
            // standardna svojstva, pa ga inline stil ovdje mora proširiti.
            style={{ "--text-stroke-color": "#ffffff" } as React.CSSProperties}
          >
            {founded}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
