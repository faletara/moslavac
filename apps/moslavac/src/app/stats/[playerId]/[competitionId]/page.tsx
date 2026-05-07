"use client";

import { track } from "@vercel/analytics";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api, getCometImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

const skeletonKeys = ["stat1", "stat2", "stat3", "stat4"];

export default function PlayerStatsPage() {
  const params = useParams();
  const playerId = String(params.playerId);
  const competitionId = Number(params.competitionId);

  const { data: playerDetails, isLoading: detailsLoading } =
    api.players.useGetPlayerDetails({
      personId: playerId,
      enabled: !!playerId,
    });

  const { data: playerStats, isLoading: statsLoading } =
    api.players.useGetPlayerStats({
      personId: playerId,
      competitionId,
      enabled: !!playerId && !!competitionId,
    });

  useEffect(() => {
    if (playerDetails) {
      track("Player Profile View", {
        player: playerDetails.name ?? "",
        playerId,
      });
    }
  }, [playerDetails, playerId]);

  if (detailsLoading || statsLoading) {
    return (
      <section className="mx-auto w-full max-w-5xl space-y-16 px-4 py-16 sm:py-24">
        <div className="flex flex-col items-center gap-8 text-center">
          <Skeleton className="size-32 rounded-full sm:size-40" />
          <Skeleton className="h-16 w-72" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-px bg-border/40 md:grid-cols-4">
          {skeletonKeys.map((key) => (
            <Skeleton key={key} className="h-32 rounded-none" />
          ))}
        </div>
      </section>
    );
  }

  if (!playerDetails) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-24 text-center">
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
          Igrač nije pronađen
        </p>
      </section>
    );
  }

  const playerName = playerDetails.name ?? "";
  const position = playerDetails.position ?? "";
  const age = playerDetails.age;
  const picture = playerDetails.picture;
  const shirtNumber = playerDetails.shirtNumber;
  const isCaptain = playerDetails.captain ?? false;

  const initials = playerName
    .split(/\s+/)
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const appearances = playerStats?.matchesPlayed ?? 0;
  const goals = playerStats?.goals ?? 0;
  const yellowCards = playerStats?.yellowCards ?? 0;
  const redCards = playerStats?.redCards ?? 0;
  const minutesPlayed = playerStats?.minutesPlayed ?? 0;
  const fullMatches = playerStats?.fullMatchesPlayed ?? 0;
  const penalties = playerStats?.penalties ?? 0;
  const ownGoals = playerStats?.ownGoals ?? 0;
  const competitionName = playerStats?.competition?.name ?? "";
  const maxMinutes = appearances * 90;
  const minutesPct = maxMinutes > 0 ? (minutesPlayed / maxMinutes) * 100 : 0;

  const eyebrowParts = [
    shirtNumber != null ? `#${String(shirtNumber).padStart(2, "0")}` : null,
    position || null,
    isCaptain ? "Kapetan" : null,
  ].filter(Boolean) as string[];

  const subEyebrowParts = [
    age != null ? `Dob · ${age}` : null,
    competitionName || null,
  ].filter(Boolean) as string[];

  return (
    <section className="mx-auto w-full max-w-5xl space-y-16 px-4 py-16 sm:space-y-20 sm:py-24">
      {/* Identity */}
      <header className="flex flex-col items-center gap-8 text-center">
        <span className="h-px w-12 bg-foreground" />

        {eyebrowParts.length > 0 && (
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
            {eyebrowParts.join(" · ")}
          </p>
        )}

        <Avatar className="size-32 sm:size-40">
          {picture && (
            <AvatarImage src={getCometImageUrl(picture)} alt={playerName} />
          )}
          <AvatarFallback className="bg-transparent text-base font-semibold uppercase tracking-wider text-muted-foreground">
            {initials || "?"}
          </AvatarFallback>
        </Avatar>

        <h1 className="select-none text-balance font-black uppercase leading-[0.85] tracking-tighter">
          <span className="block text-[14vw] sm:text-6xl md:text-7xl lg:text-8xl">
            {playerName}
          </span>
        </h1>

        {subEyebrowParts.length > 0 && (
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
            {subEyebrowParts.join(" · ")}
          </p>
        )}
      </header>

      {/* Stats */}
      {playerStats ? (
        <div className="space-y-px">
          <div className="grid grid-cols-2 divide-x divide-y divide-border/40 border-y border-border/60 md:grid-cols-4 md:divide-y-0">
            <StatCell label="Nastupi" value={appearances} tier="primary" />
            <StatCell label="Golovi" value={goals} tier="primary" />
            <StatCell label="Žuti kartoni" value={yellowCards} tier="primary" />
            <StatCell label="Crveni kartoni" value={redCards} tier="primary" />
          </div>
          <div className="grid grid-cols-3 divide-x divide-border/40 border-b border-border/60">
            <StatCell
              label="Pune utakmice"
              value={fullMatches}
              tier="secondary"
            />
            <StatCell label="Penali" value={penalties} tier="secondary" />
            <StatCell label="Autogolovi" value={ownGoals} tier="secondary" />
          </div>
        </div>
      ) : (
        <p className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
          Statistika nije dostupna za ovo natjecanje
        </p>
      )}

      {/* Minutes */}
      {playerStats && maxMinutes > 0 && (
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-4">
            <span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.65rem]">
              Odigrane minute
            </span>
            <span className="font-black tabular-nums leading-none tracking-tighter text-foreground">
              <span className="text-3xl sm:text-5xl">{minutesPlayed}</span>
              <span className="text-base text-muted-foreground sm:text-lg">
                {" / "}
                {maxMinutes}
              </span>
            </span>
          </div>

          <Progress
            value={Math.min(100, Math.max(0, minutesPct))}
            className="h-[2px] rounded-none bg-border/40 *:data-[slot=progress-indicator]:bg-foreground"
          />
        </div>
      )}
    </section>
  );
}

function StatCell({
  label,
  value,
  tier,
}: {
  label: string;
  value: number;
  tier: "primary" | "secondary";
}) {
  const isPrimary = tier === "primary";
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-4 text-center",
        isPrimary ? "py-10 sm:py-14" : "py-6 sm:py-8",
      )}
    >
      <span
        className={cn(
          "font-black tabular-nums leading-none tracking-tighter",
          isPrimary
            ? "text-5xl text-foreground sm:text-7xl"
            : "text-2xl text-muted-foreground sm:text-3xl",
        )}
      >
        {value}
      </span>
      <span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.65rem]">
        {label}
      </span>
    </div>
  );
}
