"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Fragment } from "react";
import { RevealHeading } from "@/components/animations";
import { getCometImageUrl } from "@/lib/api";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

interface PlayerHeroProps {
  name: string;
  picture: string | null;
  /** Top eyebrow tokens, e.g. ["#10", "Napadač", "Kapetan"]. */
  eyebrowParts: string[];
  /** Sub-heading tokens below the name, e.g. ["Dob 24", "4. NL"]. */
  subParts: string[];
  /** Shirt number rendered as a hollow watermark behind the name. */
  shirtNumber: number | null;
}

/**
 * Cinematic player profile hero — mirrors the match hero's dark floodlit canvas
 * so the stats page opens with the same brand punch: club-blue glows, the shirt
 * number as a hollow watermark, an oversized portrait and a display-font name.
 */
export default function PlayerHero({
  name,
  picture,
  eyebrowParts,
  subParts,
  shirtNumber,
}: PlayerHeroProps) {
  const reduced = useReducedMotion();

  const eyebrowTokens = eyebrowParts.filter(Boolean);
  const subTokens = subParts.filter(Boolean);

  return (
    <section className="dark relative isolate -mt-20 flex min-h-[75svh] w-full items-center overflow-hidden bg-navy-deep pt-20 text-foreground">
      {/* Floodlight glows */}
      <div
        aria-hidden
        className="absolute -top-[18vw] left-[12%] -z-20 size-[52vw] rounded-full bg-club/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -right-[12vw] top-1/3 -z-20 size-[40vw] rounded-full bg-club/15 blur-[100px]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-navy-deep/40 via-transparent to-navy-deep"
      />

      {/* Shirt number watermark */}
      {shirtNumber != null && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-display font-black leading-none tracking-[-0.04em] text-stroke [--text-stroke-color:color-mix(in_oklab,var(--chalk)_12%,transparent)] text-[55vw] sm:text-[34vw]"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.5, ease: EASE }}
        >
          {shirtNumber}
        </motion.span>
      )}

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-24">
        {eyebrowTokens.length > 0 && (
          <motion.p
            className="flex items-center justify-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-foreground/70 sm:text-xs sm:tracking-[0.4em]"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span aria-hidden className="h-px w-8 bg-primary" />
            {eyebrowTokens.map((token, i) => (
              <Fragment key={token}>
                {i > 0 && <MetaDivider />}
                <span>{token}</span>
              </Fragment>
            ))}
          </motion.p>
        )}

        <motion.div
          className="relative"
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EXPO_OUT }}
        >
          <span
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full bg-club/25 blur-3xl"
          />
          <PlayerPortrait picture={picture} name={name} />
        </motion.div>

        <RevealHeading
          as="h1"
          lines={[name]}
          delay={0.2}
          className="select-none text-balance font-display font-black uppercase leading-[0.85] tracking-[-0.02em]"
          lineClassName="text-[12vw] sm:text-5xl md:text-6xl lg:text-7xl"
        />

        {subTokens.length > 0 && (
          <motion.p
            className="flex items-center justify-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-foreground/70 sm:text-xs sm:tracking-[0.4em]"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          >
            {subTokens.map((token, i) => (
              <Fragment key={token}>
                {i > 0 && <MetaDivider />}
                <span>{token}</span>
              </Fragment>
            ))}
          </motion.p>
        )}
      </div>
    </section>
  );
}

/** Hairline rule between metadata tokens. */
function MetaDivider() {
  return <span aria-hidden className="h-3 w-px shrink-0 bg-current/20" />;
}

function PlayerPortrait({
  picture,
  name,
}: {
  picture: string | null;
  name: string;
}) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative size-32 overflow-hidden rounded-full bg-club/20 ring-2 ring-foreground/15 sm:size-40 md:size-44">
      {picture ? (
        <Image
          src={getCometImageUrl(picture)}
          alt={name}
          fill
          sizes="176px"
          className="object-cover object-top"
        />
      ) : (
        <span className="flex size-full items-center justify-center font-display text-4xl font-black uppercase text-foreground/40">
          {initials}
        </span>
      )}
    </div>
  );
}
