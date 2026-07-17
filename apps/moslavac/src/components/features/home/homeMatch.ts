import type { Match } from "@/types/hns";

export function getMatchVenue(match: Match | null): string | null {
  const place = match?.facility?.place?.trim();
  if (place) return place;

  return match?.facility?.name?.trim() || null;
}

/**
 * A homepage promotion needs a kickoff and both teams. HNS may publish the
 * venue later, so a missing facility must not hide an otherwise valid fixture.
 */
export function getPromotableNextMatch(match: Match | null): Match | null {
  if (
    match?.kickoffAtUtcMs == null ||
    match.kickoffAtUtcMs <= 0 ||
    !match.homeTeam?.name?.trim() ||
    !match.awayTeam?.name?.trim()
  ) {
    return null;
  }

  return match;
}
