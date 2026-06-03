"use client";

import { HnsCrest } from "@/components/HnsCrest";
import { Skeleton } from "@/components/ui/skeleton";
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
      <section className="mt-16 pt-12 sm:mt-20">
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
    <section className="mt-16 pt-12 sm:mt-20">
      <h2 className="text-center">
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
      <span className="text-center">
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
        isRight ? "flex-row-reverse" : "",
      )}
    >
      <HnsCrest
        picture={picture}
        name={name}
        size={48}
        className="size-10 shrink-0 sm:size-12"
      />
      <span className="line-clamp-2">
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

  if (home != null && away != null) {
    if (stat.lowerBetter) {
      const inv1 = home === 0 ? 1 : 1 / home;
      const inv2 = away === 0 ? 1 : 1 / away;
      const total = inv1 + inv2;
      homeShare = total > 0 ? inv1 / total : 0.5;
      awayShare = total > 0 ? inv2 / total : 0.5;
    } else {
      const total = home + away;
      homeShare = total > 0 ? home / total : 0.5;
      awayShare = total > 0 ? away / total : 0.5;
    }
  }

  const homePct = `${Math.max(homeShare * 100, 4).toFixed(1)}%`;
  const awayPct = `${Math.max(awayShare * 100, 4).toFixed(1)}%`;

  return (
    <div className="grid grid-cols-[3rem_1fr_3rem] items-center gap-3 sm:grid-cols-[3.5rem_1fr_3.5rem] sm:gap-4">
      <span className="text-right">
        {home != null ? fmt(home) : "—"}
      </span>

      <div className="flex flex-col items-center gap-1.5">
        <span>
          {stat.label}
        </span>
        <div className="flex h-1.5 w-full items-stretch gap-0.5">
          <div className="flex flex-1 justify-end">
            <span
              className="block h-full"
              style={{ width: home != null && away != null ? homePct : "0%" }}
            />
          </div>
          <div className="flex flex-1 justify-start">
            <span
              className="block h-full"
              style={{ width: home != null && away != null ? awayPct : "0%" }}
            />
          </div>
        </div>
      </div>

      <span className="text-left">
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
    <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-3 pt-8 sm:gap-6">
      <FormStrip form={homeForm} align="right" />
      <span>
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
  return (
    <span
      role="img"
      className="flex size-6 items-center justify-center"
      aria-label={
        result === "W" ? "Pobjeda" : result === "D" ? "Neriješeno" : "Poraz"
      }
    >
      {result === "W" ? "P" : result === "D" ? "N" : "I"}
    </span>
  );
}
