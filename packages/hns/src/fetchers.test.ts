import { describe, expect, it } from "vitest";
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
import { fetchMatchEvents, fetchMatchInfo, fetchMatchLineups, fetchMatchReferees } from "./matches";
import { fetchPlayerDetails, fetchPlayerStats, searchPlayers } from "./players";
import { fetchCompetitionGoalStats, fetchTeamStandings } from "./standings";

const ctx = (transport: HnsTransport) => ({
  transport,
  teamId: "42",
  apiKey: "test-key",
});

describe("HNS fetchers", () => {
  it("keeps raw match payloads inside match fetchers", async () => {
    const calls: string[] = [];
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
    const rawEvent = {
      eventId: 5,
      eventType: { name: "Pogodak", fcdName: "GOAL" },
      homeTeam: true,
      minuteFull: 18,
      player: { personId: 11, name: "Strijelac" },
    } as HnsMatchEvent;
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
        return { result: [rawPlayer, { name: "No id" } as HnsTeamPlayer] };
      }
      if (endpoint.startsWith("/api/live/player/33/stats/42")) {
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
