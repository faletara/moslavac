import { describe, expect, it } from "vitest";
import type { MatchFacts } from "./facts";
import { DEFAULT_MODEL, geminiWriter } from "./gemini";
import { splitParagraphs } from "./prompt";

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
  ],
  redCards: [],
  clubSide: "home",
  nextMatch: null,
};

const reply = (text: string) =>
  Response.json({ candidates: [{ content: { parts: [{ text }] } }] });

/** Dvojnik `fetch`-a koji pamti adresu i tijelo jedinog poziva. */
const fakeFetch = (text: string) => {
  const calls: { url: string; body: string }[] = [];

  const fake: typeof fetch = async (input, init) => {
    calls.push({ url: String(input), body: String(init?.body ?? "") });

    return reply(text);
  };

  return {
    fetch: fake,
    sent: () => JSON.parse(calls[0]?.body ?? "{}"),
    url: () => calls[0]?.url ?? "",
  };
};

/** Činjenice kako ih model vidi — JSON u jedinom korisničkom dijelu. */
const factsSent = (body: { contents: { parts: { text: string }[] }[] }) =>
  JSON.parse(body.contents[0].parts[0].text);

describe("splitParagraphs", () => {
  it("dijeli po praznom retku i sažima razmake", () => {
    expect(splitParagraphs("Prvi red.\n  \n\nDrugi\n red.\n")).toEqual([
      "Prvi red.",
      "Drugi red.",
    ]);
  });

  it("prazan odgovor daje prazan niz", () => {
    expect(splitParagraphs("   ")).toEqual([]);
  });
});

describe("geminiWriter", () => {
  it("šalje činjenice modelu i vraća odlomke", async () => {
    const f = fakeFetch("Prvi.\n\nDrugi.\n\nTreći.");

    const paragraphs = await geminiWriter({ apiKey: "k", fetch: f.fetch })(facts);

    expect(paragraphs).toEqual(["Prvi.", "Drugi.", "Treći."]);
    expect(f.url()).toContain(`/models/${DEFAULT_MODEL}:generateContent`);
  });

  it("kaže modelu koji je klub naš, da izvještaj ne bude iz kuta protivnika", async () => {
    const f = fakeFetch("Prvi.");

    await geminiWriter({ apiKey: "k", fetch: f.fetch })(facts);

    expect(factsSent(f.sent()).nasKlub).toEqual({
      ime: "HNK Sloga Mravince",
      igraKao: "domacin",
    });
  });

  it("ne šalje modelu interne podatke koji ne smiju u tekst", async () => {
    const f = fakeFetch("Tekst.");

    await geminiWriter({ apiKey: "k", fetch: f.fetch })(facts);

    const input = String(f.sent().contents[0].parts[0].text);
    expect(input).not.toContain("matchId");
    expect(input).not.toContain("matchSlug");
    expect(input).not.toContain("clubSide");
    expect(input).toContain("Stadion Glavica");
  });

  it("žute kartone šalje kao zbrojeve, ne kao popis imena", async () => {
    const f = fakeFetch("Tekst.");

    await geminiWriter({ apiKey: "k", fetch: f.fetch })(facts);

    expect(factsSent(f.sent()).yellowCards).toEqual({
      ukupno: 1,
      domacin: 0,
      gosti: 1,
    });
  });

  it("prazan model iz okoliša pada na zadani, ne na prazan string", async () => {
    const f = fakeFetch("Tekst.");

    await geminiWriter({ apiKey: "k", fetch: f.fetch, model: "" })(facts);

    expect(f.url()).toContain(`/models/${DEFAULT_MODEL}:`);
  });

  it("HTTP greška se propušta dalje, hvata je withFallback", async () => {
    const fetchFail: typeof fetch = async () =>
      new Response("high demand", { status: 503 });

    await expect(
      geminiWriter({ apiKey: "k", fetch: fetchFail })(facts),
    ).rejects.toThrow("Gemini 503");
  });
});
