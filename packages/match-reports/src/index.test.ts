import { describe, expect, it } from "vitest";
import { runWithHnsContext, type HnsTransport } from "@/lib/hns/context";
import type { HnsMatch, HnsMatchEvent } from "@/types/hns";
import {
  publishMatchReports,
  templateWriter,
  type MatchReportDraft,
  type NewsStore,
} from "./index";

const NOW = new Date(Date.UTC(2026, 7, 31, 6, 0, 0));

const KICKOFF = Date.UTC(2026, 7, 29, 15, 0, 0);

const match = (over: Partial<HnsMatch> = {}): HnsMatch =>
  // SAFETY: fixture nosi samo polja koja izvještaj čita; ostatak HNS-ove
  // OpenAPI strukture ovaj test ne dira.
  ({
    id: 12345,
    dateTimeUTC: KICKOFF,
    homeTeam: { id: 1, name: "HNK Sloga Mravince" },
    awayTeam: { id: 2, name: "NK Gošk Kaštela" },
    homeTeamResult: { current: 0, half: 0 },
    awayTeamResult: { current: 0, half: 0 },
    liveStatus: "PLAYED",
    matchDayDesc: "1. kolo",
    competition: { id: 9, name: "Treća NL Jug 26/27" },
    facility: { id: 3, name: "Stadion Glavica" },
    attendance: 100,
    team: "H",
    ...over,
  }) as HnsMatch;

// SAFETY: fixture nosi samo polja koja izvještaj čita; ostatak HNS-ove
// OpenAPI strukture ovaj test ne dira.
const EVENTS: HnsMatchEvent[] = [
  {
    eventId: 1,
    eventType: { fcdName: "YELLOW", name: "Žuti karton" },
    minute: 16,
    homeTeam: false,
    player: { name: "Petar Sučić" },
  } as HnsMatchEvent,
];

/** Vraća stranične liste za `/matches/paginated/...` i detalj za `/match/:id`. */
const transport =
  (matches: HnsMatch[], events = EVENTS): HnsTransport =>
  async (endpoint) => {
    if (endpoint.includes("/matches/paginated/past"))
      return { result: matches };

    if (endpoint.includes("/matches/paginated/future"))
      return { result: [] };

    if (endpoint.includes("/events")) return events;

    if (/\/match\/\d+(\?|$)/.test(endpoint)) return matches[0];

    return null;
  };

const memoryStore = () => {
  const created: MatchReportDraft[] = [];
  const seen = new Set<number>();

  const store: NewsStore = {
    has: async (id) => seen.has(id),
    create: async (draft) => {
      seen.add(draft.sourceMatchId);
      created.push(draft);
    },
  };

  return { store, created, seen };
};

const run = (matches: HnsMatch[], store: NewsStore, events?: HnsMatchEvent[]) =>
  runWithHnsContext(
    { transport: transport(matches, events), teamId: "1", apiKey: "k" },
    () => publishMatchReports({ writer: templateWriter, store, now: NOW }),
  );

describe("publishMatchReports", () => {
  it("objavi izvještaj za odigranu seniorsku utakmicu iz prozora", async () => {
    const { store, created } = memoryStore();

    const summary = await run([match()], store);

    expect(summary.published).toEqual([12345]);
    expect(created).toHaveLength(1);
    expect(created[0].title).toBe("HNK Sloga Mravince – NK Gošk Kaštela 0:0");
    expect(created[0].sourceMatchId).toBe(12345);
    expect(created[0].paragraphs[0]).toContain("odigrali su 0:0");
  });

  it("datum objave je datum utakmice, ne datum obrade", async () => {
    const { store, created } = memoryStore();

    await run([match()], store);

    expect(created[0].publishedAt.toISOString()).toBe(
      new Date(KICKOFF).toISOString(),
    );
  });

  it("preskoči utakmicu koja već ima novost", async () => {
    const { store, created, seen } = memoryStore();
    seen.add(12345);

    const summary = await run([match()], store);

    expect(summary).toMatchObject({ published: [], skipped: [12345] });
    expect(created).toEqual([]);
  });

  it("preskoči utakmicu koja nije završena", async () => {
    const { store } = memoryStore();

    const summary = await run([match({ liveStatus: "RUNNING" })], store);

    expect(summary.published).toEqual([]);
  });

  it("preskoči mlađe kategorije", async () => {
    const { store } = memoryStore();

    // SAFETY: fixture nosi samo polja koja izvještaj čita; ostatak HNS-ove
    // OpenAPI strukture ovaj test ne dira.
    const summary = await run(
      [match({ competition: { id: 4, name: "Kadeti Jug 26/27" } as HnsMatch["competition"] })],
      store,
    );

    expect(summary.published).toEqual([]);
  });

  it("preskoči utakmicu stariju od prozora od 7 dana", async () => {
    const { store } = memoryStore();

    const summary = await run(
      [match({ dateTimeUTC: KICKOFF - 30 * 86_400_000 })],
      store,
    );

    expect(summary.published).toEqual([]);
  });

  it("objavi i kad HNS nema nijedan događaj", async () => {
    const { store, created } = memoryStore();

    const summary = await run([match()], store, []);

    expect(summary.published).toEqual([12345]);
    // Bez kartona nema trećeg odlomka, a fake HNS nema tablicu ni raspored.
    expect(created[0].paragraphs).toHaveLength(2);
  });

  it("ne objavi 2:1 bez ijednog gola u zapisniku — čeka HNS", async () => {
    const { store, created } = memoryStore();

    const summary = await run(
      [
        match({
          // SAFETY: fixture nosi samo polja koja izvještaj čita; ostatak HNS-ove
          // OpenAPI strukture ovaj test ne dira.
          homeTeamResult: { current: 2, half: 1 } as HnsMatch["homeTeamResult"],
          // SAFETY: fixture nosi samo polja koja izvještaj čita; ostatak HNS-ove
          // OpenAPI strukture ovaj test ne dira.
          awayTeamResult: { current: 1, half: 0 } as HnsMatch["awayTeamResult"],
        }),
      ],
      store,
      [],
    );

    expect(summary).toMatchObject({ published: [], skipped: [12345] });
    expect(created).toEqual([]);
  });

  it("seniorCompetitionFilter odlučuje što je seniorska utakmica", async () => {
    const { store } = memoryStore();
    // SAFETY: fixture nosi samo polja koja izvještaj čita; ostatak HNS-ove
    // OpenAPI strukture ovaj test ne dira.
    const kup = match({ competition: { id: 7, name: "Kup NS Split" } as HnsMatch["competition"] });

    const summary = await runWithHnsContext(
      {
        transport: transport([kup]),
        teamId: "1",
        apiKey: "k",
        seniorCompetitionFilter: "Treća NL",
      },
      () => publishMatchReports({ writer: templateWriter, store, now: NOW }),
    );

    expect(summary.published).toEqual([]);
  });

  it("greška na jednoj utakmici ne ruši obradu", async () => {
    const { store } = memoryStore();

    const failing: NewsStore = {
      has: store.has,
      create: async () => {
        throw new Error("baza pala");
      },
    };

    const summary = await run([match()], failing);

    expect(summary.failed).toEqual([{ matchId: 12345, error: "baza pala" }]);
    expect(summary.published).toEqual([]);
  });
});
