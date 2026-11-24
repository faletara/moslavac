import type { MatchFacts } from "./facts";
import type { MatchReportWriter } from "./template";
import { verifyReport } from "./verify";

export interface FallbackEvent {
  matchId: number;
  reason: "provjera" | "greška";
  problems: string[];
}

/**
 * Koliko puta model smije pokušati prije šablone. Mali model ne prođe provjeru
 * otprilike svaki drugi put (ispusti minutu ili protivnika), a poziv je
 * besplatan — novi pokušaj je jeftiniji od suhog šablonskog teksta.
 */
export const DEFAULT_ATTEMPTS = 3;

/**
 * Spaja model i šablonu. Model piše, provjera presuđuje, šablona hvata pad.
 * Klub uvijek dobije objavu — u najgorem slučaju suhlju, nikad netočnu.
 * `onFallback` javlja razlog zadnjeg pokušaja, i to samo kad svi padnu.
 */
export const withFallback = (
  primary: MatchReportWriter,
  fallback: MatchReportWriter,
  onFallback?: (event: FallbackEvent) => void,
  attempts = DEFAULT_ATTEMPTS,
): MatchReportWriter => {
  return async (facts: MatchFacts) => {
    let last: Omit<FallbackEvent, "matchId"> = {
      reason: "greška",
      problems: [],
    };

    for (let attempt = 0; attempt < attempts; attempt++) {
      let paragraphs: string[];

      try {
        paragraphs = await primary(facts);
      } catch (error) {
        last = {
          reason: "greška",
          problems: [error instanceof Error ? error.message : String(error)],
        };
        continue;
      }

      const verdict = verifyReport(paragraphs, facts);

      if (verdict.ok) return paragraphs;

      last = { reason: "provjera", problems: verdict.problems };
    }

    onFallback?.({ matchId: facts.matchId, ...last });

    return fallback(facts);
  };
};
