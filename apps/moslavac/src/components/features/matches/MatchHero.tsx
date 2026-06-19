"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HnsCrest } from "@/components/HnsCrest";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

interface MatchHeroProps {
  eyebrow: string;
  homeName: string;
  homePicture: string | null;
  awayName: string;
  awayPicture: string | null;
  hasResult: boolean;
  homeScore: number;
  awayScore: number;
  time: string;
  date: string;
  place: string | null;
  /** Half-time score line, e.g. "1:0" — null when unavailable. */
  halfTime: string | null;
  /** Attendance count, shown only for played matches with a positive value. */
  attendance: number | null;
}

/**
 * Cinematic scoreboard hero — carries the homepage's dark floodlit canvas onto
 * the match page: club-blue glows, a hollow venue watermark, oversized crests
 * and a display-font score. Replaces the flat white header so the page opens
 * with the same brand punch as the home Hero.
 */
export default function MatchHero({
  eyebrow,
  homeName,
  homePicture,
  awayName,
  awayPicture,
  hasResult,
  homeScore,
  awayScore,
  time,
  date,
  place,
  halfTime,
  attendance,
}: MatchHeroProps) {
  const reduced = useReducedMotion();

  const meta = [
    halfTime ? `Poluvrijeme ${halfTime}` : null,
    date,
    place,
    hasResult && attendance != null && attendance > 0
      ? `${attendance} gledatelja`
      : null,
  ].filter(Boolean) as string[];

  return (
    <section className="dark relative isolate -mt-20 flex min-h-[70svh] w-full items-center overflow-hidden bg-navy-deep pt-20 text-foreground">
      {/* Floodlight glows — same club-blue bloom as the home Hero */}
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

      <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <motion.p
          className="flex items-center justify-center gap-3 text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-foreground/60 sm:text-xs sm:tracking-[0.4em]"
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {eyebrow}
        </motion.p>

        <div className="mt-12 grid grid-cols-3 items-center gap-3 sm:mt-16 sm:gap-10">
          <TeamSide
            name={homeName}
            picture={homePicture}
            side="home"
            reduced={!!reduced}
          />

          <motion.div
            className="flex flex-col items-center gap-5 text-center"
            initial={{ opacity: 0, scale: reduced ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EXPO_OUT }}
          >
            {hasResult ? (
              <div className="flex items-baseline gap-3 font-display font-black uppercase leading-none tracking-tighter sm:gap-6">
                <span className="text-7xl tabular-nums sm:text-8xl md:text-9xl">
                  {homeScore}
                </span>
                <span className="text-3xl font-light text-foreground/40 sm:text-5xl">
                  :
                </span>
                <span className="text-7xl tabular-nums sm:text-8xl md:text-9xl">
                  {awayScore}
                </span>
              </div>
            ) : (
              <span className="font-display text-6xl font-black uppercase leading-none tracking-tighter tabular-nums sm:text-7xl md:text-8xl">
                {time}
              </span>
            )}

            {meta.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {meta.map((line, i) => (
                  <p
                    key={line}
                    className={cn(
                      "text-[0.6rem] font-medium uppercase tracking-[0.3em] sm:tracking-[0.35em]",
                      i === 0 ? "text-foreground/70" : "text-foreground/45",
                    )}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </motion.div>

          <TeamSide
            name={awayName}
            picture={awayPicture}
            side="away"
            reduced={!!reduced}
          />
        </div>
      </div>
    </section>
  );
}

function TeamSide({
  name,
  picture,
  side,
  reduced,
}: {
  name: string;
  picture: string | null;
  side: "home" | "away";
  reduced: boolean;
}) {
  const fromX = side === "home" ? -28 : 28;

  return (
    <motion.div
      className="flex flex-col items-center gap-4 text-center"
      initial={{ opacity: 0, x: reduced ? 0 : fromX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.05, ease: EXPO_OUT }}
    >
      <div className="relative">
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-club/20 blur-2xl"
        />
        <HnsCrest
          picture={picture}
          name={name}
          size={128}
          className="size-20 sm:size-28 md:size-32"
        />
      </div>
      <span className="line-clamp-2 text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.2em] text-foreground/90 sm:text-sm sm:tracking-[0.25em]">
        {name}
      </span>
    </motion.div>
  );
}
