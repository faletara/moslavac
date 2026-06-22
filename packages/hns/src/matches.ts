import "server-only";
import type {
  HnsLineups,
  HnsMatch,
  HnsMatchEvent,
  HnsMatchInfo,
  PaginatedResult,
} from "@/types/hns";
import { tenantSlug } from "@/lib/payload/getTenant";
import { getHnsTeamId, hnsFetch } from "./client";

const MATCH_TTL = 60;
const LIVE_MATCH_TTL = 30;

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

async function fetchTodayMatches(): Promise<HnsMatch[]> {
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
      m.dateTimeUTC > nowMs
    );
  });
}

async function fetchFutureMatches(): Promise<HnsMatch[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsMatch>>(
    `/api/live/team/${teamId}/matches/paginated/future/2?page=1&pageSize=15&teamIdFilter=${teamId}`,
    { revalidate: MATCH_TTL, tags: [`hns-${tenantSlug}-upcoming`] },
  );
  return result?.result ?? [];
}

export async function fetchUpcomingMatches(): Promise<HnsMatch[]> {
  const [today, future] = await Promise.all([
    fetchTodayMatches(),
    fetchFutureMatches(),
  ]);
  const seen = new Set<number>();
  const merged: HnsMatch[] = [];
  for (const m of [...today, ...future]) {
    if (m.id == null || seen.has(m.id)) continue;
    seen.add(m.id);
    merged.push(m);
  }
  return merged.sort((a, b) => (a.dateTimeUTC ?? 0) - (b.dateTimeUTC ?? 0));
}

export async function fetchMatchInfo(params: {
  matchId: number;
}): Promise<HnsMatch | null> {
  const teamId = await getHnsTeamId();
  return hnsFetch<HnsMatch>(
    `/api/live/match/${params.matchId}?teamIdFilter=${teamId}`,
    {
      revalidate: LIVE_MATCH_TTL,
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
      revalidate: LIVE_MATCH_TTL,
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
