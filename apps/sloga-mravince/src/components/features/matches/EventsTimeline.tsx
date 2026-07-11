import { HnsCrest } from "@/components/HnsCrest";
import { cn } from "@/lib/utils";
import type { Match, MatchEvent, Team } from "@/types/hns";
import { EventIcon, type EventKind, eventKind } from "./EventIcon";

/** Događaji koje tijek prikazuje. Ostalo (statistika, komentari) se izostavlja. */
const SHOWN: EventKind[] = ["goal", "own-goal", "yellow", "red", "sub"];

/**
 * HNS ne šalje "početak" i "kraj" kao imenovane tipove — šalje ih kao događaje
 * s PRAZNIM imenom tipa. Bez njih tijek počinje usred igre i nikad ne završava.
 */
function isBoundary(event: MatchEvent): boolean {
  return !event.type?.name?.trim();
}

/**
 * Which boundary is a start and which is an end CANNOT be read off the minute:
 * HNS is inconsistent about it. One match reports the end of the first half with
 * `minute: null`, the next reports it as `minute: 45`. What does hold is the
 * order within a phase — a phase's first boundary opens it, its last closes it.
 */
function boundaryRoles(events: MatchEvent[]): Map<MatchEvent, "start" | "end"> {
  const byPhase = new Map<string, MatchEvent[]>();

  for (const event of events) {
    if (!isBoundary(event)) continue;
    const phase = event.phase?.code ?? event.phase?.name ?? "";
    const list = byPhase.get(phase) ?? [];
    list.push(event);
    byPhase.set(phase, list);
  }

  const roles = new Map<MatchEvent, "start" | "end">();
  for (const list of byPhase.values()) {
    const ordered = [...list].sort(
      (a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0),
    );
    const first = ordered[0];
    const last = ordered[ordered.length - 1];
    if (first) roles.set(first, "start");
    if (last && last !== first) roles.set(last, "end");
  }

  return roles;
}

interface EventRow {
  kind: "event";
  key: string;
  minute: string;
  eventKind: EventKind;
  player: string;
  detail: string | null;
  team: Team | null;
}

interface MarkerRow {
  kind: "marker";
  key: string;
  label: string;
  score: string | null;
}

type Row = EventRow | MarkerRow;

interface Sortable {
  row: Row;
  phase: number;
  /** 0 = phase start marker, 1 = play, 2 = phase end marker. */
  tier: number;
  minute: number;
  stoppage: number;
  order: number;
}

function scoreLine(home: number | null, away: number | null): string | null {
  return home != null && away != null ? `${home}:${away}` : null;
}

function buildRows(match: Match, events: MatchEvent[]): Row[] {
  const roles = boundaryRoles(events);

  // Phases ranked by first appearance — no hardcoded list, so extra time and
  // penalties fall into place behind the two halves without being named here.
  const phaseRank = new Map<string, number>();
  for (const event of events) {
    const phase = event.phase?.code ?? event.phase?.name ?? "";
    if (!phaseRank.has(phase)) phaseRank.set(phase, phaseRank.size);
  }

  const endBoundaries = events.filter((e) => roles.get(e) === "end");
  const lastEnd = endBoundaries.reduce<MatchEvent | null>(
    (latest, event) =>
      latest == null || (event.orderNumber ?? 0) > (latest.orderNumber ?? 0)
        ? event
        : latest,
    null,
  );

  const items: Sortable[] = [];

  for (const [index, event] of events.entries()) {
    const phaseKey = event.phase?.code ?? event.phase?.name ?? "";
    const phase = phaseRank.get(phaseKey) ?? 0;
    const order = event.orderNumber ?? index;

    if (isBoundary(event)) {
      const role = roles.get(event);
      if (!role) continue;

      // Only the very first whistle is announced. A "start of the second half"
      // marker sitting right under the half-time one says nothing new.
      if (role === "start" && phase !== 0) continue;

      const isFinal = role === "end" && event === lastEnd;
      const label =
        role === "start"
          ? "Početak"
          : isFinal
            ? "Kraj"
            : phase === 0
              ? "Poluvrijeme"
              : (event.phase?.name ?? "Kraj faze");

      const score = isFinal
        ? scoreLine(match.score.home?.current, match.score.away?.current)
        : role === "end" && phase === 0
          ? scoreLine(match.score.home?.half, match.score.away?.half)
          : null;

      items.push({
        row: { kind: "marker", key: `marker-${order}`, label, score },
        phase,
        tier: role === "start" ? 0 : 2,
        minute: 0,
        stoppage: 0,
        order,
      });
      continue;
    }

    const kind = eventKind(event.type?.name ?? "");
    if (!SHOWN.includes(kind)) continue;

    const team = event.side === "home" ? match.homeTeam : match.awayTeam;

    items.push({
      row: {
        kind: "event",
        key: `event-${event.id ?? order}`,
        minute: event.displayMinute?.trim() || `${event.minute ?? 0}'`,
        eventKind: kind,
        player:
          event.player?.name?.trim() || event.teamOfficial?.name?.trim() || "—",
        detail:
          kind === "sub" && event.secondaryPlayer?.name
            ? `Izlazi ${event.secondaryPlayer.name}`
            : null,
        team: team ?? event.club ?? null,
      },
      phase,
      tier: 1,
      // `orderNumber` alone is NOT chronological — HNS has been seen numbering a
      // 45' goal after a 45+1' one. Minute plus stoppage time is, so it leads.
      minute: event.minute ?? 0,
      stoppage: event.stoppageTime ?? 0,
      order,
    });
  }

  items.sort(
    (a, b) =>
      a.phase - b.phase ||
      a.tier - b.tier ||
      a.minute - b.minute ||
      a.stoppage - b.stoppage ||
      a.order - b.order,
  );

  return items.map((item) => item.row);
}

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

function Event({ row, divider }: { row: EventRow; divider: boolean }) {
  return (
    <li
      className={cn(
        "flex items-center gap-2.5 py-4 sm:gap-4 sm:py-5",
        // Hairline only BETWEEN events. A phase marker brings its own rules, so
        // the last event before one must not stack a third line under itself.
        divider && "border-b border-foreground/10",
      )}
    >
      <span className="min-w-11 font-display text-lg leading-none tabular-nums text-club-red sm:min-w-13 sm:text-2xl">
        {row.minute}
      </span>

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
        <p className="mt-1 text-[0.58rem] font-bold uppercase leading-snug tracking-[0.12em] text-muted-foreground sm:text-[0.62rem] sm:tracking-[0.14em]">
          {row.team?.name}
          {row.detail && (
            <>
              <span className="hidden sm:inline"> · </span>
              <span className="block sm:inline">{row.detail}</span>
            </>
          )}
        </p>
      </div>
    </li>
  );
}

/**
 * Tijek utakmice — jedan stupac editorial redaka: Anton minuta lijevo (isti
 * ritam kao dan na rasporedu), znak događaja, grb kluba tik uz ime igrača, pa
 * naziv kluba u podretku. Granice faza (Početak / Poluvrijeme / Kraj) presijecaju
 * listu kao ink trake, uz rezultat na poluvremenu i kraju.
 *
 * Namjerno jedan stupac, ne dvostrana os: na mobitelu bi svaka strana dobila
 * ~40% širine i hrvatska imena bi se lomila u tri retka.
 */
export default function EventsTimeline({
  match,
  events,
}: {
  match: Match;
  events: MatchEvent[];
}) {
  const rows = buildRows(match, events);
  const hasEvents = rows.some((row) => row.kind === "event");

  if (!hasEvents) {
    return (
      <p className="border border-foreground/10 px-6 py-10 text-center text-xs font-bold uppercase text-muted-foreground clip-corner">
        Tijek utakmice nije dostupan.
      </p>
    );
  }

  return (
    <ol>
      {rows.map((row, index) =>
        row.kind === "marker" ? (
          <Marker key={row.key} row={row} />
        ) : (
          <Event
            key={row.key}
            row={row}
            divider={rows[index + 1]?.kind === "event"}
          />
        ),
      )}
    </ol>
  );
}
