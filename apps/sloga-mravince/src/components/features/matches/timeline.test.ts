import { describe, expect, it } from "vitest";
import type { Match, MatchEvent, MatchEventKind, Team } from "@/types/hns";
import { buildRows, floors, ribbonItems, type EventRow } from "./timeline";

const HOME_ID = 10;
const AWAY_ID = 20;

function team(id: number, name: string): Team {
  return { id, name, picture: null } as Team;
}

function match(overrides: Partial<Match> = {}): Match {
  return {
    homeTeam: team(HOME_ID, "NK Vodice"),
    awayTeam: team(AWAY_ID, "HNK Sloga Mravince"),
    liveStatus: "PLAYED",
    score: {
      home: { current: 3, half: 1 },
      away: { current: 1, half: 0 },
    },
    ...overrides,
  } as Match;
}

let nextId = 1;

function event(
  kind: MatchEventKind,
  minute: number,
  side: "home" | "away",
  extra: Partial<MatchEvent> = {},
): MatchEvent {
  const id = nextId++;

  return {
    id,
    kind,
    type: { code: null, name: kind },
    phase: { code: minute > 45 ? "2" : "1", name: "" },
    minute,
    stoppageTime: null,
    displayMinute: null,
    player: { name: `Igrač ${id}` },
    secondaryPlayer: null,
    side,
    orderNumber: id,
    ...extra,
  } as MatchEvent;
}

function boundary(phase: string, order: number): MatchEvent {
  return {
    id: 1000 + order,
    kind: "other",
    type: { code: null, name: "" },
    phase: { code: phase, name: "" },
    minute: null,
    stoppageTime: null,
    side: null,
    orderNumber: order,
  } as unknown as MatchEvent;
}

const eventRows = (rows: ReturnType<typeof buildRows>) =>
  rows.filter((row): row is EventRow => row.kind === "event");

describe("buildRows", () => {
  it("gives every goal the running score after it", () => {
    const rows = buildRows(
      match(),
      [
        event("goal", 31, "home"),
        event("yellow", 36, "home"),
        event("goal", 49, "away"),
        event("own-goal", 64, "home"),
      ],
      AWAY_ID,
    );

    expect(eventRows(rows).map((row) => row.score)).toEqual([
      { home: 1, away: 0 },
      null,
      { home: 1, away: 1 },
      { home: 2, away: 1 },
    ]);
  });

  it("marks the club's own events", () => {
    const rows = buildRows(
      match(),
      [event("goal", 31, "home"), event("goal", 49, "away")],
      AWAY_ID,
    );

    expect(eventRows(rows).map((row) => row.ours)).toEqual([false, true]);
  });

  it("puts both players of a substitution on the row", () => {
    const rows = buildRows(
      match(),
      [
        event("sub", 77, "away", {
          player: { name: "Marko Papić" },
          secondaryPlayer: { name: "Josip Tarabarić" },
        } as Partial<MatchEvent>),
      ],
      AWAY_ID,
    );

    expect(eventRows(rows)[0]).toMatchObject({
      player: "Marko Papić",
      subOut: "Josip Tarabarić",
    });
  });

  it("synthesises half-time and full-time when HNS sends no boundaries", () => {
    const rows = buildRows(
      match(),
      [event("goal", 31, "home"), event("goal", 49, "away")],
      AWAY_ID,
    );

    expect(rows.map((row) => (row.kind === "marker" ? row.label : row.minute)))
      .toEqual(["31'", "Poluvrijeme", "49'", "Kraj"]);
    expect(rows[1]).toMatchObject({ score: "1:0" });
    expect(rows[3]).toMatchObject({ score: "3:1" });
  });

  it("still marks half-time when every event fell in the first half", () => {
    const rows = buildRows(match(), [event("goal", 31, "home")], AWAY_ID);

    expect(
      rows.filter((row) => row.kind === "marker").map((row) => row.label),
    ).toEqual(["Poluvrijeme", "Kraj"]);
  });

  it("does not announce full time for a match still running", () => {
    const rows = buildRows(
      match({ liveStatus: "RUNNING" }),
      [event("goal", 31, "home")],
      AWAY_ID,
    );

    expect(rows.some((row) => row.kind === "marker" && row.label === "Kraj"))
      .toBe(false);
  });

  it("keeps HNS boundaries when they exist", () => {
    const rows = buildRows(
      match(),
      [
        boundary("1", 0),
        event("goal", 31, "home", { orderNumber: 1 }),
        boundary("1", 2),
        boundary("2", 3),
        event("goal", 49, "away", { orderNumber: 4 }),
        boundary("2", 5),
      ],
      AWAY_ID,
    );

    expect(
      rows.filter((row) => row.kind === "marker").map((row) => row.label),
    ).toEqual(["Početak", "Poluvrijeme", "Kraj"]);
  });
});

describe("ribbonItems", () => {
  it("leaves out events with no side", () => {
    const rows = buildRows(match(), [
      event("goal", 31, "home"),
      event("yellow", 40, "home", { side: null }),
    ], AWAY_ID);

    expect(ribbonItems(rows).items).toHaveLength(1);
  });


  it("keeps only goals and cards", () => {
    const rows = buildRows(
      match(),
      [
        event("goal", 31, "home"),
        event("sub", 35, "home"),
        event("yellow", 36, "home"),
        event("red", 80, "away"),
      ],
      AWAY_ID,
    );

    expect(ribbonItems(rows).items.map((item) => item.eventKind)).toEqual([
      "goal",
      "yellow",
      "red",
    ]);
  });

  it("places first-half stoppage time on the half-time line, not past it", () => {
    const rows = buildRows(
      match(),
      [
        event("goal", 45, "home", { stoppageTime: 3 }),
        event("goal", 90, "away", { stoppageTime: 4 }),
      ],
      AWAY_ID,
    );

    const [first, last] = ribbonItems(rows).items;

    expect(first?.position).toBe(50);
    expect(last?.position).toBe(100);
  });
});

describe("floors", () => {
  const at = (key: string, position: number) => ({
    key,
    anchor: key,
    position,
    side: "home" as const,
    eventKind: "yellow" as const,
    label: key,
  });

  it("drops a marker back to the rail once there is room", () => {
    const level = floors(
      [at("31", 34), at("36", 40), at("45", 50), at("48", 53), at("64", 71)],
      12,
    );

    expect([...level.values()]).toEqual([0, 1, 0, 1, 0]);
  });
});
