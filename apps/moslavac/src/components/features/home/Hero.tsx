"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import type { FrontendTenant } from "@/lib/payload/types";
import { HeroActions } from "./HeroActions";

type HeroProps = {
  tenant: FrontendTenant;
  hasNextMatch: boolean;
};

export default function Hero({ tenant, hasNextMatch }: HeroProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const founded = tenant.branding?.founded ?? null;
  const { prefix, main } = splitDisplayName(tenant.displayName);
  const letters = toKeyedLetters(main.toUpperCase());

  // Scroll-driven parallax: layers drift at different speeds for depth.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Pointer-driven parallax (desktop): smooth spring-tracked cursor offset.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 50, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 50, damping: 18, mass: 0.6 });
  const watermarkX = useTransform(sx, [-1, 1], [-18, 18]);
  const watermarkPointerY = useTransform(sy, [-1, 1], [-10, 10]);
  const headingX = useTransform(sx, [-1, 1], [-12, 12]);
  const headingPointerY = useTransform(sy, [-1, 1], [-8, 8]);

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduced || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    py.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function resetPointer() {
    px.set(0);
    py.set(0);
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="dark relative isolate -mt-20 flex min-h-svh w-full flex-col overflow-hidden bg-navy-deep text-foreground"
    >
      {/* Floodlit photo backdrop. The club-blue duotone is baked into the file
          (scripts/bake-duotone.mjs) — doing it live with `mix-blend-color`
          stalled first paint for seconds on iOS. */}
      <motion.div
        aria-hidden
        className="hero-enter-backdrop absolute inset-0 -z-30"
        style={reduced ? undefined : { y: bgY }}
      >
        <Image
          src="/naslovna-club.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-b from-navy-deep/90 via-navy-deep/55 to-navy-deep" />
      </motion.div>

      {/* Floodlight glows */}
      <div
        aria-hidden
        className="absolute -top-[calc(20vw+120px)] left-[calc(15%-120px)] -z-20 size-[calc(55vw+240px)] opacity-25 glow-club"
      />
      <div
        aria-hidden
        className="absolute -right-[calc(10vw+100px)] top-[calc(33.333%-100px)] -z-20 size-[calc(38vw+200px)] opacity-15 glow-club"
      />

      {/* Centre stage */}
      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-28 pb-20 text-center sm:px-10 md:pt-32"
      >
        {/* Wordmark — club name framed by the founding-year watermark */}
        <div className="relative flex items-center justify-center">
          {/* Founded year — hollow watermark centred on the name */}
          {founded && (
            <motion.span
              aria-hidden
              className="hero-enter-watermark pointer-events-none absolute left-1/2 top-1/2 -z-10 block -translate-x-1/2 -translate-y-1/2 select-none font-display font-black leading-none text-stroke [--text-stroke-color:color-mix(in_oklab,var(--chalk)_14%,transparent)] text-[34vw] md:text-[22vw]"
              style={
                reduced
                  ? undefined
                  : {
                      y: watermarkY,
                      x: watermarkX,
                      marginTop: watermarkPointerY,
                    }
              }
            >
              {founded}
            </motion.span>
          )}

          {/* Club name — prefix line + letter-staggered main word */}
          <h1
            aria-label={tenant.displayName}
            className="relative select-none font-display font-black uppercase"
          >
            {prefix && (
              <span
                aria-hidden
                className="hero-enter-prefix mb-1 flex items-center justify-center gap-4 text-[clamp(1.4rem,4vw,2.75rem)] leading-none tracking-[0.55em] text-foreground/60 indent-[0.55em]"
              >
                {prefix}
              </span>
            )}
            <motion.span
              aria-hidden
              className="block overflow-hidden whitespace-nowrap leading-[0.84] tracking-[-0.02em] text-[clamp(2.75rem,15vw,13rem)]"
              style={reduced ? undefined : { x: headingX, y: headingPointerY }}
            >
              {letters.map(({ char, key }, i) => (
                <span
                  key={key}
                  className="hero-enter-letter inline-block whitespace-pre"
                  style={{ animationDelay: `${0.3 + i * 0.045}s` }}
                >
                  {char}
                </span>
              ))}
            </motion.span>
          </h1>
        </div>

        {/* One clear matchday action; the squad remains available in navigation. */}
        <div className="hero-enter-actions mt-10 md:mt-12">
          <HeroActions hasNextMatch={hasNextMatch} />
        </div>
      </motion.div>
    </section>
  );
}

/** Stable per-letter keys: each repeated character gets an occurrence index. */
function toKeyedLetters(word: string): { char: string; key: string }[] {
  const seen = new Map<string, number>();

  return [...word].map((char) => {
    const count = seen.get(char) ?? 0;
    seen.set(char, count + 1);

    return { char, key: `${char}${count}` };
  });
}

/** Ime kluba razdvojeno na kraticu (npr. „SNK”) i ostatak. */
interface SplitDisplayName {
  prefix: string | null;
  main: string;
}

function splitDisplayName(displayName: string): SplitDisplayName {
  const trimmed = displayName.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length <= 1) return { prefix: null, main: trimmed || displayName };
  const [first, ...rest] = parts;

  return { prefix: first ?? null, main: rest.join(" ") };
}
