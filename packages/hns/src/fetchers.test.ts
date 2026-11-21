import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  HnsLineups,
  HnsMatch,
  HnsMatchEvent,
  HnsMatchInfo,
  HnsPlayerCompetitionStats,
  HnsPlayerStats,
  HnsTeamPlayer,
  HnsTeamRanking,
} from "@/types/hns";
import { runWithHnsContext } from "./context";
import type { HnsTransport } from "./context";
import { currentSeasonTag } from "./client";
import {
  fetchAllCompetitionMatches,
  fetchCompetitionInfo,
  fetchCompetitionMatches,
  fetchCurrentSeasonCompetitions,
  fetchCurrentSeasonCompetitionsResult,
  fetchMatchSlots,
  fetchSeniorCompetition,
} from "./competitions";
import {
  fetchAllMatches,
  fetchMatchEvents,
  fetchMatchInfo,
  fetchMatchLineups,
  fetchMatchReferees,
  fetchUpcomingMatches,
} from "./matches";
import { fetchPlayerDetails, fetchPlayerPhotos, fetchPlayerStats, searchPlayers } from "./players";
import {
  fetchAllCompetitionRedCards,
  fetchAllCompetitionScorers,
  fetchAllCompetitionYellowCards,
  fetchCompetitionGoalStats,
  fetchCompetitionRedCardStats,
  fetchCompetitionYellowCardStats,
  fetchTeamStandings,
  fetchTeamStandingsUnofficial,
} from "./standings";
import { fetchClubDetails, fetchTeamDetails } from "./team";

const ctx = (transport: HnsTransport) => ({
  transport,
  teamId: "42",
  apiKey: "test-key",
});

describe("HNS fetchers", () => {
  it("keeps raw match payloads inside match fetchers", async () => {
    const calls: string[] = [];

    // SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
    // HNS-ove OpenAPI strukture ovaj test ne dira.
    const rawMatch = {
      id: 99,
      dateTimeUTC: 1_710_000_000_000,
      homeTeam: { id: 42, name: "NK Moslavac", allowDetail: true },
      awayTeam: { id: 7, name: "Gosti", allowDetail: true },
      homeTeamResult: { current: 2 },
      awayTeamResult: { current: 1 },
      result: "W",
      team: "H",
      allowDetail: true,
    } as HnsMatch;

    // SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
    // HNS-ove OpenAPI strukture ovaj test ne dira.
    const rawEvent = {
      eventId: 5,
      eventType: { name: "Pogodak", fcdName: "GOAL" },
      homeTeam: true,
      minuteFull: 18,
      player: { personId: 11, name: "Strijelac" },
    } as HnsMatchEvent;

    // SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
    // HNS-ove OpenAPI strukture ovaj test ne dira.
    const rawLineups = {
      home: {
        players: [
          {
            personId: 11,
            name: "Starter",
            events: [{ eventId: 6, eventType: { name: "Gol", fcdName: "GOAL" } }],
          },
        ],
        officials: [{ personId: 12, name: "Trener", role: "Coach" }],
      },
    } as HnsLineups;

    // SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
    // HNS-ove OpenAPI strukture ovaj test ne dira.
    const rawInfo = {
      matchOfficials: [{ personId: 13, name: "Sudac", role: "Referee" }],
    } as HnsMatchInfo;

    const transport: HnsTransport = async (endpoint) => {
      calls.push(endpoint);

      if (endpoint.startsWith("/api/live/match/99/events")) return [rawEvent];

      if (endpoint.startsWith("/api/live/match/99/lineups")) return rawLineups;

      if (endpoint.startsWith("/api/live/match/99/info")) return rawInfo;

      if (endpoint.startsWith("/api/live/match/99?")) return rawMatch;
      throw new Error(`unexpected endpoint ${endpoint}`);
    };

    const [match, events, lineups, info] = await runWithHnsContext(
      ctx(transport),
      () =>
        Promise.all([
          fetchMatchInfo({ matchId: 99 }),
          fetchMatchEvents({ matchId: 99 }),
          fetchMatchLineups({ matchId: 99 }),
          fetchMatchReferees({ matchId: 99 }),
        ]),
    );

    expect(match).toMatchObject({
      kickoffAtUtcMs: 1_710_000_000_000,
      score: { home: { current: 2 }, away: { current: 1 } },
      teamResult: "W",
      teamSide: "home",
    });
    expect(events[0]).toMatchObject({
      id: 5,
      type: { code: "GOAL" },
      side: "home",
      minute: 18,
    });
    expect(lineups?.home?.players[0]).toMatchObject({
      personId: 11,
      events: [{ id: 6, type: { code: "GOAL" } }],
    });
    expect(info?.officials[0]).toMatchObject({
      personId: 13,
      role: "Referee",
    });
    expect(calls).toContain("/api/live/match/99?teamIdFilter=42");
    expect(calls).toContain(
      "/api/live/match/99/events?showComments=true&teamIdFilter=42",
    );
  });

  it("keeps raw standings and leaderboard payloads inside standings fetchers", async () => {
    const transport: HnsTransport = async (endpoint) => {
      if (endpoint.includes("/standings/official")) {
        // SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
        // HNS-ove OpenAPI strukture ovaj test ne dira.
        return [
          {
            team: { id: 42, name: "NK Moslavac", allowDetail: true },
            played: 2,
            wins: 1,
            draws: 1,
            points: 4,
            m1: { result: "W" },
            m2: { result: "D" },
          } as HnsTeamRanking,
        ];
      }

      if (endpoint.includes("/stats/goals/42")) {
        // SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
        // HNS-ove OpenAPI strukture ovaj test ne dira.
        return [
          {
            player: { personId: 21, name: "Strijelac" },
            team: { id: 42, name: "NK Moslavac", allowDetail: true },
            value: 7,
          } as HnsPlayerStats,
        ];
      }

      throw new Error(`unexpected endpoint ${endpoint}`);
    };

    const [standings, scorers] = await runWithHnsContext(ctx(transport), () =>
      Promise.all([
        fetchTeamStandings({ competitionId: 8 }),
        fetchCompetitionGoalStats({ competitionId: 8 }),
      ]),
    );

    expect(standings[0]).toMatchObject({
      team: { id: 42 },
      points: 4,
      highlight: true,
      form: ["W", "D"],
    });
    expect(scorers[0]).toMatchObject({
      player: { personId: 21, name: "Strijelac" },
      team: { id: 42 },
      value: 7,
    });
  });

  it("keeps raw player payloads inside player fetchers", async () => {
    // SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
    // HNS-ove OpenAPI strukture ovaj test ne dira.
    const rawPlayer = {
      personId: 33,
      name: "Igrac",
      shortName: "I. Igrac",
      shirtNumber: 10,
      position: "Vezni",
      club: { id: 42, name: "NK Moslavac", allowDetail: true },
    } as HnsTeamPlayer;

    const transport: HnsTransport = async (endpoint) => {
      if (endpoint.startsWith("/api/live/player/search")) {
        // SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
        // HNS-ove OpenAPI strukture ovaj test ne dira.
        return { result: [rawPlayer, { name: "No id" } as HnsTeamPlayer] };
      }

      if (endpoint.startsWith("/api/live/player/33/stats/42")) {
        // SAFETY: fixture nosi samo polja koja fetcher i adapter čitaju; ostatak
        // HNS-ove OpenAPI strukture ovaj test ne dira.
        return [
          {
            competition: { id: 8, name: "Liga" },
            minutesPlayed: 90,
            goals: 1,
          } as HnsPlayerCompetitionStats,
        ];
      }

      if (endpoint.startsWith("/api/live/player/33?")) return rawPlayer;
      throw new Error(`unexpected endpoint ${endpoint}`);
    };

    const [details, stats, search] = await runWithHnsContext(ctx(transport), () =>
      Promise.all([
        fetchPlayerDetails({ personId: "33" }),
        fetchPlayerStats({ personId: "33", competitionId: 8 }),
        searchPlayers({ keyword: " igrac " }),
      ]),
    );

    expect(details).toMatchObject({
      personId: 33,
      name: "Igrac",
      club: { id: 42 },
    });
    expect(stats).toMatchObject({
      competition: { id: 8 },
      minutesPlayed: 90,
      goals: 1,
    });
    expect(search).toEqual([
      {
        personId: 33,
        name: "Igrac",
        shortName: "I. Igrac",
        picture: null,
        position: "Vezni",
        shirtNumber: 10,
      },
    ]);
  });
});

describe("HNS fetcher cache TTL", () => {
  type Fetch = (opts: { revalidate?: number }) => Promise<object | null>;

  // [name, call, the TTLs the fetcher used before per-call TTLs existed]
  const cases: [string, Fetch, number[]][] = [
    ["fetchMatchInfo", (o) => fetchMatchInfo({ matchId: 99, ...o }), [30]],
    ["fetchMatchEvents", (o) => fetchMatchEvents({ matchId: 99, ...o }), [30]],
    ["fetchMatchLineups", (o) => fetchMatchLineups({ matchId: 99, ...o }), [60]],
    ["fetchMatchReferees", (o) => fetchMatchReferees({ matchId: 99, ...o }), [60]],
    ["fetchAllMatches", (o) => fetchAllMatches(o), [60]],
    ["fetchUpcomingMatches", (o) => fetchUpcomingMatches(o), [60]],
    ["fetchCurrentSeasonCompetitionsResult", (o) => fetchCurrentSeasonCompetitionsResult(o), [3600]],
    ["fetchCurrentSeasonCompetitions", (o) => fetchCurrentSeasonCompetitions(o), [3600]],
    ["fetchSeniorCompetition", (o) => fetchSeniorCompetition(o), [3600]],
    ["fetchCompetitionInfo", (o) => fetchCompetitionInfo({ competitionId: 8, ...o }), [3600]],
    ["fetchCompetitionMatches", (o) => fetchCompetitionMatches({ competitionId: 8, ...o }), [3600]],
    ["fetchAllCompetitionMatches", (o) => fetchAllCompetitionMatches({ competitionId: 8, ...o }), [3600]],
    // competitions list → slots (none found) → team-wide upcoming fallback
    ["fetchMatchSlots", (o) => fetchMatchSlots(o), [3600, 30, 60]],
    ["fetchTeamStandings", (o) => fetchTeamStandings({ competitionId: 8, ...o }), [180]],
    ["fetchTeamStandingsUnofficial", (o) => fetchTeamStandingsUnofficial({ competitionId: 8, ...o }), [180]],
    ["fetchCompetitionGoalStats", (o) => fetchCompetitionGoalStats({ competitionId: 8, ...o }), [180]],
    ["fetchCompetitionRedCardStats", (o) => fetchCompetitionRedCardStats({ competitionId: 8, ...o }), [180]],
    ["fetchCompetitionYellowCardStats", (o) => fetchCompetitionYellowCardStats({ competitionId: 8, ...o }), [180]],
    ["fetchAllCompetitionScorers", (o) => fetchAllCompetitionScorers({ competitionId: 8, ...o }), [180]],
    ["fetchAllCompetitionYellowCards", (o) => fetchAllCompetitionYellowCards({ competitionId: 8, ...o }), [180]],
    ["fetchAllCompetitionRedCards", (o) => fetchAllCompetitionRedCards({ competitionId: 8, ...o }), [180]],
    ["fetchTeamDetails", (o) => fetchTeamDetails({ teamId: "7", ...o }), [3600]],
    ["fetchClubDetails", (o) => fetchClubDetails(o), [3600]],
    ["fetchPlayerDetails", (o) => fetchPlayerDetails({ personId: "33", ...o }), [3600]],
    ["fetchPlayerPhotos", (o) => fetchPlayerPhotos({ personIds: [33], ...o }), [3600]],
    ["fetchPlayerStats", (o) => fetchPlayerStats({ personId: "33", competitionId: 8, ...o }), [3600]],
    ["searchPlayers", (o) => searchPlayers({ keyword: "igrac", ...o }), [3600]],
  ];

  async function recordedTtls(call: Fetch, opts: { revalidate?: number }) {
    const ttls: (number | undefined)[] = [];

    const transport: HnsTransport = async (endpoint, fetchOpts) => {
      ttls.push(fetchOpts?.revalidate);

      if (endpoint.startsWith("/api/live/competition/list/active/")) {
        return [{ id: 8, name: `Seniori ${currentSeasonTag()}` }];
      }

      return [];
    };

    await runWithHnsContext(
      { ...ctx(transport), seniorCompetitionFilter: "Seniori" },
      () => call(opts),
    );

    return ttls;
  }

  it.each(cases)("%s passes a per-call revalidate to the transport", async (_name, call) => {
    const ttls = await recordedTtls(call, { revalidate: 86_400 });

    expect(ttls.length).toBeGreaterThan(0);
    expect(new Set(ttls)).toEqual(new Set([86_400]));
  });

  it.each(cases)("%s keeps its default TTL without one", async (_name, call, defaultTtls) => {
    const ttls = await recordedTtls(call, {});

    expect(new Set(ttls)).toEqual(new Set(defaultTtls));
  });
});

describe("CMS cron (explicit HNS context, HTTP transport)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches without cache even when a per-call revalidate is passed", async () => {
    const fetchMock = vi.fn(
      async (_url: string, _init: RequestInit & { next?: unknown }) =>
        Response.json(null),
    );

    vi.stubGlobal("fetch", fetchMock);

    await runWithHnsContext({ teamId: "42", apiKey: "test-key" }, () =>
      fetchMatchInfo({ matchId: 99, revalidate: 86_400 }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const init = fetchMock.mock.calls[0]![1];
    expect(init.cache).toBe("no-store");
    expect(init.next).toBeUndefined();
  });
});
