import { describe, expect, it } from "vitest";
import { adaptMatch, adaptMatchEvent } from "@/lib/hns/adapters";
import type { HnsMatch, HnsMatchEvent } from "@/types/hns";
import { toMatchFacts } from "./facts";

// 29. kolovoza 2026. u 17:00 po zagrebačkom vremenu.
const KICKOFF = Date.UTC(2026, 7, 29, 15, 0, 0);

const slogaGosk = (overrides: Partial<HnsMatch> = {}) =>
  // SAFETY: fixture nosi samo polja koja adapter čita; ostatak HNS-ove OpenAPI
  // strukture ovaj test ne dira.
  adaptMatch({
    id: 12345,
    dateTimeUTC: KICKOFF,
    homeTeam: { id: 1, name: "HNK Sloga Mravince", allowDetail: true },
    awayTeam: { id: 2, name: "NK Gošk Kaštela", allowDetail: true },
    homeTeamResult: { current: 0, half: 0 },
    awayTeamResult: { current: 0, half: 0 },
    liveStatus: "PLAYED",
    matchDayDesc: "1. kolo",
    competition: { id: 9, name: "Treća NL Jug 26/27", showStats: true },
    facility: { id: 3, name: "Stadion Glavica" },
    attendance: 100,
    team: "H",
    showEvents: true,
    allowDetail: true,
    ...overrides,
  } as HnsMatch);

const event = (raw: Partial<HnsMatchEvent>) =>
  // SAFETY: fixture nosi samo polja koja adapter čita; ostatak HNS-ove OpenAPI
  // strukture ovaj test ne dira.
  adaptMatchEvent({
    eventId: 1,
    eventType: { fcdName: "YELLOW", name: "Žuti karton" },
    minute: 16,
    homeTeam: false,
    player: { name: "Petar Sučić" },
    ...raw,
  } as HnsMatchEvent);

describe("toMatchFacts", () => {
  it("izvlači rezultat, natjecanje, kolo, stadion i gledatelje", () => {
    const facts = toMatchFacts(slogaGosk(), []);

    expect(facts).toMatchObject({
      matchId: 12345,
      matchSlug: "hnk-sloga-mravince-nk-gosk-kastela-29-8-2026-12345",
      competition: "Treća NL Jug 26/27",
      round: "1. kolo",
      homeTeam: "HNK Sloga Mravince",
      awayTeam: "NK Gošk Kaštela",
      homeGoals: 0,
      awayGoals: 0,
      venue: "Stadion Glavica",
      attendance: 100,
      time: "17:00",
      clubSide: "home",
    });
    expect(facts?.dateLong).toBe("29. kolovoza 2026.");
  });

  it("razvrstava događaje po vrsti i bilježi minutu i klub", () => {
    const facts = toMatchFacts(slogaGosk(), [
      event({ eventId: 1, minute: 16, player: { name: "Petar Sučić" } }),
      event({
        eventId: 2,
        minute: 58,
        homeTeam: true,
        player: { name: "Petar Ćubelić" },
      }),
      event({
        eventId: 3,
        eventType: { fcdName: "GOAL", name: "Pogodak" },
        minute: 71,
        homeTeam: true,
        player: { name: "Ivan Marić" },
      }),
    ]);

    expect(facts?.yellowCards).toEqual([
      {
        side: "away",
        team: "NK Gošk Kaštela",
        player: "Petar Sučić",
        display: "16'",
      },
      {
        side: "home",
        team: "HNK Sloga Mravince",
        player: "Petar Ćubelić",
        display: "58'",
      },
    ]);
    expect(facts?.goals).toEqual([
      {
        side: "home",
        team: "HNK Sloga Mravince",
        player: "Ivan Marić",
        display: "71'",
      },
    ]);
    expect(facts?.redCards).toEqual([]);
  });

  it("sudačku nadoknadu prikazuje kao 45+2, ne kao 45", () => {
    const facts = toMatchFacts(slogaGosk(), [
      event({
        eventType: { fcdName: "GOAL", name: "Pogodak" },
        minute: 45,
        stoppageTime: 2,
        homeTeam: true,
        player: { name: "Ivan Marić" },
      }),
    ]);

    expect(facts?.goals[0]?.display).toBe("45+2");
  });

  it("autogol ne završi među redovnim pogocima", () => {
    const facts = toMatchFacts(slogaGosk(), [
      event({
        eventType: { fcdName: "OWN_GOAL", name: "Autogol" },
        minute: 30,
        homeTeam: true,
        player: { name: "Ivan Marić" },
      }),
    ]);

    expect(facts?.goals).toEqual([]);
    expect(facts?.ownGoals).toHaveLength(1);
  });

  it("preskače događaj bez minute umjesto da ga prikaže kao 0'", () => {
    const facts = toMatchFacts(slogaGosk(), [
      event({ minute: undefined, minuteFull: undefined }),
    ]);

    expect(facts?.yellowCards).toEqual([]);
  });

  it("preskače događaj bez imena igrača", () => {
    const facts = toMatchFacts(slogaGosk(), [event({ player: undefined })]);

    expect(facts?.yellowCards).toEqual([]);
  });

  it("vraća null kad utakmica nema id ili termin", () => {
    expect(toMatchFacts(slogaGosk({ id: undefined }), [])).toBeNull();
    expect(toMatchFacts(slogaGosk({ dateTimeUTC: undefined }), [])).toBeNull();
  });
});
