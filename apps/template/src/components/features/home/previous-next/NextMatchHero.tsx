"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/helpers/date";
import { buildMatchSlug } from "@/lib/slug";
import type { HnsMatch } from "@/types/hns";
import { CountdownTiles } from "./CountdownTiles";
import { TeamCrest } from "./TeamCrest";

interface NextMatchHeroProps {
  match: HnsMatch;
}

function formatRound(round: string | null): string | null {
  if (!round) return null;
  const trimmed = round.trim();
  if (!trimmed) return null;
  return /^\d+$/.test(trimmed) ? `Kolo ${trimmed}` : trimmed;
}

export function NextMatchHero({ match }: NextMatchHeroProps) {
  const { date, time } = formatDateTime(match.dateTimeUTC ?? 0);
  const competition = match.competition?.name ?? null;
  const round = formatRound(match.round);
  const venue = match.facility?.place ?? match.facility?.name ?? null;

  const subEyebrow = [competition, round].filter(
    (p): p is string => typeof p === "string" && p.length > 0,
  );
  const venueAndDate = [date, time, venue].filter(
    (p): p is string => typeof p === "string" && p.length > 0,
  );

  const inner = (
    <article className="flex flex-col items-center gap-12 md:gap-16">
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-center">
          Sljedeća utakmica
        </h2>
        {subEyebrow.length > 0 && (
          <p className="text-center">
            {subEyebrow.join(", ")}
          </p>
        )}
      </div>

      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-12 md:gap-16">
        <TeamCrest team={match.homeTeam} size="lg" className="w-full" />
        <span>
          vs
        </span>
        <TeamCrest team={match.awayTeam} size="lg" className="w-full" />
      </div>

      <CountdownTiles targetUtc={match.dateTimeUTC ?? null} size="hero" />

      <p className="text-center">
        {venueAndDate.join(" · ")}
      </p>

      {match.id != null && (
        <span className="inline-flex items-center gap-3">
          <span>Vidi detalje</span>
          <ArrowRight
            className="size-3.5"
            strokeWidth={2.5}
          />
        </span>
      )}
    </article>
  );

  if (match.id == null) {
    return <div className="w-full">{inner}</div>;
  }

  return (
    <div>
      <Link href={`/utakmice/${buildMatchSlug(match)}`} className="block">
        {inner}
      </Link>
    </div>
  );
}
