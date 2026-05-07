import "server-only";
import {
  currentSeasonTag,
  getHnsTeamId,
  getSeniorCompetitionFilter,
  hnsFetch,
} from "./client";
import { tenantSlug } from "../payload/getTenant";
import type {
  HnsCompetition,
  HnsMatch,
  PaginatedResult,
} from "@/types/hns";

const COMPETITIONS_TTL = 3600;
const STANDINGS_TTL = 900;

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

async function fetchPastAllMatches(competitionId: number): Promise<HnsMatch[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsMatch>>(
    `/api/live/competition/${competitionId}/matches/paginated/past/2/${teamId}?page=1&pageSize=300`,
    {
      revalidate: COMPETITIONS_TTL,
      tags: [`hns-${tenantSlug}-competition-${competitionId}-all-matches`],
    },
  );
  return result?.result ?? [];
}

async function fetchFutureAllMatches(
  competitionId: number,
): Promise<HnsMatch[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsMatch>>(
    `/api/live/competition/${competitionId}/matches/paginated/future/2/${teamId}?page=1&pageSize=300`,
    {
      revalidate: COMPETITIONS_TTL,
      tags: [`hns-${tenantSlug}-competition-${competitionId}-all-matches`],
    },
  );
  return result?.result ?? [];
}

export async function fetchAllCompetitionMatches(params: {
  competitionId: number;
}): Promise<HnsMatch[]> {
  const [past, future] = await Promise.all([
    fetchPastAllMatches(params.competitionId),
    fetchFutureAllMatches(params.competitionId),
  ]);
  return [...past, ...future];
}

export async function fetchNextMatch(): Promise<HnsMatch | null> {
  const senior = await fetchSeniorCompetition();
  if (!senior?.id) return null;
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsMatch>>(
    `/api/live/competition/${senior.id}/matches/paginated/future/2/${teamId}?page=1&pageSize=1&teamIdFilter=${teamId}`,
    {
      revalidate: 300,
      tags: [`hns-${tenantSlug}-next-match`],
    },
  );
  return result?.result?.[0] ?? null;
}

export async function fetchPreviousMatch(): Promise<HnsMatch | null> {
  const senior = await fetchSeniorCompetition();
  if (!senior?.id) return null;
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsMatch>>(
    `/api/live/competition/${senior.id}/matches/paginated/past/2/${teamId}?page=1&pageSize=1&teamIdFilter=${teamId}`,
    {
      revalidate: 300,
      tags: [`hns-${tenantSlug}-previous-match`],
    },
  );
  return result?.result?.[0] ?? null;
}
