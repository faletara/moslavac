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
import {
  adaptCompetitionPlayerStat,
  adaptLineups,
  adaptMatch,
  adaptMatchEvent,
  adaptMatchInfo,
  adaptPlayer,
  adaptPlayerCompetitionStats,
  adaptPlayerSearchResult,
  adaptTeamRanking,
} from "./adapters";

describe("HNS adapters", () => {
  it("maps a raw match to the public match domain shape", () => {
    const match = adaptMatch({
      id: 99,
      dateTimeUTC: 1_710_000_000_000,
      homeTeam: { id: 42, name: " NK Moslavac ", allowDetail: true },
      awayTeam: { id: 7, name: "Gosti", allowDetail: false },
      homeTeamResult: { current: 2, half: 1, penaltyWin: true },
      awayTeamResult: { current: 1, half: 0 },
      homeTeamRedCards: 1,
      liveStatus: "RUNNING",
      minute: 72,
      currentMatchPhase: {
        phaseTypeId: 2,
        name: "Second half",
        fcdName: "SECOND_HALF",
      },
      competition: { id: 5, name: " 1. ZNL 25/26 ", showStats: true },
      facility: { id: 3, name: "Igraliste", field: { id: 4, name: "Main" } },
      result: "W",
      team: "H",
      showEvents: true,
      allowDetail: true,
    } as HnsMatch);

    expect(match).toMatchObject({
      id: 99,
      kickoffAtUtcMs: 1_710_000_000_000,
      homeTeam: { id: 42, name: "NK Moslavac", allowDetail: true },
      awayTeam: { id: 7, name: "Gosti", allowDetail: false },
      score: {
        home: { current: 2, half: 1, penaltyWin: true },
        away: { current: 1, half: 0, penaltyWin: false },
      },
      homeRedCards: 1,
      liveStatus: "RUNNING",
      minute: 72,
      currentPhase: { id: 2, name: "Second half", code: "SECOND_HALF" },
      competition: { id: 5, name: "1. ZNL 25/26", showStats: true },
      facility: { id: 3, name: "Igraliste", field: { id: 4, name: "Main" } },
      teamResult: "W",
      teamSide: "home",
      showEvents: true,
      allowDetail: true,
    });
  });

  it("maps standings rows and collapses m1-m5 into form", () => {
    const ranking = adaptTeamRanking(
      {
        team: { id: 42, name: "NK Moslavac", allowDetail: true },
        played: 5,
        wins: 3,
        draws: 1,
        losses: 1,
        goalsFor: 10,
        goalsAgainst: 4,
        points: 10,
        position: 2,
        liveResult: "D",
        m1: { result: "W" },
        m2: { result: "L" },
        m3: { result: "D" },
        m4: { result: undefined },
        m5: { result: "W" },
      } as HnsTeamRanking,
      42,
    );

    expect(ranking).toMatchObject({
      team: { id: 42, name: "NK Moslavac" },
      played: 5,
      wins: 3,
      draws: 1,
      losses: 1,
      goalsFor: 10,
      goalsAgainst: 4,
      points: 10,
      position: 2,
      liveResult: "D",
      highlight: true,
      form: ["W", "L", "D", "W"],
    });
  });

  it("maps players, player profile stats, leaderboard stats, and search rows", () => {
    const rawPlayer = {
      roleId: 1,
      personId: 123,
      name: " Igrac ",
      shortName: "I. Igrac",
      shirtNumber: 9,
      starting: true,
      captain: true,
      position: "Napadac",
      club: { id: 42, name: "NK Moslavac", allowDetail: true },
      hideProfile: false,
    } as HnsTeamPlayer;

    expect(adaptPlayer(rawPlayer)).toMatchObject({
      personId: 123,
      name: "Igrac",
      shirtNumber: 9,
      starting: true,
      captain: true,
      club: { id: 42, name: "NK Moslavac" },
      events: [],
      hideProfile: false,
    });

    expect(adaptPlayerCompetitionStats({
      minutesPlayed: 270,
      matchesPlayed: 3,
      goals: 2,
      yellowCards: 1,
      competition: { id: 8, name: "Kup" },
      allowDetail: true,
    } as HnsPlayerCompetitionStats)).toMatchObject({
      minutesPlayed: 270,
      matchesPlayed: 3,
      fullMatchesPlayed: 0,
      goals: 2,
      yellowCards: 1,
      competition: { id: 8, name: "Kup" },
      allowDetail: true,
    });

    expect(adaptCompetitionPlayerStat({
      player: rawPlayer,
      team: { id: 42, name: "NK Moslavac", allowDetail: true },
      value: 11,
    } as HnsPlayerStats)).toMatchObject({
      player: { personId: 123, name: "Igrac" },
      team: { id: 42, name: "NK Moslavac" },
      value: 11,
    });

    expect(adaptPlayerSearchResult(rawPlayer)).toEqual({
      personId: 123,
      name: "Igrac",
      shortName: "I. Igrac",
      picture: null,
      position: "Napadac",
      shirtNumber: 9,
    });
  });

  it("maps match events to stable domain event fields", () => {
    const event = adaptMatchEvent({
      eventId: 55,
      eventType: { eventTypeId: 1, name: "Pogodak", fcdName: "GOAL" },
      matchPhase: {
        phaseTypeId: 1,
        name: "First half",
        fcdName: "FIRST_HALF",
      },
      minute: 44,
      minuteFull: 45,
      stoppageTime: 2,
      displayMinute: "45+2'",
      player: { personId: 9, name: "Strijelac" },
      player2: { personId: 10, name: "Asistent" },
      homeTeam: false,
      orderNumber: 3,
      commentary: "Gol iz kontre",
    } as HnsMatchEvent);

    expect(event).toMatchObject({
      id: 55,
      type: { id: 1, name: "Pogodak", code: "GOAL" },
      phase: { id: 1, name: "First half", code: "FIRST_HALF" },
      phaseMinute: 44,
      minute: 45,
      stoppageTime: 2,
      displayMinute: "45+2'",
      player: { personId: 9, name: "Strijelac" },
      secondaryPlayer: { personId: 10, name: "Asistent" },
      side: "away",
      orderNumber: 3,
      commentary: "Gol iz kontre",
    });
  });

  it("maps lineups, lineup player events, officials, and match info officials", () => {
    const lineups = adaptLineups({
      home: {
        formation: "4-3-3",
        playerKitColor: "#ffffff",
        players: [
          {
            personId: 11,
            name: "Starter",
            starting: true,
            events: [
              {
                eventId: 77,
                eventType: { name: "Zuti karton", fcdName: "YELLOW" },
                homeTeam: true,
                minuteFull: 33,
              },
            ],
          },
        ],
        officials: [{ personId: 12, name: "Trener", role: "Coach" }],
      },
      away: { players: [], officials: [] },
    } as HnsLineups);

    expect(lineups).toMatchObject({
      home: {
        formation: "4-3-3",
        playerKitColor: "#ffffff",
        players: [
          {
            personId: 11,
            name: "Starter",
            starting: true,
            events: [{ id: 77, type: { code: "YELLOW" }, side: "home" }],
          },
        ],
        officials: [{ personId: 12, name: "Trener", role: "Coach" }],
      },
      away: { players: [], officials: [] },
    });

    expect(adaptMatchInfo({
      refereeKit: " kit ",
      matchOfficials: [{ personId: 13, name: "Sudac", role: "Referee" }],
    } as HnsMatchInfo)).toMatchObject({
      refereeKit: "kit",
      officials: [{ personId: 13, name: "Sudac", role: "Referee" }],
    });
  });
});
