import "server-only";
import { GoogleGenAI } from "@google/genai";

export interface MatchReportScorer {
  player: string;
  team: string;
  minute: number | null;
}

export interface MatchReportCard {
  player: string;
  team: string;
  type: "yellow" | "red";
  minute: number | null;
}

export interface MatchReportInput {
  ownTeam: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competitionName: string;
  round?: string | null;
  scorers: MatchReportScorer[];
  cards: MatchReportCard[];
  standing?: { position: number; points: number } | null;
}

export interface MatchReportDraft {
  title: string;
  paragraphs: string[];
}

// Cheap model is plenty for a factual report from structured data.
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

const SYSTEM_INSTRUCTION = `Ti si sportski novinar nogometnog kluba i pišeš kratak izvještaj s odigrane utakmice na hrvatskom jeziku.

STROGA PRAVILA:
- Piši ISKLJUČIVO iz danih podataka. NE izmišljaj događaje, imena, minute, izjave ni detalje kojih nema u podacima.
- Ako neki podatak nije naveden, ne spominji ga.
- Ton je umjeren i navijački, ali činjeničan. Bez pretjerivanja i dramatizacije.
- Piši iz perspektive kluba čije je ime navedeno kao "naš klub".
- Vrati ISKLJUČIVO JSON oblika: {"title": string, "paragraphs": string[]}.
- 2-4 kratka odlomka. Naslov sažima rezultat.`;

function buildPrompt(input: MatchReportInput): string {
  const lines: string[] = [];
  lines.push(`Naš klub: ${input.ownTeam}`);
  lines.push(`Natjecanje: ${input.competitionName}`);
  if (input.round) lines.push(`Kolo: ${input.round}`);
  lines.push(
    `Rezultat: ${input.homeTeam} ${input.homeScore} : ${input.awayScore} ${input.awayTeam}`,
  );

  if (input.scorers.length) {
    lines.push("Strijelci:");
    for (const s of input.scorers) {
      lines.push(
        `- ${s.player} (${s.team})${s.minute != null ? `, ${s.minute}. minuta` : ""}`,
      );
    }
  } else {
    lines.push("Strijelci: nema podataka o strijelcima.");
  }

  if (input.cards.length) {
    lines.push("Kartoni:");
    for (const c of input.cards) {
      lines.push(
        `- ${c.player} (${c.team}), ${c.type === "red" ? "crveni" : "žuti"} karton${
          c.minute != null ? `, ${c.minute}. minuta` : ""
        }`,
      );
    }
  }

  if (input.standing) {
    lines.push(
      `Pozicija našeg kluba na tablici nakon utakmice: ${input.standing.position}. mjesto, ${input.standing.points} bodova.`,
    );
  }

  return lines.join("\n");
}

/**
 * Generate a draft match report from structured HNS data. Returns null on any
 * failure (missing key, API error, malformed output) so the caller can retry.
 */
export async function generateMatchReportDraft(
  input: MatchReportInput,
): Promise<MatchReportDraft | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[ai] GEMINI_API_KEY not set; skipping match report");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(input),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) return null;

    const parsed = JSON.parse(text) as Partial<MatchReportDraft>;
    if (
      typeof parsed.title !== "string" ||
      !Array.isArray(parsed.paragraphs) ||
      parsed.paragraphs.some((p) => typeof p !== "string")
    ) {
      console.error("[ai] match report output malformed");
      return null;
    }

    return { title: parsed.title, paragraphs: parsed.paragraphs };
  } catch (err) {
    console.error("[ai] match report generation failed:", err);
    return null;
  }
}
