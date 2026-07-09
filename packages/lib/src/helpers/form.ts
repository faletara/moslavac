import type { Match, MatchOutcome } from "@/types/hns";

export type FormResult = MatchOutcome;

export function getStandingsForm(form: FormResult[] | null | undefined): FormResult[] {
  return form ?? [];
}

export interface PlayedMatchSummary {
  match: Match;
  result: FormResult;
  goalsFor: number;
  goalsAgainst: number;
  isHome: boolean;
}

const isPlayed = (match: Match): boolean =>
  match.score.home.current != null && match.score.away.current != null;

const involvesTeam = (match: Match, teamId: number): boolean =>
  match.homeTeam?.id === teamId || match.awayTeam?.id === teamId;

export function getTeamPlayedMatches(
  matches: Match[],
  teamId: number,
): PlayedMatchSummary[] {
  return matches
    .filter((m) => isPlayed(m) && involvesTeam(m, teamId))
    .sort((a, b) => (b.kickoffAtUtcMs ?? 0) - (a.kickoffAtUtcMs ?? 0))
    .map((match) => {
      const isHome = match.homeTeam?.id === teamId;
      const goalsFor =
        (isHome ? match.score.home.current : match.score.away.current) ?? 0;
      const goalsAgainst =
        (isHome ? match.score.away.current : match.score.home.current) ?? 0;
      const result: FormResult =
        goalsFor > goalsAgainst ? "W" : goalsFor < goalsAgainst ? "L" : "D";
      return { match, result, goalsFor, goalsAgainst, isHome };
    });
}

export function getRecentForm(
  matches: Match[],
  teamId: number,
  limit = 5,
): PlayedMatchSummary[] {
  return getTeamPlayedMatches(matches, teamId).slice(0, limit);
}

export function getMatchOutcome(
  match: Match | null | undefined,
  ourTeamId: number,
): FormResult | null {
  if (!match || !isPlayed(match) || !involvesTeam(match, ourTeamId)) return null;

  const isHome = match.homeTeam?.id === ourTeamId;
  const goalsFor =
    (isHome ? match.score.home.current : match.score.away.current) ?? 0;
  const goalsAgainst =
    (isHome ? match.score.away.current : match.score.home.current) ?? 0;

  if (goalsFor > goalsAgainst) return "W";
  if (goalsFor < goalsAgainst) return "L";
  return "D";
}

export function getHeadToHead(
  matches: Match[],
  teamAId: number,
  teamBId: number,
): Match[] {
  return matches
    .filter(
      (m) =>
        (m.homeTeam?.id === teamAId && m.awayTeam?.id === teamBId) ||
        (m.homeTeam?.id === teamBId && m.awayTeam?.id === teamAId),
    )
    .filter(isPlayed)
    .sort((a, b) => (b.kickoffAtUtcMs ?? 0) - (a.kickoffAtUtcMs ?? 0));
}
