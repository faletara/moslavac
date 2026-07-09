import "server-only";
import type {
  Lineups,
  Match,
  MatchEvent,
  MatchInfo,
} from "@/types/hns";
import { hnsList, hnsResource } from "./fetchResource";

const MATCH_TTL = 60;
const LIVE_MATCH_TTL = 30;

function fetchPastTeamMatches(): Promise<Match[]> {
  return hnsList<Match>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/past/2?page=1&pageSize=75`,
    tag: "team-matches",
    revalidate: MATCH_TTL,
    paginated: true,
  });
}

function fetchFutureTeamMatches(): Promise<Match[]> {
  return hnsList<Match>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/future/2?page=1&pageSize=75`,
    tag: "team-matches",
    revalidate: MATCH_TTL,
    paginated: true,
  });
}

export async function fetchAllMatches(): Promise<Match[]> {
  const [past, future] = await Promise.all([
    fetchPastTeamMatches(),
    fetchFutureTeamMatches(),
  ]);
  return [...past, ...future];
}

async function fetchTodayMatches(): Promise<Match[]> {
  const matches = await hnsList<Match>({
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

function fetchFutureMatches(): Promise<Match[]> {
  return hnsList<Match>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/future/2?page=1&pageSize=15`,
    tag: "upcoming",
    revalidate: MATCH_TTL,
    paginated: true,
  });
}

export async function fetchUpcomingMatches(): Promise<Match[]> {
  const [today, future] = await Promise.all([
    fetchTodayMatches(),
    fetchFutureMatches(),
  ]);
  const seen = new Set<number>();
  const merged: Match[] = [];
  for (const m of [...today, ...future]) {
    if (m.id == null || seen.has(m.id)) continue;
    seen.add(m.id);
    merged.push(m);
  }
  return merged.sort((a, b) => (a.dateTimeUTC ?? 0) - (b.dateTimeUTC ?? 0));
}

export function fetchMatchInfo(params: {
  matchId: number;
}): Promise<Match | null> {
  return hnsResource<Match>({
    path: () => `/api/live/match/${params.matchId}`,
    tag: `match-${params.matchId}`,
    revalidate: LIVE_MATCH_TTL,
  });
}

export function fetchMatchEvents(params: {
  matchId: number;
}): Promise<MatchEvent[]> {
  return hnsList<MatchEvent>({
    path: () => `/api/live/match/${params.matchId}/events?showComments=true`,
    tag: `match-${params.matchId}-events`,
    revalidate: LIVE_MATCH_TTL,
  });
}

export function fetchMatchLineups(params: {
  matchId: number;
}): Promise<Lineups | null> {
  return hnsResource<Lineups>({
    path: () => `/api/live/match/${params.matchId}/lineups`,
    tag: `match-${params.matchId}-lineups`,
    revalidate: MATCH_TTL,
  });
}

export function fetchMatchReferees(params: {
  matchId: number;
}): Promise<MatchInfo | null> {
  return hnsResource<MatchInfo>({
    path: () => `/api/live/match/${params.matchId}/info`,
    tag: `match-${params.matchId}-referees`,
    revalidate: MATCH_TTL,
  });
}
