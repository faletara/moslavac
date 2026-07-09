import "server-only";
import { currentSeasonTag, getSeniorCompetitionFilter } from "./client";
import { hnsList, hnsResource } from "./fetchResource";
import { isFinished } from "./matchStatus";
import { fetchUpcomingMatches } from "./matches";
import type { Competition, Match, MatchSlots } from "@/types/hns";

const COMPETITIONS_TTL = 3600;

export async function fetchCurrentSeasonCompetitions(): Promise<
  Competition[]
> {
  const competitions = await hnsList<Competition>({
    path: (teamId) => `/api/live/competition/list/active/${teamId}`,
    tag: "competitions",
    revalidate: COMPETITIONS_TTL,
  });

  const seasonTag = currentSeasonTag();
  return competitions.filter((c) => c.name?.includes(seasonTag));
}

export async function fetchSeniorCompetition(): Promise<Competition | null> {
  const [competitions, filter] = await Promise.all([
    fetchCurrentSeasonCompetitions(),
    getSeniorCompetitionFilter(),
  ]);
  if (!filter) return null;
  return competitions.find((c) => c.name?.includes(filter)) ?? null;
}

export function fetchCompetitionInfo(params: {
  competitionId: number;
}): Promise<Competition | null> {
  return hnsResource<Competition>({
    path: () => `/api/live/competition/${params.competitionId}`,
    tag: `competition-${params.competitionId}`,
    revalidate: COMPETITIONS_TTL,
  });
}

function fetchPastCompetitionMatches(
  competitionId: number,
): Promise<Match[]> {
  return hnsList<Match>({
    path: (teamId) =>
      `/api/live/competition/${competitionId}/matches/paginated/past/2/${teamId}?page=1&pageSize=75`,
    tag: `competition-${competitionId}-matches`,
    revalidate: COMPETITIONS_TTL,
    paginated: true,
  });
}

function fetchFutureCompetitionMatches(
  competitionId: number,
): Promise<Match[]> {
  return hnsList<Match>({
    path: (teamId) =>
      `/api/live/competition/${competitionId}/matches/paginated/future/2/${teamId}?page=1&pageSize=75`,
    tag: `competition-${competitionId}-matches`,
    revalidate: COMPETITIONS_TTL,
    paginated: true,
  });
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
    const batch = await hnsList<Match>({
      path: (teamId) =>
        `/api/live/competition/${competitionId}/matches/paginated/${direction}/2/${teamId}?page=${page}&pageSize=${MATCHES_PAGE_SIZE}`,
      tag: `competition-${competitionId}-all-matches`,
      revalidate: COMPETITIONS_TTL,
      paginated: true,
    });
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
    hnsList<Match>({
      path: (teamId) =>
        `/api/live/competition/${senior.id}/matches/paginated/past/2/${teamId}?page=1&pageSize=3`,
      tag: "match-slots",
      revalidate: MATCH_SLOT_TTL,
      paginated: true,
    }),
    hnsList<Match>({
      path: (teamId) =>
        `/api/live/competition/${senior.id}/matches/paginated/future/2/${teamId}?page=1&pageSize=1`,
      tag: "match-slots",
      revalidate: MATCH_SLOT_TTL,
      paginated: true,
    }),
  ]);

  const sortByDateDesc = (a: Match, b: Match) =>
    (b.dateTimeUTC ?? 0) - (a.dateTimeUTC ?? 0);

  const unfinishedPast = past.filter((m) => !isFinished(m)).sort(sortByDateDesc);
  const finishedPast = past.filter(isFinished).sort(sortByDateDesc);

  // The senior competition is season-scoped, so between seasons (old season
  // finished, new one not yet tagged as current) it has no future matches.
  // Fall back to the team-wide upcoming query, but keep only senior matches
  // (that query returns every age group) by matching the senior filter.
  const competitionNext = unfinishedPast[0] ?? future[0] ?? null;
  let next: Match | null = competitionNext;
  if (!next) {
    const filter = await getSeniorCompetitionFilter();
    const upcoming = await fetchUpcomingMatches();
    next =
      upcoming.find((m) =>
        filter ? m.competition?.name?.includes(filter) : false,
      ) ?? null;
  }
  const previous = finishedPast[0] ?? null;

  return { next, previous };
}
