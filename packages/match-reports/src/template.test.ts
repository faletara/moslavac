import { describe, expect, it } from "vitest";
import type { MatchFacts } from "./facts";
import {
  aftermathParagraph,
  templateTitle,
  templateWriter,
} from "./template";

const facts = (overrides: Partial<MatchFacts> = {}): MatchFacts => ({
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
  ],
  redCards: [],
  clubSide: "home",
  ...overrides,
});

describe("templateWriter", () => {
  it("navodi rezultat, natjecanje, termin, mjesto i gledatelje", async () => {
    const [headline] = await templateWriter(facts());

    expect(headline).toBe(
      "HNK Sloga Mravince i NK Gošk Kaštela odigrali su 0:0 " +
        "u 1. kolu natjecanja Treća NL Jug 26/27. " +
        "Utakmica je odigrana u subotu, 29. kolovoza 2026. u 17:00 " +
        "na igralištu Stadion Glavica, pred 100 gledatelja.",
    );
  });

  it("izostavlja igralište i gledatelje kad HNS te podatke nema", async () => {
    const [headline] = await templateWriter(
      facts({ venue: null, attendance: null }),
    );

    expect(headline).not.toContain("igralištu");
    expect(headline).not.toContain("pred");
  });

  it("nula gledatelja se ne spominje — to nije podatak nego prazno polje", async () => {
    const [headline] = await templateWriter(facts({ attendance: 0 }));

    expect(headline).not.toContain("pred");
  });

  it("bez pogodaka kaže da golova nije bilo", async () => {
    const [, goals] = await templateWriter(facts());

    expect(goals).toBe("Golova nije bilo ni u prvom ni u drugom poluvremenu.");
  });

  it("strijelce navodi u nominativu, bez sklanjanja imena", async () => {
    const [, goals] = await templateWriter(
      facts({
        homeGoals: 1,
        goals: [
          {
            side: "home",
            team: "HNK Sloga Mravince",
            player: "Ivan Marić",
            display: "45+2",
          },
        ],
      }),
    );

    expect(goals).toBe("Za domaću momčad pogodio je Ivan Marić (45+2).");
  });

  it("goli broj kola dobije lokativ, kao i puni oblik", async () => {
    const [bare] = await templateWriter(facts({ round: "1" }));
    const [dotted] = await templateWriter(facts({ round: "1." }));
    const [worded] = await templateWriter(facts({ round: "1. kolo" }));

    expect(bare).toContain("u 1. kolu natjecanja");
    expect(dotted).toContain("u 1. kolu natjecanja");
    expect(worded).toContain("u 1. kolu natjecanja");
  });

  it("bez kartona nema ni trećeg odlomka", async () => {
    const paragraphs = await templateWriter(facts({ yellowCards: [] }));

    expect(paragraphs).toHaveLength(2);
  });

  it("žute kartone broji umjesto da ih nabraja poimence", async () => {
    const [, , cards] = await templateWriter(facts());

    expect(cards).toBe(
      "Sudac je podijelio 2 žuta kartona, 1 domaćinu i 1 gostima.",
    );
  });

  it("crvene kartone i dalje navodi imenom i minutom", async () => {
    const [, , cards] = await templateWriter(
      facts({
        redCards: [
          {
            side: "away",
            team: "NK Gošk Kaštela",
            player: "Roko Radošević",
            display: "84'",
          },
        ],
      }),
    );

    expect(cards).toContain("Crveni karton dobio je Roko Radošević (84')");
  });

  it("naslov je rezultat, bez ičega drugog", () => {
    expect(templateTitle(facts())).toBe(
      "HNK Sloga Mravince – NK Gošk Kaštela 0:0",
    );
  });
});

describe("aftermathParagraph", () => {
  const withContext = facts({
    nextMatch: {
      opponent: "HNK Primorac (BNM)",
      atHome: false,
      dateLong: "5. rujna 2026.",
      time: "16:30",
    },
  });

  it("navodi sljedećeg protivnika s datumom", () => {
    expect(aftermathParagraph(withContext)).toBe(
      "Sljedeći protivnik u gostima: HNK Primorac (BNM), 5. rujna 2026. u 16:30.",
    );
  });

  it("ne spominje mjesto na tablici", () => {
    expect(aftermathParagraph(withContext)).not.toContain("tablici");
  });

  it("kod kuće se razlikuje od gostiju", () => {
    const home = facts({
      ...withContext,
      nextMatch: { ...withContext.nextMatch!, atHome: true },
    });

    expect(aftermathParagraph(home)).toContain("Sljedeći protivnik kod kuće:");
  });

  it("šablona ga dopiše kao zadnji odlomak", async () => {
    const paragraphs = await templateWriter(withContext);

    expect(paragraphs.at(-1)).toBe(aftermathParagraph(withContext));
  });

  it("prazan je kad HNS nema raspored", () => {
    expect(aftermathParagraph(facts())).toBe("");
  });
});
