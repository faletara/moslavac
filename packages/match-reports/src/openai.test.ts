import { describe, expect, it, vi } from "vitest";
import type OpenAI from "openai";
import type { MatchFacts } from "./facts";
import { openAiWriter, splitParagraphs, DEFAULT_MODEL } from "./openai";

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
};

const fakeClient = (output_text: string) => {
  const create = vi.fn().mockResolvedValue({ output_text });

  return {
    // SAFETY: dvojnik izlaže samo `responses.create`, jedino što
    // `openAiWriter` poziva na klijentu.
    client: { responses: { create } } as Pick<OpenAI, "responses">,
    create,
  };
};

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

describe("openAiWriter", () => {
  it("kaže modelu koji je klub naš, da izvještaj ne bude iz kuta protivnika", async () => {
    const { client, create } = fakeClient("Prvi.");

    await openAiWriter({ apiKey: "sk-test", client })(facts);

    const sent = JSON.parse(create.mock.calls[0][0].input);
    expect(sent.nasKlub).toEqual({
      ime: "HNK Sloga Mravince",
      igraKao: "domacin",
    });
  });

  it("bez `clubSide` nema `nasKlub` — izvještaj ostaje neutralan", async () => {
    const { client, create } = fakeClient("Prvi.");

    await openAiWriter({ apiKey: "sk-test", client })({
      ...facts,
      clubSide: null,
    });

    expect(JSON.parse(create.mock.calls[0][0].input).nasKlub).toBeNull();
  });

  it("šalje činjenice modelu i vraća odlomke", async () => {
    const { client, create } = fakeClient("Prvi.\n\nDrugi.\n\nTreći.");

    const paragraphs = await openAiWriter({ apiKey: "sk-test", client })(facts);

    expect(paragraphs).toEqual(["Prvi.", "Drugi.", "Treći."]);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: DEFAULT_MODEL,
        reasoning: { effort: "low" },
      }),
    );
  });

  it("ne šalje modelu interne podatke koji ne smiju u tekst", async () => {
    const { client, create } = fakeClient("Tekst.");

    await openAiWriter({ apiKey: "sk-test", client })(facts);

    // SAFETY: `create.mock.calls` je netipiziran, a ovaj test sam gradi ulaz
    // koji je proslijeđen, pa zna da je string.
    const input = create.mock.calls[0][0].input as string;
    expect(input).not.toContain("matchId");
    expect(input).not.toContain("matchSlug");
    expect(input).not.toContain("clubSide");
    // Imena strijelaca i isključenih moraju proći — njih tekst navodi poimence.
    expect(input).toContain("Stadion Glavica");
  });

  it("šalje sljedećeg protivnika — model ga piše svojim riječima", async () => {
    const { client, create } = fakeClient("Tekst.");

    await openAiWriter({ apiKey: "sk-test", client })({
      ...facts,
      nextMatch: {
        opponent: "NK Vodice",
        atHome: false,
        dateLong: "26. rujna 2026.",
        time: "16:30",
      },
    });

    // SAFETY: `create.mock.calls` je netipiziran, a ovaj test sam gradi ulaz
    // koji je proslijeđen, pa zna da je string.
    const input = JSON.parse(create.mock.calls[0][0].input as string);
    expect(input.sljedecaUtakmica).toEqual({
      protivnik: "NK Vodice",
      gdje: "u gostima",
      datum: "26. rujna 2026.",
      vrijeme: "16:30",
    });
  });

  it("žute kartone šalje kao zbrojeve, ne kao popis imena", async () => {
    const { client, create } = fakeClient("Tekst.");

    await openAiWriter({ apiKey: "sk-test", client })({
      ...facts,
      yellowCards: [
        { side: "home", team: "A", player: "Prvi", display: "10'" },
        { side: "home", team: "A", player: "Drugi", display: "20'" },
        { side: "away", team: "B", player: "Treći", display: "30'" },
      ],
    });

    // SAFETY: `create.mock.calls` je netipiziran, a ovaj test sam gradi ulaz
    // koji je proslijeđen, pa zna da je string.
    const input = JSON.parse(create.mock.calls[0][0].input as string);
    expect(input.yellowCards).toEqual({ ukupno: 3, domacin: 2, gosti: 1 });
    expect(create.mock.calls[0][0].input).not.toContain("Prvi");
  });

  it("model se može zamijeniti jednim parametrom", async () => {
    const { client, create } = fakeClient("Tekst.");

    await openAiWriter({ apiKey: "sk-test", client, model: "gpt-5.6-terra" })(
      facts,
    );

    expect(create.mock.calls[0][0].model).toBe("gpt-5.6-terra");
  });

  it("prazan model iz okoliša pada na zadani, ne na prazan string", async () => {
    const { client, create } = fakeClient("Tekst.");

    await openAiWriter({ apiKey: "sk-test", client, model: "" })(facts);

    expect(create.mock.calls[0][0].model).toBe(DEFAULT_MODEL);
  });

  it("greška iz API-ja se propušta dalje, hvata je withFallback", async () => {
    const create = vi.fn().mockRejectedValue(new Error("429 rate limit"));
    // SAFETY: dvojnik izlaže samo `responses.create`, jedino što
    // `openAiWriter` poziva na klijentu.
    const client = { responses: { create } } as Pick<OpenAI, "responses">;

    await expect(
      openAiWriter({ apiKey: "sk-test", client })(facts),
    ).rejects.toThrow("429 rate limit");
  });
});
