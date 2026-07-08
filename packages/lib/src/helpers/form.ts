import type { HnsMatch, PastMatch } from "@/types/hns";

export type FormResult = "W" | "D" | "L";

// Parses HNS PastMatch.result strings into a FormResult.
// HNS returns inconsistent values across endpoints — handle EN ("W"/"L"/"D",
// "WIN"/"LOSS"/"DRAW"/"TIE") and HR ("P"/"I"/"N", "POBJEDA"/"PORAZ"/"NERIJEŠENO").
export function parsePastMatchResult(
  pastMatch: PastMatch | null | undefined,
): FormResult | null {
  const raw = pastMatch?.result;
  if (!raw) return null;
  const s = raw.trim().toUpperCase();
  if (!s) return null;

  if (s.startsWith("WIN") || s.startsWith("POB")) return "W";
  if (s.startsWith("LOS") || s.startsWith("POR")) return "L";
  if (s.startsWith("DRAW") || s.startsWith("TIE") || s.startsWith("NER"))
    return "D";

  const first = s[0];
  if (first === "W" || first === "P") return "W";
  if (first === "L" || first === "I") return "L";
  if (first === "D" || first === "N" || first === "T") return "D";

  return null;
}

export function getStandingsForm(
  m1: PastMatch | null | undefined,
  m2: PastMatch | null | undefined,
  m3: PastMatch | null | undefined,
  m4: PastMatch | null | undefined,
  m5: PastMatch | null | undefined,
): FormResult[] {
  return [m1, m2, m3, m4, m5]
    .map(parsePastMatchResult)
    .filter((r): r is FormResult => r !== null);
}

export interface PlayedMatchSummary {
  match: HnsMatch;
  result: FormResult;
  goalsFor: number;
  goalsAgainst: number;
  isHome: boolean;
}

const isPlayed = (match: HnsMatch): boolean =>
  match.homeTeamResult?.current != null &&
  match.awayTeamResult?.current != null;

const involvesTeam = (match: HnsMatch, teamId: number): boolean =>
  match.homeTeam?.id === teamId || match.awayTeam?.id === teamId;

export function getTeamPlayedMatches(
  matches: HnsMatch[],
  teamId: number,
): PlayedMatchSummary[] {
  return matches
    .filter((m) => isPlayed(m) && involvesTeam(m, teamId))
    .sort((a, b) => (b.dateTimeUTC ?? 0) - (a.dateTimeUTC ?? 0))
    .map((match) => {
      const isHome = match.homeTeam?.id === teamId;
      const goalsFor =
        (isHome
          ? match.homeTeamResult?.current
          : match.awayTeamResult?.current) ?? 0;
      const goalsAgainst =
        (isHome
          ? match.awayTeamResult?.current
          : match.homeTeamResult?.current) ?? 0;
      const result: FormResult =
        goalsFor > goalsAgainst ? "W" : goalsFor < goalsAgainst ? "L" : "D";
      return { match, result, goalsFor, goalsAgainst, isHome };
    });
}

export function getRecentForm(
  matches: HnsMatch[],
  teamId: number,
  limit = 5,
): PlayedMatchSummary[] {
  return getTeamPlayedMatches(matches, teamId).slice(0, limit);
}

export function getMatchOutcome(
  match: HnsMatch | null | undefined,
  ourTeamId: number,
): FormResult | null {
  if (!match || !isPlayed(match) || !involvesTeam(match, ourTeamId)) return null;

  const isHome = match.homeTeam?.id === ourTeamId;
  const goalsFor =
    (isHome
      ? match.homeTeamResult?.current
      : match.awayTeamResult?.current) ?? 0;
  const goalsAgainst =
    (isHome
      ? match.awayTeamResult?.current
      : match.homeTeamResult?.current) ?? 0;

  if (goalsFor > goalsAgainst) return "W";
  if (goalsFor < goalsAgainst) return "L";
  return "D";
}

export function getHeadToHead(
  matches: HnsMatch[],
  teamAId: number,
  teamBId: number,
): HnsMatch[] {
  return matches
    .filter(
      (m) =>
        (m.homeTeam?.id === teamAId && m.awayTeam?.id === teamBId) ||
        (m.homeTeam?.id === teamBId && m.awayTeam?.id === teamAId),
    )
    .filter(isPlayed)
    .sort((a, b) => (b.dateTimeUTC ?? 0) - (a.dateTimeUTC ?? 0));
}
