"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import { useOurTeamId } from "@/components/providers/TenantProvider";
import {
  buildScoreProgression,
  isGoalEvent,
  isRedCardEvent,
  isSubstitutionEvent,
  isYellowCardEvent,
  type ScoreSnapshot,
} from "@/lib/helpers/events";
import { buildPlayerSlug } from "@/lib/helpers/slug";
import { cn } from "@/lib/utils";
import type { Match, MatchEvent } from "@/types/hns";
import { EventIcon } from "../shared/EventIcon";

interface EventsTimelineProps {
  match: Match;
  events: MatchEvent[] | undefined;
}

/**
 * Broadcast run of play. Events hang off a single rail; the ordinary ones stay
 * quiet on chalk while goals land as dark navy plates carrying the new score —
 * so the eye can find "when did we score" without reading a word.
 *
 * Every row is a 3-column grid whose last column is `minmax(0,1fr)`, and the
 * score sits INSIDE that column rather than in a rigid `shrink-0` one at the
 * edge. That is deliberate: the page clips overflow (`overflow-x: clip` on
 * body), so a rigid trailing column silently amputates itself on narrow screens
 * instead of wrapping — which is exactly how the score went missing before.
 */
export default function EventsTimeline({ match, events }: EventsTimelineProps) {
  const moslavacTeamId = useOurTeamId();
  const reduced = useReducedMotion();

  const visible = (events ?? [])
    .filter(
      (e) => e.side != null && ((e.player?.name ?? "").trim() !== "" || e.type.name),
    )
    // Stoppage time MUST break the tie before `orderNumber` does. A 45' and a
    // 45+1' event both report `minute: 45`, and HNS's `orderNumber` is not
    // reliably chronological between them — it has been seen numbering the 45'
    // goal after the 45+1' one, which rendered them back to front.
    .sort((a, b) => {
      const am = a.minute ?? 0;
      const bm = b.minute ?? 0;
      if (am !== bm) return am - bm;
      const as = a.stoppageTime ?? 0;
      const bs = b.stoppageTime ?? 0;
      if (as !== bs) return as - bs;
      return (a.orderNumber ?? 0) - (b.orderNumber ?? 0);
    });

  if (visible.length === 0) return null;

  const competitionId = match.competition?.id ?? null;
  const homeIsMoslavac =
    moslavacTeamId != null && match.homeTeam?.id === moslavacTeamId;
  const homeTeam = {
    picture: match.homeTeam?.picture ?? null,
    name: match.homeTeam?.name ?? "Domaći",
  };
  const awayTeam = {
    picture: match.awayTeam?.picture ?? null,
    name: match.awayTeam?.name ?? "Gosti",
  };

  const scoreMap = buildScoreProgression(events);
  const hasResult =
    match.score.home.current != null && match.score.away.current != null;
  const halfHome = match.score.home.half;
  const halfAway = match.score.away.half;
  const halfScore =
    halfHome != null && halfAway != null ? `${halfHome}:${halfAway}` : null;
  const finalScore = `${match.score.home.current ?? 0}:${match.score.away.current ?? 0}`;

  const firstHalf = visible.filter((e) => (e.minute ?? 0) <= 45);
  const secondHalf = visible.filter((e) => (e.minute ?? 0) > 45);

  let step = 0;
  const rows = (list: MatchEvent[], prefix: string) =>
    list.map((event, i) => (
      <EventRow
        key={event.id ?? `${prefix}${i}`}
        event={event}
        competitionId={competitionId}
        homeIsMoslavac={homeIsMoslavac}
        team={event.side === "home" ? homeTeam : awayTeam}
        score={event.id != null ? (scoreMap.get(event.id) ?? null) : null}
        index={step++}
        reduced={!!reduced}
      />
    ));

  return (
    <ol className="relative">
      {/* Šina koja povezuje čvorove — ispod je, pa je markeri prekrivaju.
          `left` MORA biti sredina kolone s čvorom, izvedena iz mreže retka:
            mobitel: 2.75rem (minuta) + 0.75rem (gap-x-3) + 1.125rem (pola čvora) = 4.625rem
            sm:      3.5rem  (minuta) + 1rem    (gap-x-4) + 1.25rem  (pola čvora) = 5.75rem
          Promijeniš li mrežu u EventRow, promijeni i ovo — inače linija promaši ikone. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[4.625rem] -z-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent sm:left-[5.75rem]"
      />

      <Marker label="Početak" />
      {rows(firstHalf, "f")}

      {(secondHalf.length > 0 || hasResult) && (
        <Marker label="Poluvrijeme" score={halfScore} />
      )}
      {rows(secondHalf, "s")}

      {hasResult && <Marker label="Kraj" score={finalScore} emphatic />}
    </ol>
  );
}

/**
 * Phase bands. Full-time is the only one that shouts — it carries the result, so
 * it gets the club plate; the others are quiet rules that section the play.
 */
function Marker({
  label,
  score,
  emphatic = false,
}: {
  label: string;
  score?: string | null;
  emphatic?: boolean;
}) {
  // Full time is the one row that breaks the grid: it spans the whole width,
  // rail column included, so the timeline visibly ends rather than carrying on.
  if (emphatic) {
    const [home, away] = score ? score.split(":") : [];

    return (
      <li className="dark mt-3 flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-sm bg-navy-deep px-5 py-5 text-foreground shadow-[0_22px_48px_-26px] shadow-navy-deep sm:px-7 sm:py-6">
        <span className="text-[0.68rem] font-black uppercase tracking-[0.26em] text-foreground/70">
          {label}
        </span>
        {score && (
          <span className="text-4xl font-black tabular-nums leading-none tracking-tight sm:text-5xl">
            {home}
            <span className="mx-1 text-primary">:</span>
            {away}
          </span>
        )}
      </li>
    );
  }

  return (
    <li className="flex items-center gap-4 py-6 first:pt-0">
      <span className="text-[0.62rem] font-black uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
      {score && (
        <span className="text-sm font-black tabular-nums leading-none text-foreground/70">
          {score}
        </span>
      )}
    </li>
  );
}

/** Jedan oblik čvora za sve — ispunjen je samo gol, jer njega oko traži. */
function EventNode({ event, goal }: { event: MatchEvent; goal: boolean }) {
  const card = isYellowCardEvent(event) || isRedCardEvent(event);

  return (
    <span
      className={cn(
        "flex size-9 items-center justify-center rounded-full sm:size-10",
        goal
          // Prsten u boji podloge "izrezuje" čvor iz šine koja prolazi ispod.
          ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-8px] shadow-primary/80 ring-4 ring-background"
          : card
            ? "bg-background ring-1 ring-border"
            : "bg-muted text-muted-foreground ring-1 ring-border/60",
      )}
    >
      <EventIcon
        kind={event.kind}
        className={goal ? "size-[1.15rem]" : undefined}
      />
    </span>
  );
}

function EventRow({
  event,
  competitionId,
  homeIsMoslavac,
  team,
  score,
  index,
  reduced,
}: {
  event: MatchEvent;
  competitionId: number | null;
  homeIsMoslavac: boolean;
  team: { picture: string | null; name: string };
  score: ScoreSnapshot | null;
  index: number;
  reduced: boolean;
}) {
  const minute = event.minute ?? 0;
  const stoppage = event.stoppageTime ?? 0;
  const minuteLabel = stoppage > 0 ? `${minute}+${stoppage}` : `${minute}`;

  const playerName = event.player?.name?.trim() ?? "";
  const secondaryPlayerName = event.secondaryPlayer?.name?.trim() ?? "";
  const personId = event.player?.personId ?? null;
  const goal = isGoalEvent(event);
  const sub = isSubstitutionEvent(event);

  const eventIsMoslavac =
    (event.side === "home" && homeIsMoslavac) ||
    (event.side === "away" && !homeIsMoslavac);
  const isLinkable =
    eventIsMoslavac &&
    personId != null &&
    competitionId != null &&
    event.player?.hideProfile !== true;

  // With no player (a team-level card, say) the event type is the only headline
  // there is — so it is not repeated in the meta line underneath.
  const title = playerName || event.type.name;
  const typeInMeta = playerName !== "";

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.04, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "grid grid-cols-[2.75rem_2.25rem_minmax(0,1fr)] items-center gap-x-3 py-2.5 sm:grid-cols-[3.5rem_2.5rem_minmax(0,1fr)] sm:gap-x-4",
      )}
    >
      <span
        className={cn(
          "text-right text-sm font-black tabular-nums leading-none sm:text-base",
          goal ? "text-primary" : "text-foreground/40",
        )}
      >
        {minuteLabel}
        <span className="opacity-50">&apos;</span>
      </span>

      <span className="flex justify-center">
        <EventNode event={event} goal={goal} />
      </span>

      {/* Gol je tamna ploča, ostalo tiho na kredi. Rezultat živi UNUTAR ove
          kolone i smije se prelomiti — zato ne može izgurati redak iz ekrana. */}
      <div
        className={cn(
          "flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 rounded-sm px-4 py-3.5 sm:px-5",
          goal
            ? "dark bg-navy-deep text-foreground shadow-[0_18px_40px_-24px] shadow-navy-deep/80"
            : "bg-muted/40",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="min-w-0 wrap-break-word text-base font-black uppercase leading-tight tracking-tight sm:text-lg">
            {isLinkable && playerName ? (
              <Link
                href={`/statistika/${buildPlayerSlug({ personId, name: playerName })}/${competitionId}`}
                className="transition-colors hover:text-primary"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>

          <div className="flex min-w-0 items-center gap-2">
            <HnsCrest
              picture={team.picture}
              name={team.name}
              size={22}
              className="size-[1.05rem] shrink-0"
            />
            <span
              className={cn(
                "min-w-0 truncate text-[0.6rem] font-bold uppercase tracking-[0.16em]",
                goal ? "text-foreground/60" : "text-muted-foreground",
              )}
            >
              {team.name}
              {typeInMeta && (
                <>
                  <span
                    aria-hidden
                    className="mx-1.5 inline-block h-3 w-px translate-y-[0.15em] bg-current/20"
                  />
                  <span className="opacity-60">{event.type.name}</span>
                </>
              )}
            </span>
          </div>

          {sub && secondaryPlayerName && (
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
              Izlazi {secondaryPlayerName}
            </span>
          )}
        </div>

        {goal && score && (
          <span className="shrink-0 text-2xl font-black tabular-nums leading-none tracking-tight sm:text-3xl">
            {score.home}
            <span className="mx-0.5 text-primary">:</span>
            {score.away}
          </span>
        )}
      </div>
    </motion.li>
  );
}
