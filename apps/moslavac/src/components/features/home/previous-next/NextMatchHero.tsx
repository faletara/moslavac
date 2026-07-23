"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { FadeInView, RevealHeading } from "@/components/animations";
import { getMatchVenue } from "@/components/features/home/homeMatch";
import { formatDateTime } from "@/lib/helpers/date";
import { buildMatchSlug } from "@/lib/helpers/slug";
import type { Match } from "@/types/hns";
import { CountdownTiles } from "./CountdownTiles";
import { TeamCrest } from "./TeamCrest";

interface NextMatchHeroProps {
  match: Match;
}

function formatRound(round: string | null | undefined): string | null {
  if (!round) return null;
  const trimmed = round.trim();
  if (!trimmed) return null;
  return /^\d+$/.test(trimmed) ? `Kolo ${trimmed}` : trimmed;
}

function TeamName({ name }: { name: string | null | undefined }) {
  return (
    <span className="line-clamp-2 min-h-[2.5em] max-w-[12ch] text-center text-base font-black uppercase leading-tight tracking-tight sm:text-lg md:max-w-[16ch] md:text-xl">
      {name ?? "N/A"}
    </span>
  );
}

/** Metadata parts split by a thin rule instead of a separator glyph. */
function MetaLine({ parts }: { parts: string[] }) {
  return (
    <p className="flex flex-wrap items-center justify-center gap-3 text-center text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-sm">
      {parts.map((part, index) => (
        <Fragment key={part}>
          {index > 0 && <span aria-hidden className="h-3 w-px bg-current/20" />}
          <span>{part}</span>
        </Fragment>
      ))}
    </p>
  );
}

export function NextMatchHero({ match }: NextMatchHeroProps) {
  const reduced = useReducedMotion();
  const { date, time } = formatDateTime(match.kickoffAtUtcMs ?? 0);
  const competition = match.competition?.name ?? null;
  const round = formatRound(match.round);
  const venue = getMatchVenue(match);

  const subEyebrow = [competition, round].filter(
    (p): p is string => typeof p === "string" && p.length > 0,
  );
  const metaChips = [date, time, venue].filter(
    (p): p is string => typeof p === "string" && p.length > 0,
  );

  const inner = (
    <article className="flex flex-col items-center gap-10 md:gap-14">
      <div className="flex flex-col items-center gap-4">
        <RevealHeading
          lines={["Sljedeća", "utakmica"]}
          ariaLabel="Sljedeća utakmica"
          delay={0.05}
          className="select-none text-center font-display font-black uppercase leading-none"
          lineClassName="text-[15vw] sm:text-6xl md:text-7xl"
        />
        {subEyebrow.length > 0 && (
          <FadeInView delay={0.15}>
            <MetaLine parts={subEyebrow} />
          </FadeInView>
        )}
      </div>

      <FadeInView delay={0.1} className="w-full">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto] items-start gap-x-6 gap-y-3 sm:gap-x-12 md:gap-x-16">
          <TeamCrest
            team={match.homeTeam}
            size="lg"
            showName={false}
            className="col-start-1 row-start-1 w-full"
          />
          <span
            aria-hidden
            className="col-start-2 row-start-1 self-center font-display text-4xl font-black uppercase leading-none text-stroke [--text-stroke-color:color-mix(in_oklab,var(--chalk)_45%,transparent)] sm:text-6xl md:text-7xl"
          >
            VS
          </span>
          <TeamCrest
            team={match.awayTeam}
            size="lg"
            showName={false}
            className="col-start-3 row-start-1 w-full"
          />
          <div className="col-start-1 row-start-2 justify-self-center">
            <TeamName name={match.homeTeam?.name} />
          </div>
          <div className="col-start-3 row-start-2 justify-self-center">
            <TeamName name={match.awayTeam?.name} />
          </div>
        </div>
      </FadeInView>

      <CountdownTiles targetUtc={match.kickoffAtUtcMs ?? null} size="hero" />

      {metaChips.length > 0 && (
        <FadeInView delay={0.5}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {metaChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-foreground/15 px-4 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-foreground/80 sm:text-xs"
              >
                {chip}
              </span>
            ))}
          </div>
        </FadeInView>
      )}

      {match.id != null && (
        <FadeInView delay={0.6}>
          <span className="inline-flex items-center gap-3 rounded-full bg-chalk px-8 py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-navy-deep transition-colors duration-300 group-hover:bg-club group-hover:text-chalk sm:text-xs">
            <span>Vidi detalje</span>
            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.5}
            />
          </span>
        </FadeInView>
      )}
    </article>
  );

  if (match.id == null) {
    return <div className="w-full">{inner}</div>;
  }

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/utakmice/${buildMatchSlug(match)}`} className="group block">
        {inner}
      </Link>
    </motion.div>
  );
}
