"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useOurTeamId } from "@/components/providers/TenantProvider";
import { formatDateTime } from "@/lib/helpers/date";
import type { FormResult } from "@/lib/helpers/form";
import { buildMatchSlug } from "@/lib/slug";
import type { HnsMatch } from "@/types/hns";
import { TeamCrest } from "./TeamCrest";

interface PreviousMatchCardProps {
  match: HnsMatch;
}

const OUTCOME_LABEL: Record<FormResult, string> = {
  W: "Pobjeda",
  D: "Neriješeno",
  L: "Poraz",
};


function getOutcomeFromOurPerspective(
  match: HnsMatch,
  ourTeamId: number | null,
): FormResult | null {
  const home = match.homeTeamResult?.current;
  const away = match.awayTeamResult?.current;
  if (home == null || away == null) return null;

  const homeIsUs = ourTeamId != null && match.homeTeam?.id === ourTeamId;
  const awayIsUs = ourTeamId != null && match.awayTeam?.id === ourTeamId;
  if (!homeIsUs && !awayIsUs) return null;

  const goalsFor = homeIsUs ? home : away;
  const goalsAgainst = homeIsUs ? away : home;
  if (goalsFor > goalsAgainst) return "W";
  if (goalsFor < goalsAgainst) return "L";
  return "D";
}

function formatRound(round: string | null): string | null {
  if (!round) return null;
  const trimmed = round.trim();
  if (!trimmed) return null;
  return /^\d+$/.test(trimmed) ? `Kolo ${trimmed}` : trimmed;
}

function formatAttendance(value: number | null | undefined): string | null {
  if (value == null || value <= 0) return null;
  return `${new Intl.NumberFormat("hr-HR").format(value)} gledatelja`;
}

export function PreviousMatchCard({ match }: PreviousMatchCardProps) {
  const ourTeamId = useOurTeamId();
  const { date, time } = formatDateTime(match.dateTimeUTC ?? 0);
  const venue = match.facility?.place ?? match.facility?.name ?? null;
  const competition = match.competition?.name ?? null;
  const round = formatRound(match.round);
  const attendance = formatAttendance(match.attendance);
  const home = match.homeTeamResult?.current;
  const away = match.awayTeamResult?.current;
  const hasResult = home != null && away != null;
  const outcome = getOutcomeFromOurPerspective(match, ourTeamId);
  const outcomeLabel = outcome ? OUTCOME_LABEL[outcome] : null;

  const subInfo = [competition, round].filter(
    (p): p is string => typeof p === "string" && p.length > 0,
  );
  const metaParts = [date, time, venue, attendance].filter(
    (p): p is string => typeof p === "string" && p.length > 0,
  );

  const halfTime =
    match.homeTeamResult?.half != null && match.awayTeamResult?.half != null
      ? `${match.homeTeamResult.half} – ${match.awayTeamResult.half}`
      : null;

  const inner = (
    <article className="flex flex-col items-center gap-8 md:gap-10">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-center">
          Zadnji rezultat
        </h2>
        <div className="flex flex-col items-center gap-2">
          {outcome && outcomeLabel && (
            <span className="inline-flex items-center">
              {outcomeLabel}
            </span>
          )}
          {subInfo.length > 0 && (
            <p className="text-center">
              {subInfo.join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 md:gap-12">
        <TeamCrest team={match.homeTeam} size="md" className="w-full" />
        <div className="flex flex-col items-center gap-3">
          {hasResult ? (
            <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
              <span>
                {home}
              </span>
              <span aria-hidden>
                —
              </span>
              <span>
                {away}
              </span>
            </div>
          ) : (
            <span>
              —
            </span>
          )}
          {halfTime && (
            <span>
              Poluvrijeme {halfTime}
            </span>
          )}
        </div>
        <TeamCrest team={match.awayTeam} size="md" className="w-full" />
      </div>

      {metaParts.length > 0 && (
        <p className="text-center">
          {metaParts.join(" · ")}
        </p>
      )}

      {match.id != null && (
        <span className="inline-flex items-center gap-2">
          <span>Detalji utakmice</span>
          <ArrowRight className="size-3" strokeWidth={2.5} />
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
