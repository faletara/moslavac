import "server-only";
import { parseTrailingId } from "@/lib/helpers/slug";
import type { Competition, Match } from "@/types/hns";
import { getHnsTeamId } from "./client";
import { fetchCurrentSeasonCompetitionsResult } from "./competitions";
import { fetchMatchInfo } from "./matches";

// Club scope for the HNS id routes (`/sezona/*`, `/utakmice/*`,
// `/raspored-i-rezultati/*`). The id in the URL is visitor-chosen, and every
// HNS call goes out with the club's API key. The competition and match pages
// fan out per team (standings, scorers, cards, paged match lists), so an id
// must belong to the club before any of that runs. Routes call these
// resolvers and `notFound()` on null.
//
// The membership data is the club's current-season competition list: one
// HNS URL, cached for an hour and already fetched by every page's shell.

async function fetchClubCompetitions(): Promise<Competition[]> {
  const { competitions, ok } = await fetchCurrentSeasonCompetitionsResult();

  // A failed list must not read as "not the club's": the route would cache a
  // 404 for a real page. Throwing lands on the route's error boundary instead.
  if (!ok) throw new Error("HNS: popis natjecanja kluba nije dostupan");

  return competitions;
}

/** Ids of the club's competitions, including their sub-competitions (phases, groups). */
function competitionIds(competitions: Competition[]): Set<number> {
  const ids = new Set<number>();

  for (const competition of competitions) {
    for (const c of [competition, ...competition.competitionElements]) {
      if (c.id != null) ids.add(c.id);
    }
  }

  return ids;
}

/** A club competition as resolved from a route: its id is always known. */
export type ClubCompetition = Competition & { id: number };

/**
 * The club's competition named by a `/sezona/[competitionId]` slug, or null
 * for a junk slug or a competition the club does not play this season.
 * Costs the one cached competition-list call; the entry doubles as the
 * competition info, so routes need no separate `fetchCompetitionInfo`.
 */
export async function fetchClubCompetition(
  slug: string,
): Promise<ClubCompetition | null> {
  const id = parseTrailingId(slug);

  if (id == null) return null;

  const competitions = await fetchClubCompetitions();

  return (
    competitions.find((c): c is ClubCompetition => c.id === id) ?? null
  );
}

/**
 * The match named by a match-route slug, or null for a junk slug, an unknown
 * id, or a match outside the club's scope. In scope: every match the club
 * plays (any season), and any match in the club's current competitions,
 * which the league pages link to.
 *
 * Costs one HNS call (the match itself, which the page needs anyway). Only a
 * match the club does not play adds the cached competition-list call.
 */
export async function fetchClubMatch(slug: string): Promise<Match | null> {
  const matchId = parseTrailingId(slug);

  if (matchId == null) return null;

  const [match, teamId] = await Promise.all([
    fetchMatchInfo({ matchId }),
    getHnsTeamId(),
  ]);

  if (!match) return null;

  const clubTeamId = Number(teamId);

  if (match.homeTeam?.id === clubTeamId || match.awayTeam?.id === clubTeamId) {
    return match;
  }

  const competition = match.competition;

  if (!competition) return null;

  const ids = competitionIds(await fetchClubCompetitions());

  const inScope = [competition.id, competition.parentId].some(
    (id) => id != null && ids.has(id),
  );

  return inScope ? match : null;
}
