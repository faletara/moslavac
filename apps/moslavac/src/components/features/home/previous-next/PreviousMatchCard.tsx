"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedLine, FadeInView } from "@/components/animations";
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

const OUTCOME_CHIP: Record<FormResult, string> = {
  W: "bg-foreground text-background border-foreground",
  D: "border-foreground/50 text-foreground/70",
  L: "border-foreground/30 text-foreground/40",
};

function isMoslavac(name: string | null | undefined): boolean {
  return !!name && /moslavac/i.test(name);
}

function getOutcomeFromMoslavacPerspective(
  match: HnsMatch,
): FormResult | null {
  const home = match.homeTeamResult?.current;
  const away = match.awayTeamResult?.current;
  if (home == null || away == null) return null;

  const homeIsUs = isMoslavac(match.homeTeam?.name);
  const awayIsUs = isMoslavac(match.awayTeam?.name);
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
  const { date, time } = formatDateTime(match.dateTimeUTC ?? 0);
  const venue = match.facility?.place ?? match.facility?.name ?? null;
  const competition = match.competition?.name ?? null;
  const round = formatRound(match.round);
  const attendance = formatAttendance(match.attendance);
  const home = match.homeTeamResult?.current;
  const away = match.awayTeamResult?.current;
  const hasResult = home != null && away != null;
  const outcome = getOutcomeFromMoslavacPerspective(match);
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
      <FadeInView>
        <div className="flex flex-col items-center gap-4">
          <AnimatedLine className="mx-auto" />
          <h2 className="text-center text-3xl font-black uppercase leading-none tracking-tighter md:text-4xl">
            Zadnji rezultat
          </h2>
          <div className="flex flex-col items-center gap-2">
            {outcome && outcomeLabel && (
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.35em] sm:text-xs ${OUTCOME_CHIP[outcome]}`}
              >
                {outcomeLabel}
              </span>
            )}
            {subInfo.length > 0 && (
              <p className="text-center text-sm font-light text-muted-foreground sm:text-base">
                {subInfo.join(", ")}
              </p>
            )}
          </div>
        </div>
      </FadeInView>

      <FadeInView delay={0.1}>
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 md:gap-12">
          <TeamCrest team={match.homeTeam} size="md" className="w-full" />
          <div className="flex flex-col items-center gap-3">
            {hasResult ? (
              <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
                <span className="text-6xl font-black tabular-nums leading-none sm:text-7xl md:text-8xl">
                  {home}
                </span>
                <span
                  aria-hidden
                  className="text-3xl font-black leading-none text-foreground/25 sm:text-4xl md:text-5xl"
                >
                  —
                </span>
                <span className="text-6xl font-black tabular-nums leading-none sm:text-7xl md:text-8xl">
                  {away}
                </span>
              </div>
            ) : (
              <span className="text-5xl font-black tabular-nums leading-none text-foreground/40 sm:text-6xl md:text-7xl">
                —
              </span>
            )}
            {halfTime && (
              <span className="text-xs font-light text-muted-foreground sm:text-sm">
                Poluvrijeme {halfTime}
              </span>
            )}
          </div>
          <TeamCrest team={match.awayTeam} size="md" className="w-full" />
        </div>
      </FadeInView>

      {metaParts.length > 0 && (
        <FadeInView delay={0.3}>
          <p className="text-center text-sm font-light text-muted-foreground sm:text-base">
            {metaParts.join(" · ")}
          </p>
        </FadeInView>
      )}

      {match.id != null && (
        <FadeInView delay={0.4}>
          <span className="group inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.35em] text-muted-foreground transition-colors duration-300 hover:text-foreground sm:text-xs">
            <span>Detalji utakmice</span>
            <ArrowRight
              className="size-3 transition-transform duration-300 group-hover:translate-x-1"
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
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link href={`/utakmice/${buildMatchSlug(match)}`} className="block">
        {inner}
      </Link>
    </motion.div>
  );
}
