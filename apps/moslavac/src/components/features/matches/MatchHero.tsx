"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HnsCrest } from "@/components/HnsCrest";
import { cn } from "@/lib/utils";
import type { HnsMatchEvent } from "@/types/hns";
import MatchEventBar from "./MatchEventBar";

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
  /** Match events — render the broadcast event bar when present. */
  events?: HnsMatchEvent[];
}

/**
 * Broadcast scoreboard hero — the team names ARE the hero, set in oversized
 * display type flanking the score with crests inline (à la club match centres).
 * Dark floodlit canvas with club-blue glows and a broadcast accent line carries
 * the brand; all the small match facts are intentionally dropped for impact.
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
  events,
}: MatchHeroProps) {
  const reduced = useReducedMotion();

  const subline = [date, place].filter(
    (p): p is string => typeof p === "string" && p.trim().length > 0,
  );

  const score = (
    <Scoreline
      hasResult={hasResult}
      homeScore={homeScore}
      awayScore={awayScore}
      time={time}
      reduced={!!reduced}
    />
  );

  return (
    <section className="dark relative isolate -mt-20 flex min-h-[70svh] w-full items-center overflow-hidden bg-navy-deep pt-20 text-foreground">
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

      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        {/* Eyebrow cluster */}
        <div className="flex flex-col items-center gap-3 text-center">
          <motion.p
            className="flex items-center justify-center gap-3 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-foreground/70 sm:text-xs sm:tracking-[0.4em]"
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span aria-hidden className="h-px w-8 bg-primary" />
            {eyebrow}
            <span aria-hidden className="h-px w-8 bg-primary" />
          </motion.p>
          {subline.length > 0 && (
            <motion.p
              className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-foreground/45 sm:text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            >
              {subline.join(" · ")}
            </motion.p>
          )}
        </div>

        {/* Desktop — horizontal broadcast line: NAME · crest · score · crest · NAME */}
        <div className="mt-16 hidden items-center gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          <div className="flex items-center justify-end gap-6">
            <TeamName name={homeName} align="right" reduced={!!reduced} side="home" />
            <Crest picture={homePicture} name={homeName} reduced={!!reduced} side="home" />
          </div>
          {score}
          <div className="flex items-center gap-6">
            <Crest picture={awayPicture} name={awayName} reduced={!!reduced} side="away" />
            <TeamName name={awayName} align="left" reduced={!!reduced} side="away" />
          </div>
        </div>

        {/* Mobile / tablet — compact scoreboard: crests + score aligned on one
            row, names directly below in the same grid so they stay aligned. */}
        <div className="mt-12 grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-5 sm:mt-14 sm:gap-x-6 lg:hidden">
          <div className="col-start-1 row-start-1 flex justify-center">
            <Crest picture={homePicture} name={homeName} reduced={!!reduced} side="home" />
          </div>
          <div className="col-start-2 row-start-1">{score}</div>
          <div className="col-start-3 row-start-1 flex justify-center">
            <Crest picture={awayPicture} name={awayName} reduced={!!reduced} side="away" />
          </div>
          <h2 className="col-start-1 row-start-2 text-balance text-center font-display text-xl font-black uppercase leading-[0.95] tracking-tighter text-foreground sm:text-2xl">
            {homeName}
          </h2>
          <h2 className="col-start-3 row-start-2 text-balance text-center font-display text-xl font-black uppercase leading-[0.95] tracking-tighter text-foreground sm:text-2xl">
            {awayName}
          </h2>
        </div>

        {/* Broadcast event bar */}
        {hasResult && events && events.length > 0 && (
          <div className="mt-14 sm:mt-20">
            <MatchEventBar
              events={events}
              homeName={homeName}
              homePicture={homePicture}
              awayName={awayName}
              awayPicture={awayPicture}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function Scoreline({
  hasResult,
  homeScore,
  awayScore,
  time,
  reduced,
}: {
  hasResult: boolean;
  homeScore: number;
  awayScore: number;
  time: string;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="flex shrink-0 items-center justify-center"
      initial={{ opacity: 0, scale: reduced ? 1 : 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.15, ease: EXPO_OUT }}
    >
      {hasResult ? (
        <div className="flex items-center gap-3 font-display font-black uppercase leading-none tracking-tighter sm:gap-5">
          <span className="text-7xl tabular-nums sm:text-8xl lg:text-9xl">
            {homeScore}
          </span>
          <span className="text-3xl font-light text-foreground/30 sm:text-5xl lg:text-6xl">
            :
          </span>
          <span className="text-7xl tabular-nums sm:text-8xl lg:text-9xl">
            {awayScore}
          </span>
        </div>
      ) : (
        <span className="font-display text-6xl font-black uppercase leading-none tracking-tighter tabular-nums sm:text-7xl lg:text-8xl">
          {time}
        </span>
      )}
    </motion.div>
  );
}

function Crest({
  picture,
  name,
  reduced,
  side,
}: {
  picture: string | null;
  name: string;
  reduced: boolean;
  side: "home" | "away";
}) {
  const fromX = side === "home" ? -24 : 24;
  return (
    <motion.div
      className="relative shrink-0"
      initial={{ opacity: 0, x: reduced ? 0 : fromX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.05, ease: EXPO_OUT }}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full bg-club/25 blur-2xl"
      />
      <HnsCrest
        picture={picture}
        name={name}
        size={128}
        className="size-24 sm:size-28 lg:size-24 xl:size-28"
      />
    </motion.div>
  );
}

function TeamName({
  name,
  align,
  reduced,
  side,
}: {
  name: string;
  align: "left" | "right";
  reduced: boolean;
  side: "home" | "away";
}) {
  const fromX = side === "home" ? -24 : 24;
  return (
    <motion.h2
      className={cn(
        "text-balance font-display font-black uppercase leading-[0.9] tracking-tighter text-foreground text-4xl xl:text-5xl",
        align === "right" ? "text-right" : "text-left",
      )}
      initial={{ opacity: 0, x: reduced ? 0 : fromX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: EXPO_OUT }}
    >
      {name}
    </motion.h2>
  );
}

