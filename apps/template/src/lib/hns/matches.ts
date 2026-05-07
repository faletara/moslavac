import "server-only";
import { getHnsTeamId, hnsFetch } from "./client";
import { tenantSlug } from "../payload/getTenant";
import { fetchSeniorCompetition } from "./competitions";
import type {
  HnsLineups,
  HnsMatch,
  HnsMatchEvent,
  HnsMatchInfo,
  PaginatedResult,
} from "@/types/hns";

const MATCH_TTL = 300;

async function fetchPastTeamMatches(): Promise<HnsMatch[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsMatch>>(
    `/api/live/team/${teamId}/matches/paginated/past/2?page=1&pageSize=75&teamIdFilter=${teamId}`,
    { revalidate: MATCH_TTL, tags: [`hns-${tenantSlug}-team-matches`] },
  );
  return result?.result ?? [];
}

async function fetchFutureTeamMatches(): Promise<HnsMatch[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsMatch>>(
    `/api/live/team/${teamId}/matches/paginated/future/2?page=1&pageSize=75&teamIdFilter=${teamId}`,
    { revalidate: MATCH_TTL, tags: [`hns-${tenantSlug}-team-matches`] },
  );
  return result?.result ?? [];
}

export async function fetchAllMatches(): Promise<HnsMatch[]> {
  const [past, future] = await Promise.all([
    fetchPastTeamMatches(),
    fetchFutureTeamMatches(),
  ]);
  return [...past, ...future];
}

async function fetchUpcomingExcludingSenior(
  seniorCompetitionId: number,
): Promise<HnsMatch[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsMatch>>(
    `/api/live/team/${teamId}/matches/paginated/future/2?page=1&pageSize=15&teamIdFilter=${teamId}`,
    { revalidate: MATCH_TTL, tags: [`hns-${tenantSlug}-upcoming`] },
  );
  if (!result?.result) return [];
  return result.result.filter(
    (m) => m.competition?.id != null && m.competition.id !== seniorCompetitionId,
  );
}

async function fetchTodayMatches(
  seniorCompetitionId: number,
): Promise<HnsMatch[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsMatch>>(
    `/api/live/team/${teamId}/matches/paginated/past/2?page=1&pageSize=10&teamIdFilter=${teamId}`,
    { revalidate: MATCH_TTL, tags: [`hns-${tenantSlug}-today`] },
  );
  if (!result?.result) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const tomorrowMs = todayMs + 86_400_000;
  const nowMs = Date.now();

  return result.result.filter((m) => {
    if (m.dateTimeUTC == null) return false;
    return (
      m.dateTimeUTC >= todayMs &&
      m.dateTimeUTC < tomorrowMs &&
      m.dateTimeUTC > nowMs &&
      (seniorCompetitionId == null ||
        m.competition?.id !== seniorCompetitionId)
    );
  });
}

export async function fetchUpcomingMatches(): Promise<HnsMatch[]> {
  const senior = await fetchSeniorCompetition();
  if (!senior?.id) return [];
  const seniorId = senior.id;
  const [today, upcoming] = await Promise.all([
    fetchTodayMatches(seniorId),
    fetchUpcomingExcludingSenior(seniorId),
  ]);
  return [...today, ...upcoming];
}

export async function fetchMatchInfo(params: {
  matchId: number;
}): Promise<HnsMatch | null> {
  const teamId = await getHnsTeamId();
  return hnsFetch<HnsMatch>(
    `/api/live/match/${params.matchId}?teamIdFilter=${teamId}`,
    {
      revalidate: MATCH_TTL,
      tags: [`hns-${tenantSlug}-match-${params.matchId}`],
    },
  );
}

export async function fetchMatchEvents(params: {
  matchId: number;
}): Promise<HnsMatchEvent[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<HnsMatchEvent[]>(
    `/api/live/match/${params.matchId}/events?teamIdFilter=${teamId}&showComments=true`,
    {
      revalidate: 60,
      tags: [`hns-${tenantSlug}-match-${params.matchId}-events`],
    },
  );
  return result ?? [];
}

export async function fetchMatchLineups(params: {
  matchId: number;
}): Promise<HnsLineups | null> {
  const teamId = await getHnsTeamId();
  return hnsFetch<HnsLineups>(
    `/api/live/match/${params.matchId}/lineups?teamIdFilter=${teamId}`,
    {
      revalidate: MATCH_TTL,
      tags: [`hns-${tenantSlug}-match-${params.matchId}-lineups`],
    },
  );
}

export async function fetchMatchReferees(params: {
  matchId: number;
}): Promise<HnsMatchInfo | null> {
  const teamId = await getHnsTeamId();
  return hnsFetch<HnsMatchInfo>(
    `/api/live/match/${params.matchId}/info?teamIdFilter=${teamId}`,
    {
      revalidate: MATCH_TTL,
      tags: [`hns-${tenantSlug}-match-${params.matchId}-referees`],
    },
  );
}
