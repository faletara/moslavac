import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/payload/getNews", () => ({
  fetchNewsSitemapEntries: vi.fn(),
}));
vi.mock("@/lib/hns/competitions", () => ({
  fetchCurrentSeasonCompetitions: vi.fn(),
  fetchAllCompetitionMatches: vi.fn(),
}));

import {
  fetchCurrentSeasonCompetitions,
  fetchAllCompetitionMatches,
} from "@/lib/hns/competitions";
import { fetchNewsSitemapEntries } from "@/lib/payload/getNews";
import type { Match } from "@/types/hns";
import { matchSource, newsSource } from "./sources";

const asMock = <T extends (...args: never[]) => unknown>(fn: T) =>
  fn as unknown as ReturnType<typeof vi.fn>;

function match(over: Partial<Match> = {}): Match {
  return {
    id: 10,
    homeTeam: { id: 1, name: "Domaći" },
    awayTeam: { id: 2, name: "Gosti" },
    kickoffAtUtcMs: Date.UTC(2026, 6, 20),
    allowDetail: true,
    ...over,
  } as Match;
}

describe("newsSource", () => {
  it("gradi putanje novosti pod zadanim segmentom rute", async () => {
    asMock(fetchNewsSitemapEntries).mockResolvedValue([
      { slug: "prva", date: "2026-01-01", updatedAt: "2026-01-02T00:00:00.000Z" },
      { slug: "druga", date: "2026-02-01", updatedAt: "2026-02-02T00:00:00.000Z" },
    ]);

    const entries = await newsSource({ segment: "/novosti", priority: 0.7 })();

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
    asMock(fetchCurrentSeasonCompetitions).mockResolvedValue([
      { id: 100, name: "Liga 25/26" },
      { id: 200, name: "Kup 25/26" },
    ]);
    asMock(fetchAllCompetitionMatches).mockImplementation(
      async ({ competitionId }: { competitionId: number }) =>
        competitionId === 100
          ? [match({ id: 11 })]
          : [match({ id: 22 })],
    );

    const entries = await matchSource({ segment: "/utakmice" })();

    expect(entries.map((entry) => entry.path)).toEqual([
      "domaci-gosti-20-7-2026-11",
      "domaci-gosti-20-7-2026-22",
    ].map((slug) => `/utakmice/${slug}`));
    expect(entries[0]).toMatchObject({ changeFrequency: "weekly", priority: 0.6 });
  });

  it("izostavlja utakmice bez id-a ili detaljne stranice", async () => {
    asMock(fetchCurrentSeasonCompetitions).mockResolvedValue([
      { id: 100, name: "Liga 25/26" },
    ]);
    asMock(fetchAllCompetitionMatches).mockResolvedValue([
      match({ id: 11 }),
      match({ id: null }),
      match({ id: 12, allowDetail: false }),
    ]);

    const entries = await matchSource({ segment: "/utakmice" })();

    expect(entries).toHaveLength(1);
    expect(entries[0]?.path).toContain("-11");
  });

  it("preskače natjecanje bez id-a i ne pada kada jedno natjecanje zakaže", async () => {
    asMock(fetchCurrentSeasonCompetitions).mockResolvedValue([
      { id: null, name: "Bez id-a" },
      { id: 200, name: "Kup 25/26" },
      { id: 300, name: "Liga 25/26" },
    ]);
    asMock(fetchAllCompetitionMatches).mockImplementation(
      async ({ competitionId }: { competitionId: number }) => {
        if (competitionId === 200) throw new Error("HNS greška");
        return [match({ id: 33 })];
      },
    );

    const entries = await matchSource({ segment: "/utakmice" })();

    expect(entries.map((entry) => entry.path)).toEqual([
      "/utakmice/domaci-gosti-20-7-2026-33",
    ]);
  });

  it("koristi kickoff kao oznaku promjene", async () => {
    asMock(fetchCurrentSeasonCompetitions).mockResolvedValue([
      { id: 100, name: "Liga 25/26" },
    ]);
    const kickoff = Date.UTC(2026, 6, 20);
    asMock(fetchAllCompetitionMatches).mockResolvedValue([
      match({ id: 11, kickoffAtUtcMs: kickoff }),
    ]);

    const [entry] = await matchSource({ segment: "/utakmice" })();

    expect(entry?.lastModified).toBe(kickoff);
  });
});
