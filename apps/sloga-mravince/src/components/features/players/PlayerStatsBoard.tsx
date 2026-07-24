"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  AnimatedCounter,
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import { pluralize } from "@/lib/helpers/plural";
import { cn } from "@/lib/utils";

export interface PlayerStatsData {
  appearances: number;
  goals: number;
  yellowCards: number;
  redCards: number;
  fullMatches: number;
  penalties: number;
  ownGoals: number;
  minutesPlayed: number;
  competitionName: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const RASTER =
  "bg-[repeating-linear-gradient(115deg,transparent,transparent_11px,rgba(255,255,255,0.05)_11px,rgba(255,255,255,0.05)_22px)]";

/** Velika naglašena pločica — crvena ili ink, s ghost brojem i kontekstom. */
function FeatureTile({
  label,
  value,
  context,
  variant,
}: {
  label: string;
  value: number;
  context: string;
  variant: "red" | "ink";
}) {
  return (
    <div
      className={cn(
        "group relative flex min-h-56 flex-col overflow-hidden p-6 clip-corner sm:min-h-72 sm:p-8",
        variant === "red" ? "bg-club-red text-chalk" : "bg-ink-deep text-chalk",
      )}
    >
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0", RASTER)}
      />
      {/* Ghost broj u pozadini popunjava prostor */}
      <span
        aria-hidden
        className="[--text-stroke-color:rgba(255,255,255,0.16)] pointer-events-none absolute -bottom-8 -right-2 select-none font-display text-[11rem] leading-none tabular-nums text-transparent text-stroke transition-transform duration-500 group-hover:-translate-y-1 sm:text-[15rem]"
      >
        {value}
      </span>

      <span className="relative text-[0.62rem] font-bold uppercase tracking-[0.3em] text-chalk/70 sm:tracking-[0.32em]">
        {label}
      </span>

      <div className="relative mt-auto flex flex-col gap-3">
        <AnimatedCounter
          value={value}
          className="font-display text-7xl leading-[0.82] tabular-nums text-chalk sm:text-8xl"
        />
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-px w-6 bg-chalk/40" />
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-chalk/65">
            {context}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Manja pločica — svijetla, zlatni hairline na vrhu, crveni broj. */
function ChipTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="relative flex flex-col gap-3 border border-foreground/12 bg-muted/40 p-4 clip-corner sm:gap-4 sm:p-5">
      <span aria-hidden className="h-px w-8 bg-club-gold" />
      <AnimatedCounter
        value={value}
        className="font-display text-4xl leading-none tabular-nums text-foreground sm:text-5xl"
      />
      <span className="text-[0.55rem] font-bold uppercase leading-tight tracking-[0.22em] text-muted-foreground sm:tracking-[0.26em]">
        {label}
      </span>
    </div>
  );
}

export default function PlayerStatsBoard({
  stats,
  hasStats,
}: {
  stats: PlayerStatsData;
  hasStats: boolean;
}) {
  const reduced = useReducedMotion();

  if (!hasStats) {
    return (
      <div className="relative overflow-hidden border border-foreground/12 px-6 py-20 text-center clip-corner">
        <div
          aria-hidden
          className={cn("pointer-events-none absolute inset-0 opacity-[0.04]", RASTER)}
        />
        <p className="relative text-[0.62rem] font-bold uppercase tracking-[0.35em] text-muted-foreground">
          Statistika nije dostupna za ovo natjecanje
        </p>
      </div>
    );
  }

  const maxMinutes = stats.appearances * 90;
  const minutesPct =
    maxMinutes > 0
      ? Math.min(100, Math.max(0, (stats.minutesPlayed / maxMinutes) * 100))
      : 0;

  const goalsPerGame =
    stats.appearances > 0
      ? (stats.goals / stats.appearances).toFixed(2).replace(".", ",")
      : "0";
  const avgMinutes =
    stats.appearances > 0
      ? Math.round(stats.minutesPlayed / stats.appearances)
      : 0;

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Naslov sekcije */}
      <FadeInView className="flex items-center gap-4">
        <span aria-hidden className="h-px w-10 bg-club-red" />
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-muted-foreground sm:text-[0.62rem] sm:tracking-[0.32em]">
          Učinak{stats.competitionName ? ` — ${stats.competitionName}` : ""}
        </span>
      </FadeInView>

      {/* Featured pločice */}
      <StaggerContainer className="grid gap-4 sm:grid-cols-2" staggerChildren={0.1}>
        <StaggerItem>
          <FeatureTile
            label="Golovi"
            value={stats.goals}
            context={`${goalsPerGame} po nastupu`}
            variant="red"
          />
        </StaggerItem>
        <StaggerItem>
          <FeatureTile
            label="Nastupi"
            value={stats.appearances}
            context={pluralize(stats.fullMatches, {
              one: "puna utakmica",
              few: "pune utakmice",
              many: "punih utakmica",
            })}
            variant="ink"
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Chip mreža */}
      <StaggerContainer
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
        staggerChildren={0.06}
      >
        {[
          { label: "Žuti kartoni", value: stats.yellowCards },
          { label: "Crveni kartoni", value: stats.redCards },
          { label: "Pune utakmice", value: stats.fullMatches },
          { label: "Penali", value: stats.penalties },
          { label: "Autogolovi", value: stats.ownGoals },
        ].map((chip) => (
          <StaggerItem key={chip.label}>
            <ChipTile label={chip.label} value={chip.value} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Odigrane minute — puna traka s rasterom */}
      {maxMinutes > 0 && (
        <FadeInView className="relative overflow-hidden bg-ink-deep p-6 text-chalk clip-corner sm:p-8">
          <div
            aria-hidden
            className={cn("pointer-events-none absolute inset-0", RASTER)}
          />

          <div className="relative flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <span className="block text-[0.6rem] font-bold uppercase tracking-[0.28em] text-chalk/60 sm:tracking-[0.32em]">
                Odigrane minute
              </span>
              <span className="mt-2 flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-chalk/45">
                <span className="font-display text-base tabular-nums text-club-red">
                  {Math.round(minutesPct)}%
                </span>
                iskorišteno · Ø {avgMinutes} min
              </span>
            </div>
            <span className="font-display leading-none tabular-nums">
              <AnimatedCounter
                value={stats.minutesPlayed}
                className="text-5xl text-chalk sm:text-6xl"
              />
              <span className="text-sm text-chalk/45 sm:text-lg">
                {" / "}
                {maxMinutes}
              </span>
            </span>
          </div>

          <div className="relative mt-5 h-1.5 w-full overflow-hidden bg-white/12 sm:mt-6">
            <motion.div
              className="h-full bg-club-red"
              initial={reduced ? { width: `${minutesPct}%` } : { width: 0 }}
              whileInView={{ width: `${minutesPct}%` }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          </div>
        </FadeInView>
      )}
    </div>
  );
}
