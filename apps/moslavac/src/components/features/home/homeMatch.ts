import type { Match } from "@/types/hns";

export function getMatchVenue(match: Match | null): string | null {
  const place = match?.facility?.place?.trim();
  if (place) return place;

  return match?.facility?.name?.trim() || null;
}

/**
 * A homepage promotion promises the full matchday answer: when, who and where.
 * Partial HNS records remain available on the schedule, but must not power the
 * hero CTA or the official next-match panel.
 */
export function getPromotableNextMatch(match: Match | null): Match | null {
  const venue = getMatchVenue(match);

  if (
    match?.kickoffAtUtcMs == null ||
    match.kickoffAtUtcMs <= 0 ||
    !match.homeTeam?.name?.trim() ||
    !match.awayTeam?.name?.trim() ||
    !venue
  ) {
    return null;
  }

  return match;
}
