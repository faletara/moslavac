import { z } from "zod";
import type { MatchFacts } from "./facts";
import { INSTRUCTIONS, promptFacts, splitParagraphs } from "./prompt";
import type { MatchReportWriter } from "./template";

/**
 * Flash-Lite na besplatnom tieru Gemini API-ja. Klub objavljuje jedan izvještaj
 * tjedno, daleko ispod dnevnog limita, a nema prepaid kredita koji istječu
 * (zbog toga je OpenAI tiho padao na šablonu). `gemini-2.5-flash-lite` novim
 * korisnicima više nije dostupan, a `gemini-3.5-flash-lite` je na probi vraćao
 * 503 zbog opterećenja. Vidi ADR 0002.
 */
export const DEFAULT_MODEL = "gemini-3.1-flash-lite";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export interface GeminiWriterOptions {
  apiKey: string;
  model?: string;
  /** Ubrizgava se u testovima; u produkciji je globalni `fetch`. */
  fetch?: typeof fetch;
}

/**
 * Odgovor `generateContent` (REST v1beta), samo dio koji treba. Odgovor bez
 * teksta daje prazan niz, a prazan tekst odbije `verifyReport`.
 */
const generateResponse = z.object({
  candidates: z
    .array(
      z.object({
        content: z
          .object({
            parts: z.array(z.object({ text: z.string().optional() })).optional(),
          })
          .optional(),
      }),
    )
    .optional(),
});

const textOf = (body: z.output<typeof generateResponse>): string =>
  body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";

/**
 * Model kao pisac, preko REST-a — za jedan poziv tjedno SDK ne treba. Namjerno
 * ne hvata greške — `withFallback` ih pretvara u pad na šablonu, pa je odluka
 * o rezervi na jednom mjestu.
 */
export const geminiWriter = (opts: GeminiWriterOptions): MatchReportWriter => {
  const doFetch = opts.fetch ?? fetch;
  // `||`, ne `??`: prazan GEMINI_MATCH_REPORT_MODEL inače ruši svaki poziv.
  const model = opts.model || DEFAULT_MODEL;

  return async (facts: MatchFacts) => {
    const response = await doFetch(
      `${API_BASE}/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": opts.apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: INSTRUCTIONS }] },
          contents: [
            {
              role: "user",
              parts: [{ text: JSON.stringify(promptFacts(facts)) }],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 300);

      throw new Error(`Gemini ${response.status}: ${detail}`);
    }

    return splitParagraphs(
      textOf(generateResponse.parse(await response.json())),
    );
  };
};
