import "server-only";
import type {
  HnsLineups,
  HnsMatch,
  HnsMatchEvent,
  HnsMatchInfo,
} from "@/types/hns";
import { hnsList, hnsResource } from "./fetchResource";

const MATCH_TTL = 60;
const LIVE_MATCH_TTL = 30;

function fetchPastTeamMatches(): Promise<HnsMatch[]> {
  return hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/past/2?page=1&pageSize=75`,
    tag: "team-matches",
    revalidate: MATCH_TTL,
    paginated: true,
  });
}

function fetchFutureTeamMatches(): Promise<HnsMatch[]> {
  return hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/future/2?page=1&pageSize=75`,
    tag: "team-matches",
    revalidate: MATCH_TTL,
    paginated: true,
  });
}

export async function fetchAllMatches(): Promise<HnsMatch[]> {
  const [past, future] = await Promise.all([
    fetchPastTeamMatches(),
    fetchFutureTeamMatches(),
  ]);
  return [...past, ...future];
}

async function fetchTodayMatches(): Promise<HnsMatch[]> {
  const matches = await hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/past/2?page=1&pageSize=10`,
    tag: "today",
    revalidate: MATCH_TTL,
    paginated: true,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const tomorrowMs = todayMs + 86_400_000;
  const nowMs = Date.now();

  return matches.filter((m) => {
    if (m.dateTimeUTC == null) return false;
    return (
      m.dateTimeUTC >= todayMs &&
      m.dateTimeUTC < tomorrowMs &&
      m.dateTimeUTC > nowMs
    );
  });
}

function fetchFutureMatches(): Promise<HnsMatch[]> {
  return hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/future/2?page=1&pageSize=15`,
    tag: "upcoming",
    revalidate: MATCH_TTL,
    paginated: true,
  });
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

export function fetchMatchInfo(params: {
  matchId: number;
}): Promise<HnsMatch | null> {
  return hnsResource<HnsMatch>({
    path: () => `/api/live/match/${params.matchId}`,
    tag: `match-${params.matchId}`,
    revalidate: LIVE_MATCH_TTL,
  });
}

export function fetchMatchEvents(params: {
  matchId: number;
}): Promise<HnsMatchEvent[]> {
  return hnsList<HnsMatchEvent>({
    path: () => `/api/live/match/${params.matchId}/events?showComments=true`,
    tag: `match-${params.matchId}-events`,
    revalidate: LIVE_MATCH_TTL,
  });
}

export function fetchMatchLineups(params: {
  matchId: number;
}): Promise<HnsLineups | null> {
  return hnsResource<HnsLineups>({
    path: () => `/api/live/match/${params.matchId}/lineups`,
    tag: `match-${params.matchId}-lineups`,
    revalidate: MATCH_TTL,
  });
}

export function fetchMatchReferees(params: {
  matchId: number;
}): Promise<HnsMatchInfo | null> {
  return hnsResource<HnsMatchInfo>({
    path: () => `/api/live/match/${params.matchId}/info`,
    tag: `match-${params.matchId}-referees`,
    revalidate: MATCH_TTL,
  });
}
