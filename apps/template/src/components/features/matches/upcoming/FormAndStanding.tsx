"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getCometImageUrl } from "@/lib/api";
import { getRecentForm, type FormResult } from "@/lib/helpers/form";
import { cn } from "@/lib/utils";
import type { HnsMatch, TeamRanking } from "@/types/hns";

interface FormAndStandingProps {
  homeTeamId: number | null;
  awayTeamId: number | null;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamPicture: string | null;
  awayTeamPicture: string | null;
  competitionMatches: HnsMatch[] | undefined;
  standings: TeamRanking[] | undefined;
  isLoading: boolean;
}

export default function FormAndStanding({
  homeTeamId,
  awayTeamId,
  homeTeamName,
  awayTeamName,
  homeTeamPicture,
  awayTeamPicture,
  competitionMatches,
  standings,
  isLoading,
}: FormAndStandingProps) {
  if (isLoading) {
    return (
      <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
        <Skeleton className="mx-auto h-4 w-32" />
        <div className="mt-10 space-y-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </section>
    );
  }

  if (!homeTeamId || !awayTeamId) return null;

  const homeRanking = standings?.find((r) => r.team?.id === homeTeamId);
  const awayRanking = standings?.find((r) => r.team?.id === awayTeamId);
  const homeForm = competitionMatches
    ? getRecentForm(competitionMatches, homeTeamId)
    : [];
  const awayForm = competitionMatches
    ? getRecentForm(competitionMatches, awayTeamId)
    : [];

  const hasAnyData =
    homeRanking || awayRanking || homeForm.length > 0 || awayForm.length > 0;

  if (!hasAnyData) return null;

  const stats: ComparisonStat[] = [];
  if (homeRanking || awayRanking) {
    stats.push({
      label: "Pozicija",
      home: homeRanking?.position ?? null,
      away: awayRanking?.position ?? null,
      lowerBetter: true,
      format: (v) => `${v}.`,
    });
    stats.push({
      label: "Bodovi",
      home: homeRanking?.points ?? null,
      away: awayRanking?.points ?? null,
    });
    stats.push({
      label: "Postignuti golovi",
      home: homeRanking?.goalsFor ?? null,
      away: awayRanking?.goalsFor ?? null,
    });
    stats.push({
      label: "Primljeni golovi",
      home: homeRanking?.goalsAgainst ?? null,
      away: awayRanking?.goalsAgainst ?? null,
      lowerBetter: true,
    });
  }

  return (
    <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
      <h2 className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
        Forma i tablica
      </h2>

      <div className="mx-auto mt-10 max-w-2xl">
        <TeamHeaders
          homeName={homeTeamName}
          homePicture={homeTeamPicture}
          awayName={awayTeamName}
          awayPicture={awayTeamPicture}
        />

        {stats.length > 0 && (
          <div className="mt-8 flex flex-col gap-5">
            {stats.map((stat) => (
              <StatRow key={stat.label} stat={stat} />
            ))}
          </div>
        )}

        {(homeForm.length > 0 || awayForm.length > 0) && (
          <FormRow
            homeForm={homeForm.map((s) => s.result)}
            awayForm={awayForm.map((s) => s.result)}
          />
        )}
      </div>
    </section>
  );
}

interface ComparisonStat {
  label: string;
  home: number | null;
  away: number | null;
  lowerBetter?: boolean;
  format?: (v: number) => string;
}

function TeamHeaders({
  homeName,
  homePicture,
  awayName,
  awayPicture,
}: {
  homeName: string;
  homePicture: string | null;
  awayName: string;
  awayPicture: string | null;
}) {
  return (
    <div className="grid grid-cols-3 items-center gap-3">
      <TeamHeader name={homeName} picture={homePicture} align="left" />
      <span className="text-center text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground/70 sm:text-[0.6rem]">
        vs
      </span>
      <TeamHeader name={awayName} picture={awayPicture} align="right" />
    </div>
  );
}

function TeamHeader({
  name,
  picture,
  align,
}: {
  name: string;
  picture: string | null;
  align: "left" | "right";
}) {
  const isRight = align === "right";
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        isRight ? "flex-row-reverse text-right" : "text-left",
      )}
    >
      <Avatar className="size-10 shrink-0 sm:size-12">
        {picture && <AvatarImage src={getCometImageUrl(picture)} alt={name} />}
        <AvatarFallback className="text-[0.55rem] font-semibold uppercase tracking-[0.15em]">
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="line-clamp-2 text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.15em] sm:text-xs sm:tracking-[0.2em]">
        {name}
      </span>
    </div>
  );
}

function StatRow({ stat }: { stat: ComparisonStat }) {
  const home = stat.home;
  const away = stat.away;
  const fmt = stat.format ?? ((v: number) => String(v));

  let homeShare = 0.5;
  let awayShare = 0.5;
  let homeIsBetter = false;
  let awayIsBetter = false;

  if (home != null && away != null) {
    if (stat.lowerBetter) {
      const inv1 = home === 0 ? 1 : 1 / home;
      const inv2 = away === 0 ? 1 : 1 / away;
      const total = inv1 + inv2;
      homeShare = total > 0 ? inv1 / total : 0.5;
      awayShare = total > 0 ? inv2 / total : 0.5;
      homeIsBetter = home < away;
      awayIsBetter = away < home;
    } else {
      const total = home + away;
      homeShare = total > 0 ? home / total : 0.5;
      awayShare = total > 0 ? away / total : 0.5;
      homeIsBetter = home > away;
      awayIsBetter = away > home;
    }
  }

  const homePct = `${Math.max(homeShare * 100, 4).toFixed(1)}%`;
  const awayPct = `${Math.max(awayShare * 100, 4).toFixed(1)}%`;

  return (
    <div className="grid grid-cols-[3rem_1fr_3rem] items-center gap-3 sm:grid-cols-[3.5rem_1fr_3.5rem] sm:gap-4">
      <span
        className={cn(
          "text-right tabular-nums",
          homeIsBetter
            ? "font-bold text-foreground"
            : "font-medium text-muted-foreground",
        )}
      >
        {home != null ? fmt(home) : "—"}
      </span>

      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[0.55rem] font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.3em]">
          {stat.label}
        </span>
        <div className="flex h-1.5 w-full items-stretch gap-0.5">
          <div className="flex flex-1 justify-end">
            <span
              className={cn(
                "block h-full rounded-l-sm",
                homeIsBetter ? "bg-foreground" : "bg-muted-foreground/40",
              )}
              style={{ width: home != null && away != null ? homePct : "0%" }}
            />
          </div>
          <div className="flex flex-1 justify-start">
            <span
              className={cn(
                "block h-full rounded-r-sm",
                awayIsBetter ? "bg-foreground" : "bg-muted-foreground/40",
              )}
              style={{ width: home != null && away != null ? awayPct : "0%" }}
            />
          </div>
        </div>
      </div>

      <span
        className={cn(
          "text-left tabular-nums",
          awayIsBetter
            ? "font-bold text-foreground"
            : "font-medium text-muted-foreground",
        )}
      >
        {away != null ? fmt(away) : "—"}
      </span>
    </div>
  );
}

function FormRow({
  homeForm,
  awayForm,
}: {
  homeForm: FormResult[];
  awayForm: FormResult[];
}) {
  return (
    <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-border/40 pt-8 sm:gap-6">
      <FormStrip form={homeForm} align="right" />
      <span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground/70 sm:text-[0.6rem]">
        Forma
      </span>
      <FormStrip form={awayForm} align="left" />
    </div>
  );
}

function FormStrip({
  form,
  align,
}: {
  form: FormResult[];
  align: "left" | "right";
}) {
  if (form.length === 0) {
    return (
      <span
        className={cn(
          "text-[0.55rem] font-medium uppercase tracking-[0.2em] text-muted-foreground/60",
          align === "right" ? "text-right" : "text-left",
        )}
      >
        Nema podataka
      </span>
    );
  }

  const ordered = align === "right" ? [...form].reverse() : form;

  return (
    <div
      className={cn(
        "flex gap-1.5",
        align === "right" ? "justify-end" : "justify-start",
      )}
    >
      {ordered.map((result, i) => (
        <FormDot key={`${align}-${i}-${result}`} result={result} />
      ))}
    </div>
  );
}

function FormDot({ result }: { result: FormResult }) {
  const styles: Record<FormResult, string> = {
    W: "bg-emerald-500 text-white",
    D: "bg-muted text-muted-foreground",
    L: "bg-rose-500 text-white",
  };
  return (
    <span
      role="img"
      className={cn(
        "flex size-6 items-center justify-center rounded-full text-[0.6rem] font-bold uppercase",
        styles[result],
      )}
      aria-label={
        result === "W" ? "Pobjeda" : result === "D" ? "Neriješeno" : "Poraz"
      }
    >
      {result === "W" ? "P" : result === "D" ? "N" : "I"}
    </span>
  );
}
