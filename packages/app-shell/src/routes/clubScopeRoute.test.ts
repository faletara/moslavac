import { describe, expect, it } from "vitest";
import { currentSeasonTag } from "@/lib/hns/client";
import { runWithHnsContext } from "@/lib/hns/context";
import type { HnsTransport } from "@/lib/hns/context";
import type { HnsCompetition, HnsMatch } from "@/types/hns";
import {
  resolveClubCompetitionOr404,
  resolveClubMatchOr404,
} from "./clubScopeRoute";

// Klub je tim 42 i ove sezone igra samo ligu 8. Liga 900 i utakmica 5000 su
// tuđe. Pravila pripadnosti testira `packages/hns/src/clubScope.test.ts`;
// ovdje samo spoj slug → id → resolver → 404.

// SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju. Natjecanje
// bez oznake tekuće sezone u imenu ne ulazi u popis kluba.
const clubCompetitions = [
  { id: 8, name: `4. NL Središte ${currentSeasonTag()}` },
] as HnsCompetition[];

// SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju.
const matches = new Map([
  [101, { id: 101, homeTeam: { id: 42 }, awayTeam: { id: 7 } } as HnsMatch],
  [
    5000,
    {
      id: 5000,
      homeTeam: { id: 7 },
      awayTeam: { id: 9 },
      competition: { id: 900, name: "Tuđa liga" },
    } as HnsMatch,
  ],
]);

function fakeHns() {
  const calls: string[] = [];

  const transport: HnsTransport = async (endpoint) => {
    calls.push(endpoint);

    if (endpoint.startsWith("/api/live/competition/list/active/42")) {
      return clubCompetitions;
    }

    const matchId = /^\/api\/live\/match\/(\d+)\?/.exec(endpoint)?.[1];
    const found = matchId ? matches.get(Number(matchId)) : undefined;

    if (found) return found;
    throw new Error(`HNS fetch failed (404 Not Found) ${endpoint}`);
  };

  const run = <T>(fn: () => Promise<T>) =>
    runWithHnsContext({ transport, teamId: "42", apiKey: "test-key" }, fn);

  return { calls, run };
}

// `notFound()` baca grešku s ovim digestom; Next je pretvara u 404.
const NOT_FOUND = expect.objectContaining({
  digest: expect.stringContaining("404"),
});

describe("resolveClubCompetitionOr404", () => {
  it("vraća klupsko natjecanje iz sluga", async () => {
    const hns = fakeHns();

    await expect(
      hns.run(() => resolveClubCompetitionOr404("4-nl-srediste-8")),
    ).resolves.toMatchObject({ id: 8 });
  });

  it("tuđe natjecanje je 404", async () => {
    const hns = fakeHns();

    await expect(
      hns.run(() => resolveClubCompetitionOr404("tuda-liga-900")),
    ).rejects.toEqual(NOT_FOUND);
  });

  it("slug bez ida je 404 bez HNS poziva", async () => {
    const hns = fakeHns();

    await expect(
      hns.run(() => resolveClubCompetitionOr404("nema-ida")),
    ).rejects.toEqual(NOT_FOUND);
    expect(hns.calls).toEqual([]);
  });
});

describe("resolveClubMatchOr404", () => {
  it("vraća utakmicu kluba iz sluga", async () => {
    const hns = fakeHns();

    await expect(
      hns.run(() => resolveClubMatchOr404("klub-gost-101")),
    ).resolves.toMatchObject({ id: 101 });
  });

  it("tuđa utakmica je 404", async () => {
    const hns = fakeHns();

    await expect(
      hns.run(() => resolveClubMatchOr404("tim-7-tim-9-5000")),
    ).rejects.toEqual(NOT_FOUND);
  });

  it("slug bez ida je 404 bez HNS poziva", async () => {
    const hns = fakeHns();

    await expect(hns.run(() => resolveClubMatchOr404("0"))).rejects.toEqual(
      NOT_FOUND,
    );
    expect(hns.calls).toEqual([]);
  });
});
