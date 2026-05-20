"use client";

import Link from "next/link";
import { AnimatedCounter, AnimatedLine, FadeInView } from "@/components/animations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCometImageUrl } from "@/lib/api";
import { getScorers, type ScorerEntry } from "@/lib/helpers/events";
import { cn } from "@/lib/utils";
import type { HnsMatch, HnsMatchEvent } from "@/types/hns";

interface RichScorersSectionProps {
  match: HnsMatch;
  events: HnsMatchEvent[] | undefined;
}

export default function RichScorersSection({
  match,
  events,
}: RichScorersSectionProps) {
  const scorers = getScorers(events);
  const hasAny = scorers.home.length > 0 || scorers.away.length > 0;
  if (!hasAny) return null;

  const homeGoals = match.homeTeamResult?.current ?? 0;
  const awayGoals = match.awayTeamResult?.current ?? 0;
  const competitionId = match.competition?.id ?? null;

  return (
    <section className="mt-20 sm:mt-28">
      <FadeInView>
        <div className="flex flex-col items-center gap-6 text-center">
          <AnimatedLine className="mx-auto" />
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
            Tko je tresao mreže
          </p>
          <h2 className="select-none font-black uppercase leading-[0.85] tracking-tighter text-[14vw] sm:text-6xl md:text-7xl">
            Strijelci
          </h2>
        </div>
      </FadeInView>

      <FadeInView delay={0.1}>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 divide-x divide-border/40">
          <TeamScorersColumn
            teamName={match.homeTeam?.name ?? "Domaći"}
            teamPicture={match.homeTeam?.picture ?? null}
            scorers={scorers.home}
            totalGoals={homeGoals}
            competitionId={competitionId}
            align="right"
          />
          <TeamScorersColumn
            teamName={match.awayTeam?.name ?? "Gosti"}
            teamPicture={match.awayTeam?.picture ?? null}
            scorers={scorers.away}
            totalGoals={awayGoals}
            competitionId={competitionId}
            align="left"
          />
        </div>
      </FadeInView>
    </section>
  );
}

function TeamScorersColumn({
  teamName,
  teamPicture,
  scorers,
  totalGoals,
  competitionId,
  align,
}: {
  teamName: string;
  teamPicture: string | null;
  scorers: ScorerEntry[];
  totalGoals: number;
  competitionId: number | null;
  align: "left" | "right";
}) {
  const isRight = align === "right";
  const teamInitials = teamName.slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "flex flex-col gap-5 px-3 sm:gap-6 sm:px-6 lg:px-10",
        isRight ? "items-end text-right" : "items-start text-left",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center gap-2 sm:gap-3",
          isRight ? "flex-row-reverse" : "flex-row",
        )}
      >
        <Avatar className="size-9 shrink-0 sm:size-10">
          {teamPicture && (
            <AvatarImage src={getCometImageUrl(teamPicture)} alt={teamName} />
          )}
          <AvatarFallback className="text-[0.55rem] font-semibold uppercase tracking-[0.15em]">
            {teamInitials}
          </AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-0.5",
            isRight ? "items-end" : "items-start",
          )}
        >
          <span className="text-[0.5rem] font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.55rem] sm:tracking-[0.3em]">
            {isRight ? "Domaći" : "Gosti"}
          </span>
          <span className="line-clamp-2 text-[0.65rem] font-black uppercase leading-tight tracking-tight sm:text-xs">
            {teamName}
          </span>
        </div>
      </div>

      <AnimatedCounter
        value={totalGoals}
        className="font-black tabular-nums leading-none tracking-tighter text-4xl sm:text-6xl md:text-7xl"
      />

      {scorers.length === 0 ? (
        <p className="text-xs text-muted-foreground/60">Bez strijelaca</p>
      ) : (
        <ul
          className={cn(
            "flex w-full flex-col gap-3",
            isRight && "items-end",
          )}
        >
          {scorers.map((s, idx) => (
            <ScorerRow
              key={`${s.name}-${idx}`}
              scorer={s}
              competitionId={competitionId}
              align={align}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ScorerRow({
  scorer,
  competitionId,
  align,
}: {
  scorer: ScorerEntry;
  competitionId: number | null;
  align: "left" | "right";
}) {
  const isRight = align === "right";
  const isLinkable = scorer.personId != null && competitionId != null;
  const initials = scorer.name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const NameNode = isLinkable ? (
    <Link
      href={`/statistika/${scorer.personId}/${competitionId}`}
      className="line-clamp-2 font-black uppercase leading-tight tracking-tight text-xs sm:text-sm md:text-base transition-colors hover:underline"
    >
      {scorer.name}
    </Link>
  ) : (
    <span className="line-clamp-2 font-black uppercase leading-tight tracking-tight text-xs sm:text-sm md:text-base">
      {scorer.name}
    </span>
  );

  return (
    <li
      className={cn(
        "flex w-full items-center gap-2 sm:gap-3",
        isRight && "flex-row-reverse",
      )}
    >
      <Avatar className="size-8 shrink-0 sm:size-10">
        {scorer.picture && (
          <AvatarImage
            src={getCometImageUrl(scorer.picture)}
            alt={scorer.name}
          />
        )}
        <AvatarFallback className="text-[0.55rem] font-semibold uppercase tracking-[0.15em]">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-1",
          isRight && "items-end",
        )}
      >
        {NameNode}
        <div
          className={cn(
            "flex flex-wrap items-center gap-1",
            isRight && "justify-end",
          )}
        >
          {scorer.goals.map((g, i) => (
            <span
              key={`${g.minute}-${g.isMissedPenalty ? "m" : g.isPenalty ? "p" : "g"}-${i}`}
              title={
                g.isMissedPenalty
                  ? "Promašen kazneni udarac"
                  : g.isPenalty
                    ? "Pogodak iz kaznenog udarca"
                    : undefined
              }
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[0.55rem] font-medium tabular-nums sm:px-2 sm:text-[0.6rem]",
                g.isMissedPenalty
                  ? "border-dashed border-muted-foreground/40 bg-transparent text-muted-foreground/60 line-through"
                  : "border-border bg-background text-foreground",
              )}
            >
              {g.minute}&apos;{g.isMissedPenalty ? " p×" : g.isPenalty ? " p" : ""}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}
