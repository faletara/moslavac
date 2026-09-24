import { describe, expect, it } from "vitest";
import type { MatchFacts } from "./facts";
import { withFallback, type FallbackEvent } from "./fallback";
import { templateWriter } from "./template";
import { verifyReport } from "./verify";

const facts: MatchFacts = {
  matchId: 12345,
  matchSlug: "sloga-gosk-29-8-2026-12345",
  competition: "Treća NL Jug 26/27",
  round: "1. kolo",
  kickoffAtUtcMs: Date.UTC(2026, 7, 29, 15, 0, 0),
  dateLong: "29. kolovoza 2026.",
  time: "17:00",
  homeTeam: "HNK Sloga Mravince",
  awayTeam: "NK Gošk Kaštela",
  homeGoals: 0,
  awayGoals: 0,
  homeHalfTimeGoals: 0,
  awayHalfTimeGoals: 0,
  venue: "Stadion Glavica",
  attendance: 100,
  goals: [],
  ownGoals: [],
  yellowCards: [
    { side: "away", team: "NK Gošk Kaštela", player: "Petar Sučić", display: "16'" },
    { side: "home", team: "HNK Sloga Mravince", player: "Petar Ćubelić", display: "58'" },
  ],
  redCards: [],
  clubSide: "home",
};

const good = [
  "U 1. kolu Treće NL Jug 26/27 HNK Sloga Mravince i NK Gošk Kaštela odigrali su 0:0.",
  "Golova nije bilo. Sudac je podijelio dva žuta kartona, jedan domaćinu i jedan gostima.",
];

describe("verifyReport", () => {
  it("prihvaća tekst koji navodi točan rezultat i sve događaje", () => {
    expect(verifyReport(good, facts)).toEqual({ ok: true, problems: [] });
  });

  it("odbija krivi rezultat", () => {
    const bad = good.map((p) => p.replace("0:0", "1:0"));

    expect(verifyReport(bad, facts).problems).toContain(
      "rezultat 0:0 nije naveden",
    );
  });

  it("odbija tekst koji je ispustio strijelca", () => {
    const scored: MatchFacts = {
      ...facts,
      homeGoals: 1,
      goals: [
        {
          side: "home",
          team: "HNK Sloga Mravince",
          player: "Ivan Marić",
          display: "41'",
        },
      ],
    };

    const bad = [
      "HNK Sloga Mravince i NK Gošk Kaštela odigrali su 1:0.",
      "Sudac je podijelio dva žuta kartona.",
    ];

    expect(verifyReport(bad, scored).problems).toContain("nedostaje Ivan Marić");
  });

  it("ne traži imena žutih kartona — dovoljan je točan broj", () => {
    expect(verifyReport(good, facts).problems).not.toContain(
      "nedostaje Petar Sučić",
    );
  });

  it("odbija krivi ukupan broj žutih kartona", () => {
    const bad = [
      good[0],
      "Golova nije bilo. Sudac je podijelio pet žutih kartona, tri domaćinu i dva gostima.",
    ];

    const problems = verifyReport(bad, facts).problems;

    expect(problems).toContain("broj žutih kartona ne štima: nedostaje 1");
    expect(problems).toContain("broj žutih kartona ne štima: izmišljen broj 5");
    expect(problems).toContain("broj žutih kartona ne štima: izmišljen broj 3");
  });

  it("odbija krivu podjelu po momčadima", () => {
    const bad = [
      good[0],
      "Golova nije bilo. Sudac je podijelio dva žuta kartona, oba gostima.",
    ];

    expect(verifyReport(bad, facts).problems).toContain(
      "broj žutih kartona ne štima: nedostaje 1",
    );
  });

  it("brojka iz „1. kolu” ne prolazi kao broj kartona", () => {
    // Prva rečenica sadrži „1. kolu”; provjera gleda samo rečenicu s kartonima.
    const bad = [good[0], "Golova nije bilo. Sudac je podijelio sedam žutih kartona."];

    expect(verifyReport(bad, facts).problems).toContain(
      "broj žutih kartona ne štima: izmišljen broj 7",
    );
  });

  it("prepoznaje brojeve s dijakritikom (četiri, šest)", () => {
    const seven: MatchFacts = {
      ...facts,
      yellowCards: [
        ...Array.from({ length: 4 }, (_, i) => ({
          side: "home" as const,
          team: "A",
          player: `Domaci ${i}`,
          display: `${10 + i}'`,
        })),
        ...Array.from({ length: 3 }, (_, i) => ({
          side: "away" as const,
          team: "B",
          player: `Gost ${i}`,
          display: `${20 + i}'`,
        })),
      ],
    };

    const ok = [
      good[0],
      "Golova nije bilo. Sudac je podijelio sedam žutih kartona, četiri domaćinu i tri gostima.",
    ];

    expect(verifyReport(ok, seven)).toEqual({ ok: true, problems: [] });
  });

  it("minuta unutar rečenice o kartonima nije broj kartona", () => {
    const ok = [
      good[0],
      "Golova nije bilo. Sudac je podijelio dva žuta kartona, jedan domaćinu i jedan gostima, prvi u 16. minuti.",
    ];

    expect(verifyReport(ok, facts)).toEqual({ ok: true, problems: [] });
  });

  it("satnica 17:00 ne prolazi kao rezultat 7:0", () => {
    const sevenNil: MatchFacts = { ...facts, homeGoals: 7, awayGoals: 0 };
    const bad = ["Utakmica je počela u 17:00.", good[1]];

    expect(verifyReport(bad, sevenNil).problems).toContain(
      "rezultat 7:0 nije naveden",
    );
  });

  it("hvata izmišljenu minutu i u obliku „u 88. minuti”", () => {
    const bad = [...good, "Sloga je promašila u 88. minuti."];

    expect(verifyReport(bad, facts).problems).toContain("izmišljena minuta 88'");
  });

  it("odbija izmišljenu minutu", () => {
    const bad = [...good, "Sloga je imala priliku u 88' minuti."];

    expect(verifyReport(bad, facts).problems).toContain("izmišljena minuta 88'");
  });
});

describe("withFallback", () => {
  const modelWrote = (paragraphs: string[]) => async () => paragraphs;

  it("pušta model kroz kad provjera prođe", async () => {
    const write = withFallback(modelWrote(good), templateWriter);

    expect(await write(facts)).toEqual(good);
  });

  it("pada na šablonu kad provjera padne, i kaže zašto", async () => {
    const events: FallbackEvent[] = [];

    const write = withFallback(
      modelWrote(["Sloga je pobijedila 3:0."]),
      templateWriter,
      (e) => events.push(e),
    );

    expect(await write(facts)).toEqual(await templateWriter(facts));
    expect(events[0]).toMatchObject({ matchId: 12345, reason: "provjera" });
    expect(events[0].problems).toContain("rezultat 0:0 nije naveden");
  });

  it("pada na šablonu kad poziv modela baci grešku", async () => {
    const events: FallbackEvent[] = [];

    const write = withFallback(
      async () => {
        throw new Error("429 rate limit");
      },
      templateWriter,
      (e) => events.push(e),
    );

    expect(await write(facts)).toEqual(await templateWriter(facts));
    expect(events[0]).toMatchObject({
      reason: "greška",
      problems: ["429 rate limit"],
    });
  });
});

describe("imena igrača u živoj rečenici", () => {
  const scored = (player: string): MatchFacts => ({
    ...facts,
    homeGoals: 1,
    goals: [
      { side: "home", team: "HNK Sloga Mravince", player, display: "41'" },
    ],
  });

  it("prihvaća prezime u padežu", () => {
    const text = [
      "HNK Sloga Mravince i NK Gošk Kaštela odigrali su 1:0.",
      "Pogodak Marina Bilušića u 41. minuti odlučio je utakmicu. Sudac je podijelio dva žuta kartona, jedan domaćinu i jedan gostima.",
    ];

    expect(verifyReport(text, scored("Marino Bilušić"))).toEqual({
      ok: true,
      problems: [],
    });
  });

  it("prihvaća skraćeno dugo ime", () => {
    const text = [
      "HNK Sloga Mravince i NK Gošk Kaštela odigrali su 1:0.",
      "Coutada je zabio u 41. minuti. Sudac je podijelio dva žuta kartona, jedan domaćinu i jedan gostima.",
    ];

    expect(
      verifyReport(text, scored("Joao Pedro Ramos Coutada")),
    ).toEqual({ ok: true, problems: [] });
  });

  it("i dalje odbija tekst bez strijelca", () => {
    const text = [
      "HNK Sloga Mravince i NK Gošk Kaštela odigrali su 1:0.",
      "Gol je pao u 41. minuti. Sudac je podijelio dva žuta kartona, jedan domaćinu i jedan gostima.",
    ];

    expect(verifyReport(text, scored("Marino Bilušić")).problems).toContain(
      "nedostaje Marino Bilušić",
    );
  });

  it("kod istog prezimena traži i ime", () => {
    const brothers: MatchFacts = {
      ...facts,
      homeGoals: 2,
      goals: [
        { side: "home", team: "A", player: "Ante Bašić", display: "41'" },
        { side: "home", team: "A", player: "Matej Bašić", display: "70'" },
      ],
    };

    const text = [
      "HNK Sloga Mravince i NK Gošk Kaštela odigrali su 2:0.",
      "Bašić je zabio u 41. i u 70. minuti. Sudac je podijelio dva žuta kartona, jedan domaćinu i jedan gostima.",
    ];

    expect(verifyReport(text, brothers).problems).toContain(
      "nedostaje Ante Bašić",
    );
  });
});

describe("sljedeći protivnik", () => {
  const withNext: MatchFacts = {
    ...facts,
    nextMatch: {
      opponent: "HNK Primorac (BNM)",
      atHome: false,
      dateLong: "5. rujna 2026.",
      time: "16:30",
    },
  };

  it("prihvaća protivnika u padežu", () => {
    const text = [
      ...good,
      "Sloga iduće gostuje kod Primorca, 5. rujna u 16:30.",
    ];

    expect(verifyReport(text, withNext)).toEqual({ ok: true, problems: [] });
  });

  it("odbija tekst koji je ispustio sljedećeg protivnika", () => {
    expect(verifyReport(good, withNext).problems).toEqual([
      "nedostaje sljedeći protivnik HNK Primorac (BNM)",
      "nedostaje vrijeme sljedeće utakmice 16:30",
    ]);
  });
});
