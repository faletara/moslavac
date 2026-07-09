"use client";

import Link from "next/link";
import { useOurTeamId } from "@/components/providers/TenantProvider";
import { HnsCrest } from "@/components/HnsCrest";
import {
  buildScoreProgression,
  isGoalEvent,
  isSubstitutionEvent,
  type ScoreSnapshot,
} from "@/lib/helpers/events";
import { buildPlayerSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { Match, MatchEvent } from "@/types/hns";
import { EventIcon } from "../shared/EventIcon";

interface EventsTimelineProps {
  match: Match;
  events: MatchEvent[] | undefined;
}

/**
 * Editorial match timeline — kickoff / half-time / full-time land as distinct
 * bands, every event is a floating node with an oversized uppercase headline
 * (the player) and a muted label; goals carry the running score. No connecting
 * rail — the rhythm of the bands carries the eye. Navy/blue, kept airy.
 */
export default function EventsTimeline({ match, events }: EventsTimelineProps) {
  const moslavacTeamId = useOurTeamId();

  const visible = (events ?? [])
    .filter(
      (e) =>
        e.side != null &&
        ((e.player?.name ?? "").trim() !== "" || e.type.name),
    )
    .sort((a, b) => {
      const am = a.minute ?? 0;
      const bm = b.minute ?? 0;
      if (am !== bm) return am - bm;
      return (a.orderNumber ?? 0) - (b.orderNumber ?? 0);
    });

  if (visible.length === 0) return null;

  const competitionId = match.competition?.id ?? null;
  const homeIsMoslavac =
    moslavacTeamId != null && match.homeTeam?.id === moslavacTeamId;
  const homePicture = match.homeTeam?.picture ?? null;
  const awayPicture = match.awayTeam?.picture ?? null;
  const homeName = match.homeTeam?.name ?? "Domaći";
  const awayName = match.awayTeam?.name ?? "Gosti";

  const scoreMap = buildScoreProgression(events);
  const hasResult =
    match.score.home.current != null && match.score.away.current != null;
  const halfHome = match.score.home.half;
  const halfAway = match.score.away.half;
  const halfScore =
    halfHome != null && halfAway != null ? `${halfHome}:${halfAway}` : null;
  const finalScore = `${match.score.home.current ?? 0}:${match.score.away.current ?? 0}`;

  const minuteOf = (e: MatchEvent) => e.minute ?? 0;
  const firstHalf = visible.filter((e) => minuteOf(e) <= 45);
  const secondHalf = visible.filter((e) => minuteOf(e) > 45);

  const teamProps = (isHome: boolean) =>
    isHome
      ? { picture: homePicture, name: homeName }
      : { picture: awayPicture, name: awayName };

  return (
    <ol>
      <Marker label="Početak" />

      {firstHalf.map((event, i) => (
        <EventRow
          key={`${event.id ?? `f${i}`}`}
          event={event}
          competitionId={competitionId}
          homeIsMoslavac={homeIsMoslavac}
          team={teamProps(event.side === "home")}
          score={event.id != null ? scoreMap.get(event.id) ?? null : null}
        />
      ))}

      {(secondHalf.length > 0 || hasResult) && (
        <Marker label="Poluvrijeme" score={halfScore} />
      )}

      {secondHalf.map((event, i) => (
        <EventRow
          key={`${event.id ?? `s${i}`}`}
          event={event}
          competitionId={competitionId}
          homeIsMoslavac={homeIsMoslavac}
          team={teamProps(event.side === "home")}
          score={event.id != null ? scoreMap.get(event.id) ?? null : null}
        />
      ))}

      {hasResult && <Marker label="Kraj" score={finalScore} emphatic />}
    </ol>
  );
}

function Marker({
  label,
  score,
  emphatic = false,
}: {
  label: string;
  score?: string | null;
  emphatic?: boolean;
}) {
  return (
    <li className="my-5">
      <div
        className={cn(
          "flex items-center gap-4 px-4 py-4 sm:px-6",
          emphatic
            ? "dark bg-navy-deep text-foreground"
            : "border-y border-border bg-muted/60",
        )}
      >
        <span
          className={cn(
            "font-display font-black uppercase leading-none tracking-tight",
            emphatic
              ? "text-2xl sm:text-3xl"
              : "text-base text-muted-foreground sm:text-lg",
          )}
        >
          {label}
        </span>
        {score && (
          <span
            className={cn(
              "ml-auto font-display font-black tabular-nums leading-none",
              emphatic ? "text-2xl sm:text-3xl" : "text-lg",
            )}
          >
            {score}
          </span>
        )}
      </div>
    </li>
  );
}

function EventRow({
  event,
  competitionId,
  homeIsMoslavac,
  team,
  score,
}: {
  event: MatchEvent;
  competitionId: number | null;
  homeIsMoslavac: boolean;
  team: { picture: string | null; name: string };
  score: ScoreSnapshot | null;
}) {
  const minute = event.minute ?? 0;
  const stoppage = event.stoppageTime ?? 0;
  const minuteLabel = stoppage > 0 ? `${minute}+${stoppage}` : `${minute}`;

  const playerName = event.player?.name?.trim() ?? "";
  const secondaryPlayerName = event.secondaryPlayer?.name?.trim() ?? "";
  const eventTypeName = event.type.name;
  const personId = event.player?.personId ?? null;
  const eventIsMoslavac =
    (event.side === "home" && homeIsMoslavac) ||
    (event.side === "away" && !homeIsMoslavac);
  const isLinkable =
    eventIsMoslavac &&
    personId != null &&
    competitionId != null &&
    event.player?.hideProfile !== true;
  const isGoal = isGoalEvent(event);
  const isSub = isSubstitutionEvent(event);

  const title = playerName || eventTypeName;
  const subtitle = playerName ? eventTypeName : "";

  const TitleNode =
    isLinkable && playerName ? (
      <Link
        href={`/statistika/${buildPlayerSlug({ personId, name: playerName })}/${competitionId}`}
        className="transition-colors hover:text-primary"
      >
        {title}
      </Link>
    ) : (
      <span>{title}</span>
    );

  return (
    <li
      className={cn(
        "flex items-start gap-4 border-b border-border/40 px-4 py-6 sm:gap-5 sm:px-6 sm:py-7",
        isGoal && "bg-primary/[0.035]",
      )}
    >
      <span className="w-9 shrink-0 pt-1 text-right font-display text-base font-black tabular-nums leading-none text-foreground/50 sm:w-11 sm:text-lg">
        {minuteLabel}&apos;
      </span>

      <span className="flex w-9 shrink-0 justify-center pt-0.5">
        <EventNode eventTypeName={eventTypeName} isGoal={isGoal} isSub={isSub} />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 wrap-break-word font-display text-xl font-black uppercase leading-[0.9] tracking-tight sm:text-2xl">
            {TitleNode}
          </h3>
          {isGoal && score && (
            <span className="shrink-0 rounded bg-primary px-3.5 py-2 font-display text-sm font-black tabular-nums leading-none text-primary-foreground">
              {score.home}:{score.away}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <HnsCrest
            picture={team.picture}
            name={team.name}
            size={20}
            className="size-4 shrink-0"
          />
          {subtitle && (
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>

        {isSub && secondaryPlayerName && (
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground/70">
            ↔ {secondaryPlayerName}
          </span>
        )}
      </div>
    </li>
  );
}

function EventNode({
  eventTypeName,
  isGoal,
  isSub,
}: {
  eventTypeName: string;
  isGoal: boolean;
  isSub: boolean;
}) {
  if (isGoal) {
    return (
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <EventIcon typeName={eventTypeName} className="size-[1.15rem]" />
      </span>
    );
  }
  if (isSub) {
    return <EventIcon typeName={eventTypeName} className="size-5" />;
  }
  // Cards (and anything else) — bare glyph, scaled up for presence.
  return <EventIcon typeName={eventTypeName} className="scale-150" />;
}
