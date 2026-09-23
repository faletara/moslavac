import { describe, expect, it } from "vitest";
import type { HnsCompetition, HnsMatch } from "@/types/hns";
import { currentSeasonTag } from "./client";
import { fetchClubCompetition, fetchClubMatch } from "./clubScope";
import { runWithHnsContext } from "./context";
import type { HnsTransport } from "./context";

// Klub je tim 42 i ove sezone igra samo ligu 8. Liga 900 i utakmica 5000 su
// tuđe: postoje na HNS-u, ali ne pripadaju klubu.
const OWN_COMPETITION = 8;

const FOREIGN_COMPETITION = 900;

// SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
// HNS-ove OpenAPI strukture ovaj test ne dira.
const clubCompetitions = [
  { id: OWN_COMPETITION, name: `4. NL Središte ${currentSeasonTag()}` },
] as HnsCompetition[];

// SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
// HNS-ove OpenAPI strukture ovaj test ne dira.
const match = (
  id: number,
  homeId: number,
  awayId: number,
  competitionId: number,
) =>
  ({
    id,
    homeTeam: { id: homeId, name: `Tim ${homeId}` },
    awayTeam: { id: awayId, name: `Tim ${awayId}` },
    competition: { id: competitionId, name: `Natjecanje ${competitionId}` },
  }) as HnsMatch;

const matches = new Map([
  // Klub igra, i to u staroj sezoni koja više nije na popisu natjecanja.
  [101, match(101, 42, 7, 555)],
  // Klub ne igra, ali utakmica je u klupskoj ligi (tablica, forma, H2H).
  [102, match(102, 7, 9, OWN_COMPETITION)],
  // Tuđa utakmica u tuđem natjecanju.
  [5000, match(5000, 7, 9, FOREIGN_COMPETITION)],
  // Klub ne igra; utakmica je u skupini (podnatjecanju) klupske lige.
  [
    103,
    // SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
    // HNS-ove OpenAPI strukture ovaj test ne dira.
    {
      ...match(103, 7, 9, 81),
      competition: { id: 81, parentId: OWN_COMPETITION, name: "Skupina A" },
    } as HnsMatch,
  ],
]);

function fakeHns({ competitionListDown = false } = {}) {
  const calls: string[] = [];

  const transport: HnsTransport = async (endpoint) => {
    calls.push(endpoint);

    if (endpoint.startsWith("/api/live/competition/list/active/42")) {
      if (competitionListDown) throw new Error("HNS fetch failed (503)");

      return clubCompetitions;
    }

    const matchId = /^\/api\/live\/match\/(\d+)\?/.exec(endpoint)?.[1];

    if (matchId) {
      const found = matches.get(Number(matchId));

      if (found) return found;
      throw new Error("HNS fetch failed (404 Not Found)");
    }

    throw new Error(`unexpected endpoint ${endpoint}`);
  };

  const run = <T>(fn: () => Promise<T>) =>
    runWithHnsContext({ transport, teamId: "42", apiKey: "test-key" }, fn);

  return { calls, run };
}

describe("fetchClubCompetition", () => {
  it("vraća klupsko natjecanje uz jedan HNS poziv (popis natjecanja kluba)", async () => {
    const hns = fakeHns();

    const competition = await hns.run(() =>
      fetchClubCompetition(OWN_COMPETITION),
    );

    expect(competition).toMatchObject({ id: OWN_COMPETITION });
    expect(hns.calls).toEqual([
      "/api/live/competition/list/active/42?teamIdFilter=42",
    ]);
  });

  it("za tuđe natjecanje vraća null nakon samo provjere pripadnosti", async () => {
    const hns = fakeHns();

    const competition = await hns.run(() =>
      fetchClubCompetition(FOREIGN_COMPETITION),
    );

    expect(competition).toBeNull();
    expect(hns.calls).toHaveLength(1);
    expect(hns.calls[0]).toContain("/api/live/competition/list/active/42");
  });

  it("baca grešku kad popis natjecanja nije dostupan, umjesto lažnog 404", async () => {
    const hns = fakeHns({ competitionListDown: true });

    await expect(
      hns.run(() => fetchClubCompetition(OWN_COMPETITION)),
    ).rejects.toThrow();
  });
});

describe("fetchClubMatch", () => {
  it("utakmicu kluba vraća uz jedan HNS poziv", async () => {
    const hns = fakeHns();

    const found = await hns.run(() => fetchClubMatch(101));

    expect(found).toMatchObject({ id: 101 });
    expect(hns.calls).toEqual(["/api/live/match/101?teamIdFilter=42"]);
  });

  it("vraća utakmicu drugih momčadi u klupskom natjecanju", async () => {
    const hns = fakeHns();

    const found = await hns.run(() => fetchClubMatch(102));

    expect(found).toMatchObject({ id: 102 });
    expect(hns.calls).toHaveLength(2);
  });

  it("vraća utakmicu iz podnatjecanja klupske lige", async () => {
    const hns = fakeHns();

    expect(await hns.run(() => fetchClubMatch(103))).toMatchObject({
      id: 103,
    });
  });

  it("tuđu utakmicu odbija nakon dohvata utakmice i popisa natjecanja", async () => {
    const hns = fakeHns();

    const found = await hns.run(() => fetchClubMatch(5000));

    expect(found).toBeNull();
    expect(hns.calls).toEqual([
      "/api/live/match/5000?teamIdFilter=42",
      "/api/live/competition/list/active/42?teamIdFilter=42",
    ]);
  });

  it("nepostojeća utakmica košta jedan HNS poziv", async () => {
    const hns = fakeHns();

    expect(await hns.run(() => fetchClubMatch(777))).toBeNull();
    expect(hns.calls).toHaveLength(1);
  });
});
