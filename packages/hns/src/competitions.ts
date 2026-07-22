import "server-only";
import type {
  Competition,
  HnsCompetition,
  HnsMatch,
  Match,
  MatchSlots,
} from "@/types/hns";
import { adaptCompetition, adaptMatch } from "./adapters";
import { currentSeasonTag, getSeniorCompetitionFilter } from "./client";
import { hnsList, hnsListResult, hnsResource } from "./fetchResource";
import { isFinished } from "./matchStatus";
import { fetchUpcomingMatches } from "./matches";

const COMPETITIONS_TTL = 3600;

/**
 * Current-season competitions plus whether the HNS fetch succeeded. `ok: false`
 * means the request failed (so callers can show "temporarily unavailable"
 * instead of misreporting a failure as "no active competitions").
 */
export async function fetchCurrentSeasonCompetitionsResult(): Promise<{
  competitions: Competition[];
  ok: boolean;
}> {
  const { data, ok } = await hnsListResult<HnsCompetition>({
    path: (teamId) => `/api/live/competition/list/active/${teamId}`,
    tag: "competitions",
    revalidate: COMPETITIONS_TTL,
  });

  const seasonTag = currentSeasonTag();
  const competitions = data
    .map(adaptCompetition)
    .filter((competition): competition is Competition => competition !== null)
    .filter((c) => c.name.includes(seasonTag));

  return { competitions, ok };
}

export async function fetchCurrentSeasonCompetitions(): Promise<Competition[]> {
  return (await fetchCurrentSeasonCompetitionsResult()).competitions;
}

export async function fetchSeniorCompetition(): Promise<Competition | null> {
  const [competitions, filter] = await Promise.all([
    fetchCurrentSeasonCompetitions(),
    getSeniorCompetitionFilter(),
  ]);
  if (!filter) return null;
  return competitions.find((c) => c.name.includes(filter)) ?? null;
}

export async function fetchCompetitionInfo(params: {
  competitionId: number;
}): Promise<Competition | null> {
  const competition = await hnsResource<HnsCompetition>({
    path: () => `/api/live/competition/${params.competitionId}`,
    tag: `competition-${params.competitionId}`,
    revalidate: COMPETITIONS_TTL,
  });
  return adaptCompetition(competition);
}

async function fetchPastCompetitionMatches(
  competitionId: number,
): Promise<Match[]> {
  const matches = await hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/competition/${competitionId}/matches/paginated/past/2/${teamId}?page=1&pageSize=75`,
    tag: `competition-${competitionId}-matches`,
    revalidate: COMPETITIONS_TTL,
    paginated: true,
  });
  return matches.map(adaptMatch);
}

async function fetchFutureCompetitionMatches(
  competitionId: number,
): Promise<Match[]> {
  const matches = await hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/competition/${competitionId}/matches/paginated/future/2/${teamId}?page=1&pageSize=75`,
    tag: `competition-${competitionId}-matches`,
    revalidate: COMPETITIONS_TTL,
    paginated: true,
  });
  return matches.map(adaptMatch);
}

export async function fetchCompetitionMatches(params: {
  competitionId: number;
}): Promise<Match[]> {
  const [past, future] = await Promise.all([
    fetchPastCompetitionMatches(params.competitionId),
    fetchFutureCompetitionMatches(params.competitionId),
  ]);
  return [...past, ...future];
}

// HNS rejects large page sizes (pageSize=300 returns an empty result), so we
// page through with a proven-good size and stop once a short page comes back.
const MATCHES_PAGE_SIZE = 75;
const MATCHES_MAX_PAGES = 10;

async function fetchAllMatchesPaged(
  competitionId: number,
  direction: "past" | "future",
): Promise<Match[]> {
  const all: Match[] = [];

  for (let page = 1; page <= MATCHES_MAX_PAGES; page++) {
    const batch = (
      await hnsList<HnsMatch>({
        path: (teamId) =>
          `/api/live/competition/${competitionId}/matches/paginated/${direction}/2/${teamId}?page=${page}&pageSize=${MATCHES_PAGE_SIZE}`,
        tag: `competition-${competitionId}-all-matches`,
        revalidate: COMPETITIONS_TTL,
        paginated: true,
      })
    ).map(adaptMatch);
    all.push(...batch);
    if (batch.length < MATCHES_PAGE_SIZE) break;
  }

  return all;
}

export async function fetchAllCompetitionMatches(params: {
  competitionId: number;
}): Promise<Match[]> {
  const [past, future] = await Promise.all([
    fetchAllMatchesPaged(params.competitionId, "past"),
    fetchAllMatchesPaged(params.competitionId, "future"),
  ]);
  return [...past, ...future];
}

const MATCH_SLOT_TTL = 30;

export async function fetchMatchSlots(): Promise<MatchSlots> {
  const senior = await fetchSeniorCompetition();
  if (!senior?.id) return { next: null, previous: null };

  const [past, future] = await Promise.all([
    hnsList<HnsMatch>({
      path: (teamId) =>
        `/api/live/competition/${senior.id}/matches/paginated/past/2/${teamId}?page=1&pageSize=3`,
      tag: "match-slots",
      revalidate: MATCH_SLOT_TTL,
      paginated: true,
    }),
    hnsList<HnsMatch>({
      path: (teamId) =>
        `/api/live/competition/${senior.id}/matches/paginated/future/2/${teamId}?page=1&pageSize=1`,
      tag: "match-slots",
      revalidate: MATCH_SLOT_TTL,
      paginated: true,
    }),
  ]);

  const adaptedPast = past.map(adaptMatch);
  const adaptedFuture = future.map(adaptMatch);
  const sortByDateDesc = (a: Match, b: Match) =>
    (b.kickoffAtUtcMs ?? 0) - (a.kickoffAtUtcMs ?? 0);

  const unfinishedPast = adaptedPast
    .filter((m) => !isFinished(m))
    .sort(sortByDateDesc);
  const finishedPast = adaptedPast.filter(isFinished).sort(sortByDateDesc);

  // The senior competition is season-scoped, so between seasons (old season
  // finished, new one not yet tagged as current) it has no future matches.
  // Fall back to the team-wide upcoming query, but keep only senior matches
  // (that query returns every age group) by matching the senior filter.
  const competitionNext = unfinishedPast[0] ?? adaptedFuture[0] ?? null;
  let next: Match | null = competitionNext;
  if (!next) {
    const filter = await getSeniorCompetitionFilter();
    const upcoming = await fetchUpcomingMatches();
    next =
      upcoming.find((m) =>
        filter ? m.competition?.name.includes(filter) : false,
      ) ?? null;
  }
  const previous = finishedPast[0] ?? null;

  return { next, previous };
}
