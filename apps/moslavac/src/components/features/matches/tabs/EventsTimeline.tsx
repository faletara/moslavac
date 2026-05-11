"use client";

import Link from "next/link";
import { AnimatedLine, FadeInView } from "@/components/animations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCometImageUrl } from "@/lib/api";
import {
  buildScoreProgression,
  isGoalEvent,
  isSubstitutionEvent,
  type ScoreSnapshot,
} from "@/lib/helpers/events";
import { cn } from "@/lib/utils";
import type { HnsMatch, HnsMatchEvent } from "@/types/hns";
import { EventIcon } from "../shared/EventIcon";

interface EventsTimelineProps {
  match: HnsMatch;
  events: HnsMatchEvent[] | undefined;
}

export default function EventsTimeline({ match, events }: EventsTimelineProps) {
  const visibleEvents =
    events?.filter(
      (e) =>
        (e.homeTeam === true || e.homeTeam === false) &&
        ((e.player?.name ?? "").trim() !== "" || e.eventType?.name),
    ) ?? [];

  if (visibleEvents.length === 0) return null;

  const competitionId = match.competition?.id ?? null;
  const homeName = match.homeTeam?.name ?? "Domaći";
  const awayName = match.awayTeam?.name ?? "Gosti";
  const homePicture = match.homeTeam?.picture ?? null;
  const awayPicture = match.awayTeam?.picture ?? null;
  const scoreMap = buildScoreProgression(events);

  return (
    <section className="mt-20 sm:mt-28">
      <FadeInView>
        <div className="flex flex-col items-center gap-6 text-center">
          <AnimatedLine className="mx-auto" />
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
            Tijek utakmice
          </p>
          <h2 className="select-none font-black uppercase leading-[0.85] tracking-tighter text-[14vw] sm:text-6xl md:text-7xl">
            Događaji
          </h2>
        </div>
      </FadeInView>

      <FadeInView delay={0.1}>
        <div className="mx-auto mt-12 max-w-3xl">
          <TeamsHeader
            homeName={homeName}
            homePicture={homePicture}
            awayName={awayName}
            awayPicture={awayPicture}
          />

          <div className="relative mt-8">
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border/60"
            />
            <ol className="flex flex-col gap-1 sm:gap-2">
              {visibleEvents.map((event, i) => (
                <EventRow
                  key={`${event.eventId ?? i}`}
                  event={event}
                  competitionId={competitionId}
                  score={
                    event.eventId != null
                      ? scoreMap.get(event.eventId) ?? null
                      : null
                  }
                />
              ))}
            </ol>
          </div>
        </div>
      </FadeInView>
    </section>
  );
}

function TeamsHeader({
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
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border/40 pb-6 sm:gap-8">
      <div className="flex items-center justify-end gap-3 text-right">
        <div className="flex min-w-0 flex-col items-end gap-0.5">
          <span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Domaći
          </span>
          <span className="text-[0.7rem] font-black uppercase tracking-tight sm:text-sm">
            {homeName}
          </span>
        </div>
        <Avatar className="size-10 shrink-0 sm:size-12">
          {homePicture && (
            <AvatarImage src={getCometImageUrl(homePicture)} alt={homeName} />
          )}
          <AvatarFallback className="text-[0.6rem] font-semibold uppercase">
            {homeName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground/80">
        VS
      </span>

      <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0 sm:size-12">
          {awayPicture && (
            <AvatarImage src={getCometImageUrl(awayPicture)} alt={awayName} />
          )}
          <AvatarFallback className="text-[0.6rem] font-semibold uppercase">
            {awayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col items-start gap-0.5">
          <span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Gosti
          </span>
          <span className="text-[0.7rem] font-black uppercase tracking-tight sm:text-sm">
            {awayName}
          </span>
        </div>
      </div>
    </div>
  );
}

function EventRow({
  event,
  competitionId,
  score,
}: {
  event: HnsMatchEvent;
  competitionId: number | null;
  score: ScoreSnapshot | null;
}) {
  const isHome = event.homeTeam === true;
  const minute = event.minuteFull ?? event.minute ?? 0;
  const stoppage = event.stoppageTime ?? 0;
  const minuteLabel = stoppage > 0 ? `${minute}+${stoppage}` : `${minute}`;

  const playerName = event.player?.name?.trim() ?? "";
  const player2Name = event.player2?.name?.trim() ?? "";
  const eventTypeName = event.eventType?.name ?? "";
  const personId = event.player?.personId ?? null;
  const isLinkable =
    personId != null &&
    competitionId != null &&
    event.player?.hideProfile !== true;
  const picture = event.player?.picture ?? null;
  const isGoal = isGoalEvent(event);
  const isSub = isSubstitutionEvent(event);

  const NameNode = isLinkable ? (
    <Link
      href={`/stats/${personId}/${competitionId}`}
      className="font-black uppercase leading-tight tracking-tight transition-colors hover:underline text-sm sm:text-base"
    >
      {playerName}
    </Link>
  ) : (
    <span className="font-black uppercase leading-tight tracking-tight text-sm sm:text-base">
      {playerName}
    </span>
  );

  const PlayerCell = (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3",
        isHome ? "flex-row-reverse text-right" : "flex-row text-left",
      )}
    >
      <Avatar className="size-10 shrink-0">
        {picture && (
          <AvatarImage src={getCometImageUrl(picture)} alt={playerName} />
        )}
        <AvatarFallback className="text-[0.6rem] font-semibold uppercase">
          {playerName
            ? playerName
                .split(" ")
                .map((p) => p[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase()
            : "?"}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex min-w-0 flex-col gap-1",
          isHome ? "items-end" : "items-start",
        )}
      >
        {NameNode}
        <div
          className={cn(
            "flex items-center gap-1.5",
            isHome && "flex-row-reverse",
          )}
        >
          <EventIcon eventType={eventTypeName} />
          <span className="text-[0.55rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {eventTypeName}
          </span>
        </div>
        {isSub && player2Name && (
          <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground/70">
            ↔ {player2Name}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <li className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-4 sm:gap-6">
      {isHome ? PlayerCell : <div />}

      <div className="z-10 flex flex-col items-center gap-1">
        <span
          className={cn(
            "inline-flex min-w-12 justify-center rounded-full border bg-background px-2.5 py-1 text-xs font-black tabular-nums",
            isGoal
              ? "border-foreground text-foreground"
              : "border-border text-muted-foreground",
          )}
        >
          {minuteLabel}&apos;
        </span>
        {isGoal && score && (
          <span className="text-[0.6rem] font-black tabular-nums tracking-tight text-foreground">
            {score.home}:{score.away}
          </span>
        )}
      </div>

      {!isHome ? PlayerCell : <div />}
    </li>
  );
}
