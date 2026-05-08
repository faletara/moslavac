"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedLine, FadeInView } from "@/components/animations";
import { formatDateTime } from "@/lib/helpers/date";
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
      <FadeInView>
        <div className="flex flex-col items-center gap-3">
          <AnimatedLine className="mx-auto" />
          <p className="text-center text-sm font-black uppercase tracking-[0.4em] sm:text-base">
            Sljedeća utakmica
          </p>
          {subEyebrow.length > 0 && (
            <p className="text-center text-sm font-light text-muted-foreground sm:text-base">
              {subEyebrow.join(", ")}
            </p>
          )}
        </div>
      </FadeInView>

      <FadeInView delay={0.1}>
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-12 md:gap-16">
          <TeamCrest team={match.homeTeam} size="lg" className="w-full" />
          <span className="text-3xl font-black uppercase tracking-[0.2em] text-foreground/80 sm:text-4xl md:text-5xl">
            vs
          </span>
          <TeamCrest team={match.awayTeam} size="lg" className="w-full" />
        </div>
      </FadeInView>

      <CountdownTiles targetUtc={match.dateTimeUTC ?? null} size="hero" />

      <FadeInView delay={0.5}>
        <p className="text-center text-sm font-light text-muted-foreground sm:text-base">
          {venueAndDate.join(" · ")}
        </p>
      </FadeInView>

      {match.id != null && (
        <FadeInView delay={0.6}>
          <span className="group inline-flex items-center gap-3 rounded-full border border-foreground px-7 py-3 text-[0.7rem] font-bold uppercase tracking-[0.35em] transition-colors duration-300 hover:bg-foreground hover:text-background sm:text-xs">
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
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link href={`/matches/${match.id}`} className="block">
        {inner}
      </Link>
    </motion.div>
  );
}
