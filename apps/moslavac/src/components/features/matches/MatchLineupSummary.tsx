"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HnsCrest } from "@/components/HnsCrest";
import { useOurTeamId } from "@/components/providers/TenantProvider";
import {
  isGoalEvent,
  isRedCardEvent,
  isSubstitutionEvent,
  isYellowCardEvent,
} from "@/lib/helpers/events";
import { buildPlayerSlug } from "@/lib/helpers/slug";
import { cn } from "@/lib/utils";
import type {
  Match,
  MatchEvent,
  TeamLineup,
  LineupPlayer,
} from "@/types/hns";
import { EventIcon } from "./shared/EventIcon";

interface MatchLineupSummaryProps {
  match: Match;
  home: TeamLineup | null;
  away: TeamLineup | null;
}

/**
 * Lineups board — a dark navy panel where the shirt number is the hero element
 * (no photos: the HNS feed has none for opponents, so a number-forward layout
 * stays symmetric and premium for both teams). Switchable per team, club-blue
 * accents. Desktop-only Match Room companion; full bench lives in "Postave".
 */
export default function MatchLineupSummary({
  match,
  home,
  away,
}: MatchLineupSummaryProps) {
  const moslavacTeamId = useOurTeamId();
  const competitionId = match.competition?.id ?? null;

  const homeName = match.homeTeam?.name ?? "Domaći";
  const awayName = match.awayTeam?.name ?? "Gosti";
  const awayIsMoslavac =
    moslavacTeamId != null && match.awayTeam?.id === moslavacTeamId;

  const [side, setSide] = useState<"home" | "away">(
    awayIsMoslavac ? "away" : "home",
  );

  const active = side === "home" ? home : away;
  const activeName = side === "home" ? homeName : awayName;
  const activePicture =
    side === "home"
      ? match.homeTeam?.picture ?? null
      : match.awayTeam?.picture ?? null;
  const activeTeamId = side === "home" ? match.homeTeam?.id : match.awayTeam?.id;
  const isMoslavac = moslavacTeamId != null && activeTeamId === moslavacTeamId;

  const players = active?.players ?? [];
  const starters = players.filter((p) => p.starting === true);
  const subs = players.filter((p) => p.starting !== true);

  return (
    <div className="dark overflow-hidden bg-navy-deep text-foreground">
      <div className="px-6 pt-6">
        <h2 className="font-display text-2xl font-black uppercase leading-none tracking-tighter">
          Postave
        </h2>
      </div>

      {/* Team toggle */}
      <div className="mt-5 grid grid-cols-2">
        <TeamTab
          label={homeName}
          active={side === "home"}
          onClick={() => setSide("home")}
        />
        <TeamTab
          label={awayName}
          active={side === "away"}
          onClick={() => setSide("away")}
        />
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center gap-3 border-b border-foreground/15 py-5">
          <HnsCrest
            picture={activePicture}
            name={activeName}
            size={36}
            className="size-9 shrink-0"
          />
          <h3 className="line-clamp-1 font-display text-sm font-black uppercase tracking-tight">
            {activeName}
          </h3>
        </div>

        {starters.length > 0 ? (
          <ul>
            {starters.map((player, i) => (
              <PlayerRow
                key={`s-${player.personId ?? player.shirtNumber ?? "x"}-${player.name ?? i}`}
                player={player}
                competitionId={competitionId}
                isMoslavac={isMoslavac}
              />
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-xs text-foreground/50">
            Postava nije objavljena.
          </p>
        )}

        {subs.length > 0 && (
          <>
            <p className="mt-7 mb-1 flex items-center gap-2.5 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-foreground/45">
              <span aria-hidden className="h-px w-5 bg-foreground/25" />
              Zamjene
            </p>
            <ul>
              {subs.map((player, i) => (
                <PlayerRow
                  key={`b-${player.personId ?? player.shirtNumber ?? "x"}-${player.name ?? i}`}
                  player={player}
                  competitionId={competitionId}
                  isMoslavac={isMoslavac}
                  compact
                />
              ))}
            </ul>
          </>
        )}

        <Link
          href="?tab=postave"
          scroll={false}
          className="group mt-6 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-foreground transition-colors hover:text-primary"
        >
          Cijele postave
          <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

function TeamTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative truncate px-3 py-3 font-display text-xs font-black uppercase tracking-tight transition-colors",
        active
          ? "text-foreground"
          : "text-foreground/45 hover:text-foreground/80",
      )}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-0.5 transition-colors",
          active ? "bg-primary" : "bg-foreground/10",
        )}
      />
    </button>
  );
}

function PlayerRow({
  player,
  competitionId,
  isMoslavac,
  compact = false,
}: {
  player: LineupPlayer;
  competitionId: number | null;
  isMoslavac: boolean;
  compact?: boolean;
}) {
  const playerName = player.name ?? "";
  const isLinkable =
    isMoslavac &&
    player.personId != null &&
    competitionId != null &&
    player.hideProfile !== true;

  const inner = (
    <div className="group/row flex items-center gap-4 border-b border-foreground/10 py-3">
      <span
        className={cn(
          "shrink-0 text-center font-display font-black tabular-nums leading-none text-foreground/90",
          compact ? "w-8 text-2xl" : "w-9 text-3xl",
        )}
      >
        {player.shirtNumber ?? "-"}
      </span>
      <span
        aria-hidden
        className={cn("w-px shrink-0 bg-foreground/15", compact ? "h-7" : "h-9")}
      />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className={cn(
            "line-clamp-1 font-display font-black uppercase leading-none tracking-tight transition-colors",
            isLinkable && "group-hover/row:text-primary",
            compact ? "text-xs text-foreground/80" : "text-base",
          )}
        >
          {playerName}
        </span>
        {player.position && (
          <span className="shrink-0 rounded-sm border border-foreground/20 px-1 text-[0.5rem] font-bold uppercase leading-tight tracking-[0.1em] text-foreground/50">
            {player.position}
          </span>
        )}
        {player.captain && (
          <span className="shrink-0 rounded-sm border border-primary/60 px-1 text-[0.5rem] font-bold uppercase leading-tight tracking-[0.15em] text-primary">
            K
          </span>
        )}
      </div>
      <PlayerEvents events={player.events} isStarter={player.starting === true} />
    </div>
  );

  return (
    <li>
      {isLinkable ? (
        <Link
          href={`/statistika/${buildPlayerSlug({ personId: player.personId, name: playerName })}/${competitionId}`}
          className="block"
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </li>
  );
}

function PlayerEvents({
  events,
  isStarter,
}: {
  events: MatchEvent[] | null | undefined;
  isStarter: boolean;
}) {
  const items = (events ?? []).filter(
    (e) =>
      isGoalEvent(e) ||
      isYellowCardEvent(e) ||
      isRedCardEvent(e) ||
      isSubstitutionEvent(e),
  );
  if (items.length === 0) return null;

  return (
    <div className="flex shrink-0 flex-col items-end gap-1.5">
      {items.slice(0, 3).map((e, i) => {
        const minute = e.minute ?? 0;
        const sub = isSubstitutionEvent(e);
        return (
          <span
            key={`${e.id ?? i}`}
            className="flex items-center gap-1.5 text-[0.6rem] font-bold tabular-nums text-foreground/55"
          >
            {minute}&apos;
            <EventIcon
              kind={e.kind}
              subDirection={sub ? (isStarter ? "out" : "in") : undefined}
            />
          </span>
        );
      })}
    </div>
  );
}
