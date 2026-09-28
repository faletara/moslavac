"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { HnsCrest } from "@/components/HnsCrest";
import { useOurTeamId } from "@/components/providers/TenantProvider";
import { cn } from "@/lib/utils";
import type { Match, MatchEvent } from "@/types/hns";
import { EventIcon } from "./EventIcon";
import MatchRibbon from "./MatchRibbon";
import {
  buildRows,
  ribbonItems,
  sideOf,
  type EventRow,
  type MarkerRow,
  type Row,
} from "./timeline";

/** Granica faze — ink traka koja presijeca tijek. */
function Marker({ row }: { row: MarkerRow }) {
  return (
    <li className="flex items-center gap-3 py-5 sm:gap-4">
      <span className="h-px flex-1 bg-foreground/15" />
      <span className="flex items-center gap-2.5 bg-ink-deep px-3 py-2 text-[0.58rem] font-black uppercase tracking-[0.2em] text-chalk sm:px-4 sm:text-[0.62rem] sm:tracking-[0.24em]">
        {row.label}
        {row.score && (
          <span className="font-display text-sm leading-none tabular-nums text-club-red sm:text-base">
            {row.score}
          </span>
        )}
      </span>
      <span className="h-px flex-1 bg-foreground/15" />
    </li>
  );
}

/**
 * Zajednički okvir retka: id za skok s lente, bljesak kad se na njega skoči i
 * crveni rub za događaje naše momčadi. Rub je uvijek tu (proziran kod gostiju),
 * pa se minute svih redaka poravnavaju u isti stupac.
 */
function rowFrame(row: EventRow, className?: string) {
  return {
    id: row.anchor,
    className: cn(
      "scroll-mt-28 border-l-[3px] outline-offset-2 transition-[outline-color] duration-500 data-flash:outline-2 data-flash:outline-club-red",
      row.ours ? "border-club-red" : "border-transparent",
      className,
    ),
  };
}

function Minute({ row, className }: { row: EventRow; className?: string }) {
  return (
    <span
      className={cn(
        "min-w-11 font-display leading-none tabular-nums sm:min-w-13",
        className,
      )}
    >
      {row.minute}
    </span>
  );
}

/** Gol je ink ploča s novim rezultatom — oko ga nađe bez čitanja. */
function GoalEvent({ row }: { row: EventRow }) {
  return (
    <li
      {...rowFrame(
        row,
        "my-2 flex items-center gap-2.5 bg-ink-deep py-4 pl-3 pr-4 text-chalk shadow-[0_18px_36px_-24px] shadow-ink-deep sm:gap-4 sm:py-5 sm:pl-4 sm:pr-6",
      )}
    >
      <Minute row={row} className="text-xl text-club-red sm:text-3xl" />

      <span className="flex w-4 shrink-0 justify-center sm:w-5">
        <EventIcon
          kind={row.eventKind}
          className={cn(row.eventKind === "goal" && "text-chalk")}
        />
      </span>

      <HnsCrest
        picture={row.team?.picture}
        name={row.team?.name}
        size={36}
        className="size-7 shrink-0 rounded-full bg-white p-0.5 sm:size-9"
      />

      <div className="min-w-0 flex-1">
        <p className="font-display text-lg uppercase leading-tight tracking-wide sm:text-2xl">
          {row.player}
        </p>
        <p className="mt-1 truncate text-[0.58rem] font-bold uppercase tracking-[0.12em] text-chalk/55 sm:text-[0.62rem] sm:tracking-[0.14em]">
          {row.eventKind === "own-goal" ? "Autogol" : row.team?.name}
        </p>
      </div>

      {row.score && (
        <span className="shrink-0 font-display text-3xl leading-none tabular-nums sm:text-5xl">
          {row.score.home}
          <span className="mx-0.5 text-club-red">:</span>
          {row.score.away}
        </span>
      )}
    </li>
  );
}

/** Karton — standardni redak, glas ispod gola. */
function CardEvent({ row, divider }: { row: EventRow; divider: boolean }) {
  return (
    <li
      {...rowFrame(
        row,
        cn(
          "flex items-center gap-2.5 py-4 pl-3 sm:gap-4 sm:py-5 sm:pl-4",
          divider && "border-b border-b-foreground/10",
        ),
      )}
    >
      <Minute row={row} className="text-lg text-foreground/45 sm:text-2xl" />

      <span className="flex w-4 shrink-0 justify-center sm:w-5">
        <EventIcon kind={row.eventKind} />
      </span>

      <HnsCrest
        picture={row.team?.picture}
        name={row.team?.name}
        size={36}
        className="size-7 shrink-0 rounded-full bg-white p-0.5 ring-1 ring-black/5 sm:size-9"
      />

      <div className="min-w-0 flex-1">
        <p className="font-display text-base uppercase leading-tight tracking-wide sm:text-xl">
          {row.player}
        </p>
        <p className="mt-1 truncate text-[0.58rem] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:text-[0.62rem] sm:tracking-[0.14em]">
          {row.team?.name}
        </p>
      </div>
    </li>
  );
}

/**
 * Izmjena — sažet redak: tko ulazi pa ispod tko izlazi. Uvijek dva retka, da
 * sve izmjene budu iste visine bez obzira na duljinu imena.
 * Ostaje na svom mjestu u tijeku, ali ne vuče pogled s golova.
 */
function SubEvent({ row, divider }: { row: EventRow; divider: boolean }) {
  return (
    <li
      {...rowFrame(
        row,
        cn(
          "flex items-center gap-2.5 py-2.5 pl-3 sm:gap-4 sm:pl-4",
          divider && "border-b border-b-foreground/10",
        ),
      )}
    >
      <Minute
        row={row}
        className="text-sm text-foreground/35 sm:text-base"
      />

      <span className="flex w-4 shrink-0 justify-center sm:w-5">
        <EventIcon kind="sub" className="size-3.5" />
      </span>

      <HnsCrest
        picture={row.team?.picture}
        name={row.team?.name}
        size={24}
        className="size-5 shrink-0 rounded-full bg-white p-px ring-1 ring-black/5"
      />

      <p className="flex min-w-0 flex-1 flex-col gap-0.5 text-[0.7rem] font-bold uppercase tracking-[0.08em] sm:text-xs">
        <span className="flex min-w-0 items-center gap-1">
          <ArrowUp
            aria-label="Ulazi"
            strokeWidth={3}
            className="size-3 shrink-0 text-emerald-700 dark:text-emerald-400"
          />
          <span className="truncate" title={row.player}>{row.player}</span>
        </span>
        {row.subOut && (
          <span className="flex min-w-0 items-center gap-1 text-muted-foreground">
            <ArrowDown
              aria-label="Izlazi"
              strokeWidth={3}
              className="size-3 shrink-0 text-club-red"
            />
            <span className="truncate" title={row.subOut}>{row.subOut}</span>
          </span>
        )}
      </p>
    </li>
  );
}

function isGoal(row: Row | undefined): boolean {
  return (
    row?.kind === "event" &&
    (row.eventKind === "goal" || row.eventKind === "own-goal")
  );
}

/**
 * Tijek utakmice — lenta golova i kartona na vrhu, pa popis po minutama.
 * Tri težine retka: gol je ink ploča s rezultatom, karton standardni redak,
 * izmjena sažet redak. Granice faza (Početak / Poluvrijeme / Kraj) presijecaju
 * popis kao ink trake, uz rezultat na poluvremenu i kraju.
 *
 * Namjerno jedan stupac, ne dvostrana os: na mobitelu bi svaka strana dobila
 * ~40% širine i hrvatska imena bi se lomila u tri retka. Stranu nosi grb, a
 * naše događaje crveni rub.
 */
export default function EventsTimeline({
  match,
  events,
}: {
  match: Match;
  events: MatchEvent[];
}) {
  const ourTeamId = useOurTeamId();
  const rows = buildRows(match, events, ourTeamId);
  const hasEvents = rows.some((row) => row.kind === "event");

  if (!hasEvents) {
    return (
      <p className="border border-foreground/10 px-6 py-10 text-center text-xs font-bold uppercase text-muted-foreground clip-corner">
        Tijek utakmice nije dostupan.
      </p>
    );
  }

  const ribbon = ribbonItems(rows);

  return (
    <div className="space-y-8">
      <MatchRibbon
        match={match}
        items={ribbon.items}
        length={ribbon.length}
        ourSide={sideOf(match, ourTeamId)}
      />

      <ol>
        {rows.map((row, index) => {
          if (row.kind === "marker") return <Marker key={row.key} row={row} />;

          if (isGoal(row)) return <GoalEvent key={row.key} row={row} />;

          // Hairline only BETWEEN two plain rows. A phase marker brings its own
          // rules and a goal plate its own edge, so neither gets a third line.
          const next = rows[index + 1];
          const divider = next?.kind === "event" && !isGoal(next);

          return row.eventKind === "sub" ? (
            <SubEvent key={row.key} row={row} divider={divider} />
          ) : (
            <CardEvent key={row.key} row={row} divider={divider} />
          );
        })}
      </ol>
    </div>
  );
}
