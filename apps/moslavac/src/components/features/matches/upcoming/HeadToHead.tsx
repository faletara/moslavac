"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { getHeadToHead } from "@/lib/helpers/form";
import { formatDateShort } from "@/lib/helpers/date";
import { cn } from "@/lib/utils";
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
      <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
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
    <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
      <h2 className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
        Međusobni susreti
      </h2>

      <ul className="mx-auto mt-8 max-w-2xl divide-y divide-border/40">
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
  const outcomeStyle =
    ourGoals > theirGoals
      ? "bg-emerald-500 text-white"
      : ourGoals < theirGoals
        ? "bg-rose-500 text-white"
        : "bg-muted text-muted-foreground";

  const venueLabel = homeWasUs
    ? `${homeTeamName} (D)`
    : `${awayTeamName} (G)`;

  return (
    <li>
      <Link
        href={`/utakmice/${match.id}`}
        className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 py-3 transition-colors hover:bg-muted/30 sm:gap-5 sm:py-4"
      >
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-full text-[0.6rem] font-bold",
            outcomeStyle,
          )}
        >
          {outcomeLabel}
        </span>
        <span className="truncate text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          {venueLabel}
        </span>
        <span className="font-bold tabular-nums text-sm sm:text-base">
          {homeGoals}:{awayGoals}
        </span>
        <span className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
          {formatDateShort(match.dateTimeUTC ?? 0)}
        </span>
      </Link>
    </li>
  );
}
