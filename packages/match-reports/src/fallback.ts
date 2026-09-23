import type { MatchFacts } from "./facts";
import type { MatchReportWriter } from "./template";
import { verifyReport } from "./verify";

export interface FallbackEvent {
  matchId: number;
  reason: "provjera" | "greška";
  problems: string[];
}

/**
 * Spaja model i šablonu. Model piše, provjera presuđuje, šablona hvata pad.
 * Klub uvijek dobije objavu — u najgorem slučaju suhlju, nikad netočnu.
 */
export const withFallback = (
  primary: MatchReportWriter,
  fallback: MatchReportWriter,
  onFallback?: (event: FallbackEvent) => void,
): MatchReportWriter => {
  return async (facts: MatchFacts) => {
    const report = (reason: FallbackEvent["reason"], problems: string[]) =>
      onFallback?.({ matchId: facts.matchId, reason, problems });

    let paragraphs: string[];

    try {
      paragraphs = await primary(facts);
    } catch (error) {
      report("greška", [error instanceof Error ? error.message : String(error)]);

      return fallback(facts);
    }

    const verdict = verifyReport(paragraphs, facts);

    if (!verdict.ok) {
      report("provjera", verdict.problems);

      return fallback(facts);
    }

    return paragraphs;
  };
};
