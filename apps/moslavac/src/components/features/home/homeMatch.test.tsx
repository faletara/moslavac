import { describe, expect, it } from "vitest";
import type { Match, Team } from "@/types/hns";
import { getPromotableNextMatch } from "./homeMatch";

function makeTeam(name: string): Team {
  return {
    id: null,
    fifaId: null,
    name,
    picture: null,
    country: null,
    place: null,
    website: null,
    email: null,
    phone: null,
    mobilePhone: null,
    facebook: null,
    twitter: null,
    instagram: null,
    youtube: null,
    tikTok: null,
    address: null,
    latitude: null,
    longitude: null,
    hasTeams: false,
    allowDetail: true,
    parent: null,
    facility: null,
  };
}

function makeUpcomingMatch(): Match {
  const emptyScoreSide = {
    current: null,
    regular: null,
    half: null,
    extra: null,
    penalties: null,
    penaltyWin: false,
  };

  return {
    id: 1,
    homeTeam: makeTeam("SNK Moslavac"),
    awayTeam: makeTeam("NK Kloštar"),
    score: { home: emptyScoreSide, away: { ...emptyScoreSide } },
    homeRedCards: null,
    awayRedCards: null,
    liveStatus: null,
    minute: null,
    kickoffAtUtcMs: Date.UTC(2026, 7, 22, 15, 30),
    matchDay: null,
    matchOrderNumber: null,
    round: null,
    roundOrder: null,
    matchNumber: null,
    matchDayDescription: null,
    status: null,
    statusDescription: null,
    resultSupplement: null,
    currentMinute: null,
    resultString: null,
    currentPhase: null,
    competition: null,
    facility: null,
    teamResult: null,
    teamSide: null,
    attendance: null,
    showEvents: false,
    allowDetail: true,
  };
}

describe("getPromotableNextMatch", () => {
  it("zadržava sljedeću utakmicu kada HNS još nema lokaciju", () => {
    const match = makeUpcomingMatch();

    expect(getPromotableNextMatch(match)).toBe(match);
  });
});
