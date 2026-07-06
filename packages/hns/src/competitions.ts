import "server-only";
import {
  currentSeasonTag,
  getHnsTeamId,
  getSeniorCompetitionFilter,
  hnsFetch,
} from "./client";
import { tenantSlug } from "@/lib/payload/getTenant";
import { isFinished } from "./matchStatus";
import { fetchUpcomingMatches } from "./matches";
import type {
  HnsCompetition,
  HnsMatch,
  MatchSlots,
  PaginatedResult,
} from "@/types/hns";

const COMPETITIONS_TTL = 3600;
const STANDINGS_TTL = 180;

export async function fetchCurrentSeasonCompetitions(): Promise<
  HnsCompetition[]
> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<HnsCompetition[]>(
    `/api/live/competition/list/active/${teamId}?teamIdFilter=${teamId}`,
    {
      revalidate: COMPETITIONS_TTL,
      tags: [`hns-${tenantSlug}-competitions`],
    },
  );
  if (!result) return [];

  const seasonTag = currentSeasonTag();
  return result.filter((c) => c.name?.includes(seasonTag));
}

export async function fetchSeniorCompetition(): Promise<HnsCompetition | null> {
  const [competitions, filter] = await Promise.all([
    fetchCurrentSeasonCompetitions(),
    getSeniorCompetitionFilter(),
  ]);
  if (!filter) return null;
  return competitions.find((c) => c.name?.includes(filter)) ?? null;
}

export async function fetchCompetitionInfo(params: {
  competitionId: number;
}): Promise<HnsCompetition | null> {
  const teamId = await getHnsTeamId();
  return hnsFetch<HnsCompetition>(
    `/api/live/competition/${params.competitionId}?teamIdFilter=${teamId}`,
    {
      revalidate: COMPETITIONS_TTL,
      tags: [`hns-${tenantSlug}-competition-${params.competitionId}`],
    },
  );
}

async function fetchPastCompetitionMatches(
  competitionId: number,
): Promise<HnsMatch[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsMatch>>(
    `/api/live/competition/${competitionId}/matches/paginated/past/2/${teamId}?page=1&pageSize=75&teamIdFilter=${teamId}`,
    {
      revalidate: COMPETITIONS_TTL,
      tags: [`hns-${tenantSlug}-competition-${competitionId}-matches`],
    },
  );
  return result?.result ?? [];
}

async function fetchFutureCompetitionMatches(
  competitionId: number,
): Promise<HnsMatch[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsMatch>>(
    `/api/live/competition/${competitionId}/matches/paginated/future/2/${teamId}?page=1&pageSize=75&teamIdFilter=${teamId}`,
    {
      revalidate: COMPETITIONS_TTL,
      tags: [`hns-${tenantSlug}-competition-${competitionId}-matches`],
    },
  );
  return result?.result ?? [];
}

export async function fetchCompetitionMatches(params: {
  competitionId: number;
}): Promise<HnsMatch[]> {
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
): Promise<HnsMatch[]> {
  const teamId = await getHnsTeamId();
  const all: HnsMatch[] = [];

  for (let page = 1; page <= MATCHES_MAX_PAGES; page++) {
    const result = await hnsFetch<PaginatedResult<HnsMatch>>(
      `/api/live/competition/${competitionId}/matches/paginated/${direction}/2/${teamId}?page=${page}&pageSize=${MATCHES_PAGE_SIZE}&teamIdFilter=${teamId}`,
      {
        revalidate: COMPETITIONS_TTL,
        tags: [`hns-${tenantSlug}-competition-${competitionId}-all-matches`],
      },
    );
    const batch = result?.result ?? [];
    all.push(...batch);
    if (batch.length < MATCHES_PAGE_SIZE) break;
  }

  return all;
}

export async function fetchAllCompetitionMatches(params: {
  competitionId: number;
}): Promise<HnsMatch[]> {
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

  const teamId = await getHnsTeamId();
  const [pastResult, futureResult] = await Promise.all([
    hnsFetch<PaginatedResult<HnsMatch>>(
      `/api/live/competition/${senior.id}/matches/paginated/past/2/${teamId}?page=1&pageSize=3&teamIdFilter=${teamId}`,
      {
        revalidate: MATCH_SLOT_TTL,
        tags: [`hns-${tenantSlug}-match-slots`],
      },
    ),
    hnsFetch<PaginatedResult<HnsMatch>>(
      `/api/live/competition/${senior.id}/matches/paginated/future/2/${teamId}?page=1&pageSize=1&teamIdFilter=${teamId}`,
      {
        revalidate: MATCH_SLOT_TTL,
        tags: [`hns-${tenantSlug}-match-slots`],
      },
    ),
  ]);

  const past = pastResult?.result ?? [];
  const sortByDateDesc = (a: HnsMatch, b: HnsMatch) =>
    (b.dateTimeUTC ?? 0) - (a.dateTimeUTC ?? 0);

  const unfinishedPast = past.filter((m) => !isFinished(m)).sort(sortByDateDesc);
  const finishedPast = past.filter(isFinished).sort(sortByDateDesc);

  // The senior competition is season-scoped, so between seasons (old season
  // finished, new one not yet tagged as current) it has no future matches.
  // Fall back to the team-wide upcoming query, but keep only senior matches
  // (that query returns every age group) by matching the senior filter.
  const competitionNext =
    unfinishedPast[0] ?? futureResult?.result?.[0] ?? null;
  let next: HnsMatch | null = competitionNext;
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
