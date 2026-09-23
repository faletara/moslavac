import { describe, expect, it } from "vitest";

import type { Competition, Match } from "@/types/hns";
import { matchSource, newsSource } from "./sources";

function match(over: Partial<Match> = {}): Match {
  // SAFETY: test fixture covers only the fields the sitemap sources read
  // (id, teams, kickoff, allowDetail); the rest is never touched here.
  return {
    id: 10,
    homeTeam: { id: 1, name: "Domaći" },
    awayTeam: { id: 2, name: "Gosti" },
    kickoffAtUtcMs: Date.UTC(2026, 6, 20),
    allowDetail: true,
    ...over,
  } as Match;
}

function competition(id: number | null, name: string): Competition {
  // SAFETY: test fixture covers only id and name, the two fields matchSource
  // reads from a competition.
  return { id, name } as Competition;
}

describe("newsSource", () => {
  it("gradi putanje novosti pod zadanim segmentom rute", async () => {
    const entries = await newsSource({
      segment: "/novosti",
      priority: 0.7,
      fetchEntries: async () => [
        {
          slug: "prva",
          date: "2026-01-01",
          updatedAt: "2026-01-02T00:00:00.000Z",
        },
        {
          slug: "druga",
          date: "2026-02-01",
          updatedAt: "2026-02-02T00:00:00.000Z",
        },
      ],
    })();

    expect(entries).toEqual([
      {
        path: "/novosti/prva",
        lastModified: "2026-01-02T00:00:00.000Z",
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        path: "/novosti/druga",
        lastModified: "2026-02-02T00:00:00.000Z",
        changeFrequency: "monthly",
        priority: 0.7,
      },
    ]);
  });
});

describe("matchSource", () => {
  it("skuplja utakmice svih natjecanja sezone pod zadanim segmentom", async () => {
    const entries = await matchSource({
      segment: "/utakmice",
      fetchCompetitions: async () => [
        competition(100, "Liga 25/26"),
        competition(200, "Kup 25/26"),
      ],
      fetchMatches: async ({ competitionId }) =>
        competitionId === 100 ? [match({ id: 11 })] : [match({ id: 22 })],
    })();

    expect(entries.map((entry) => entry.path)).toEqual(
      ["domaci-gosti-20-7-2026-11", "domaci-gosti-20-7-2026-22"].map(
        (slug) => `/utakmice/${slug}`,
      ),
    );
    expect(entries[0]).toMatchObject({
      changeFrequency: "weekly",
      priority: 0.6,
    });
  });

  it("izostavlja utakmice bez id-a ili detaljne stranice", async () => {
    const entries = await matchSource({
      segment: "/utakmice",
      fetchCompetitions: async () => [competition(100, "Liga 25/26")],
      fetchMatches: async () => [
        match({ id: 11 }),
        match({ id: null }),
        match({ id: 12, allowDetail: false }),
      ],
    })();

    expect(entries).toHaveLength(1);
    expect(entries[0]?.path).toContain("-11");
  });

  it("preskače natjecanje bez id-a i ne pada kada jedno natjecanje zakaže", async () => {
    const entries = await matchSource({
      segment: "/utakmice",
      fetchCompetitions: async () => [
        competition(null, "Bez id-a"),
        competition(200, "Kup 25/26"),
        competition(300, "Liga 25/26"),
      ],
      fetchMatches: async ({ competitionId }) => {
        if (competitionId === 200) throw new Error("HNS greška");

        return [match({ id: 33 })];
      },
    })();

    expect(entries.map((entry) => entry.path)).toEqual([
      "/utakmice/domaci-gosti-20-7-2026-33",
    ]);
  });

  it("koristi kickoff kao oznaku promjene", async () => {
    const kickoff = Date.UTC(2026, 6, 20);

    const [entry] = await matchSource({
      segment: "/utakmice",
      fetchCompetitions: async () => [competition(100, "Liga 25/26")],
      fetchMatches: async () => [match({ id: 11, kickoffAtUtcMs: kickoff })],
    })();

    expect(entry?.lastModified).toBe(kickoff);
  });
});
