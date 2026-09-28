import { isFinished } from "@/lib/hns/matchStatus";
import type {
  Match,
  MatchEvent,
  MatchEventKind,
  MatchSide,
  Team,
} from "@/types/hns";

/** Događaji koje tijek prikazuje. Ostalo (statistika, komentari) se izostavlja. */
const SHOWN: MatchEventKind[] = ["goal", "own-goal", "yellow", "red", "sub"];

/** Događaji koji stoje na lenti — izmjene samo u popisu, inače lenta postane šum. */
const ON_RIBBON: MatchEventKind[] = ["goal", "own-goal", "yellow", "red"];

export interface EventRow {
  kind: "event";
  key: string;
  /** DOM id retka, da klik na lenti može skrolati do njega. */
  anchor: string;
  minute: string;
  /** Minuta za lentu: nadoknada stoji na crti poluvremena/kraja, ne iza nje. */
  at: number;
  eventKind: MatchEventKind;
  player: string;
  /** Igrač koji izlazi — samo kod izmjene. */
  subOut: string | null;
  team: Team | null;
  side: MatchSide | null;
  /** Događaj naše momčadi. */
  ours: boolean;
  /** Rezultat nakon gola; null za sve što nije gol. */
  score: { home: number; away: number } | null;
}

export interface MarkerRow {
  kind: "marker";
  key: string;
  label: string;
  score: string | null;
}

export type Row = EventRow | MarkerRow;

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

interface Sortable {
  row: Row;
  phase: number;
  /** 0 = phase start marker, 1 = play, 2 = phase end marker. */
  tier: number;
  minute: number;
  stoppage: number;
  order: number;
}

function scoreLine(
  home: number | null | undefined,
  away: number | null | undefined,
): string | null {
  return home != null && away != null ? `${home}:${away}` : null;
}

/**
 * Naša strana po HNS id-u momčadi. `match.teamSide` nije pouzdan: dohvat
 * pojedine utakmice ga vraća prazan.
 */
export function sideOf(match: Match, ourTeamId: number | null): MatchSide | null {
  if (ourTeamId == null) return null;

  if (match.homeTeam?.id === ourTeamId) return "home";

  if (match.awayTeam?.id === ourTeamId) return "away";

  return null;
}

/**
 * Ordered run of play: events plus phase markers (Početak / Poluvrijeme / Kraj).
 * When HNS sends no phase boundaries at all — lower leagues often don't — the
 * half-time and full-time markers are derived from the minutes and the result,
 * so the list never runs from 31' to 86' with nothing to break it up.
 */
export function buildRows(
  match: Match,
  events: MatchEvent[],
  ourTeamId: number | null,
): Row[] {
  const roles = boundaryRoles(events);
  const ourSide = sideOf(match, ourTeamId);

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

    const kind = event.kind;

    if (!SHOWN.includes(kind)) continue;

    const team = event.side === "home" ? match.homeTeam : match.awayTeam;
    const key = `event-${event.id ?? order}`;
    const minute = event.minute ?? 0;

    items.push({
      row: {
        kind: "event",
        key,
        anchor: `dogadaj-${event.id ?? order}`,
        minute:
          event.displayMinute?.trim() ||
          (event.stoppageTime
            ? `${minute}+${event.stoppageTime}'`
            : `${minute}'`),
        // Nadoknada se ne zbraja: 45+3' i dalje pripada prvom poluvremenu.
        at: minute,
        eventKind: kind,
        player:
          event.player?.name?.trim() || event.teamOfficial?.name?.trim() || "-",
        subOut:
          kind === "sub" ? event.secondaryPlayer?.name?.trim() || null : null,
        team: team ?? event.club ?? null,
        side: event.side,
        ours: ourSide != null && event.side === ourSide,
        score: null,
      },
      phase,
      tier: 1,
      // `orderNumber` alone is NOT chronological — HNS has been seen numbering a
      // 45' goal after a 45+1' one. Minute plus stoppage time is, so it leads.
      minute,
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

  const rows = items.map((item) => item.row);

  // Running score, counted in display order. `side` is the team credited with
  // the goal — own goals included — the same convention `buildScoreProgression`
  // in @/lib/helpers/events uses.
  let home = 0;
  let away = 0;

  for (const row of rows) {
    if (row.kind !== "event") continue;

    if (row.eventKind !== "goal" && row.eventKind !== "own-goal") continue;

    if (row.side === "home") home += 1;
    else if (row.side === "away") away += 1;
    row.score = { home, away };
  }

  if (rows.some((row) => row.kind === "marker")) return rows;

  return withDerivedMarkers(match, rows);
}

function withDerivedMarkers(match: Match, rows: Row[]): Row[] {
  const out: Row[] = [];
  let halfPlaced = false;

  for (const row of rows) {
    if (!halfPlaced && row.kind === "event" && row.at > 45) {
      out.push({
        kind: "marker",
        key: "marker-half",
        label: "Poluvrijeme",
        score: scoreLine(match.score.home?.half, match.score.away?.half),
      });
      halfPlaced = true;
    }

    out.push(row);
  }

  if (isFinished(match)) {
    // Sve se dogodilo u prvom poluvremenu — poluvrijeme je ipak bilo.
    if (!halfPlaced) {
      out.push({
        kind: "marker",
        key: "marker-half",
        label: "Poluvrijeme",
        score: scoreLine(match.score.home?.half, match.score.away?.half),
      });
    }

    out.push({
      kind: "marker",
      key: "marker-end",
      label: "Kraj",
      score: scoreLine(match.score.home?.current, match.score.away?.current),
    });
  }

  return out;
}

const KIND_LABEL: Record<MatchEventKind, string> = {
  goal: "Gol",
  "own-goal": "Autogol",
  yellow: "Žuti karton",
  red: "Crveni karton",
  sub: "Izmjena",
  other: "Događaj",
};

export interface RibbonItem {
  key: string;
  anchor: string;
  /** 0–100, udaljenost od početnog zvižduka. */
  position: number;
  side: MatchSide | null;
  eventKind: MatchEventKind;
  label: string;
}

/**
 * Golovi i kartoni za lentu. Os je 90 minuta, ili dulja kad ima produžetaka;
 * nadoknada stoji na crti na kojoj je poluvrijeme ili kraj, kao na semaforu.
 */
export function ribbonItems(rows: Row[]): {
  /** Duljina osi u minutama — 90, ili više kad ima produžetaka. */
  length: number;
  items: RibbonItem[];
} {
  // Bez strane znak nema red na lenti; u popisu ostaje.
  const events = rows.filter(
    (row): row is EventRow =>
      row.kind === "event" &&
      row.side != null &&
      ON_RIBBON.includes(row.eventKind),
  );

  const length = Math.max(90, ...events.map((row) => row.at));

  const items = events.map((row) => ({
    key: row.key,
    anchor: row.anchor,
    position: (row.at / length) * 100,
    side: row.side,
    eventKind: row.eventKind,
    label: `${row.minute} ${KIND_LABEL[row.eventKind]}: ${row.player}`,
  }));

  return { length, items };
}
