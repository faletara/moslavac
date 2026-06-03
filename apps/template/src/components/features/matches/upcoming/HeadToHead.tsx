"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { getHeadToHead } from "@/lib/helpers/form";
import { formatDateShort } from "@/lib/helpers/date";
import { buildMatchSlug } from "@/lib/slug";
import type { HnsMatch } from "@/types/hns";

interface HeadToHeadProps {
  homeTeamId: number | null;
  awayTeamId: number | null;
  homeTeamName: string;
  awayTeamName: string;
  competitionMatches: HnsMatch[] | undefined;
  currentMatchId: number;
  isLoading: boolean;
}

export default function HeadToHead({
  homeTeamId,
  awayTeamId,
  homeTeamName,
  awayTeamName,
  competitionMatches,
  currentMatchId,
  isLoading,
}: HeadToHeadProps) {
  if (isLoading) {
    return (
      <section className="mt-16 pt-12 sm:mt-20">
        <Skeleton className="mx-auto h-4 w-40" />
        <div className="mt-8 space-y-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </section>
    );
  }

  if (!homeTeamId || !awayTeamId || !competitionMatches) return null;

  const h2h = getHeadToHead(competitionMatches, homeTeamId, awayTeamId).filter(
    (m) => m.id !== currentMatchId,
  );

  if (h2h.length === 0) return null;

  return (
    <section className="mt-16 pt-12 sm:mt-20">
      <h2>
        Međusobni susreti
      </h2>

      <ul className="mx-auto mt-8 max-w-2xl">
        {h2h.slice(0, 5).map((match) => (
          <H2HRow
            key={match.id ?? `${match.dateTimeUTC}`}
            match={match}
            homeTeamId={homeTeamId}
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
          />
        ))}
      </ul>
    </section>
  );
}

function H2HRow({
  match,
  homeTeamId,
  homeTeamName,
  awayTeamName,
}: {
  match: HnsMatch;
  homeTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
}) {
  const matchHomeId = match.homeTeam?.id;
  const homeWasUs = matchHomeId === homeTeamId;
  const homeGoals = match.homeTeamResult?.current ?? 0;
  const awayGoals = match.awayTeamResult?.current ?? 0;

  const ourGoals = homeWasUs ? homeGoals : awayGoals;
  const theirGoals = homeWasUs ? awayGoals : homeGoals;

  const outcomeLabel =
    ourGoals > theirGoals ? "P" : ourGoals < theirGoals ? "I" : "N";

  const venueLabel = homeWasUs
    ? `${homeTeamName} (D)`
    : `${awayTeamName} (G)`;

  return (
    <li>
      <Link
        href={`/utakmice/${buildMatchSlug(match)}`}
        className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 py-3 sm:gap-5 sm:py-4"
      >
        <span className="flex size-6 items-center justify-center">
          {outcomeLabel}
        </span>
        <span className="truncate">
          {venueLabel}
        </span>
        <span>
          {homeGoals}:{awayGoals}
        </span>
        <span>
          {formatDateShort(match.dateTimeUTC ?? 0)}
        </span>
      </Link>
    </li>
  );
}
