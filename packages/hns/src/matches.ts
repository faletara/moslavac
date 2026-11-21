import "server-only";
import type {
  HnsLineups,
  HnsMatch,
  HnsMatchEvent,
  HnsMatchInfo,
  Lineups,
  Match,
  MatchEvent,
  MatchInfo,
} from "@/types/hns";
import { adaptLineups, adaptMatch, adaptMatchEvent, adaptMatchInfo } from "./adapters";
import { hnsList, hnsResource } from "./fetchResource";
import type { HnsCacheOptions } from "./fetchResource";

const MATCH_TTL = 60;

const LIVE_MATCH_TTL = 30;

async function fetchPastTeamMatches(revalidate: number): Promise<Match[]> {
  const matches = await hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/past/2?page=1&pageSize=75`,
    tag: "team-matches",
    revalidate,
    paginated: true,
  });

  return matches.map(adaptMatch);
}

async function fetchFutureTeamMatches(revalidate: number): Promise<Match[]> {
  const matches = await hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/future/2?page=1&pageSize=75`,
    tag: "team-matches",
    revalidate,
    paginated: true,
  });

  return matches.map(adaptMatch);
}

export async function fetchAllMatches(
  opts: HnsCacheOptions = {},
): Promise<Match[]> {
  const revalidate = opts.revalidate ?? MATCH_TTL;

  const [past, future] = await Promise.all([
    fetchPastTeamMatches(revalidate),
    fetchFutureTeamMatches(revalidate),
  ]);

  return [...past, ...future];
}

async function fetchTodayMatches(revalidate: number): Promise<Match[]> {
  const matches = (
    await hnsList<HnsMatch>({
      path: (teamId) =>
        `/api/live/team/${teamId}/matches/paginated/past/2?page=1&pageSize=10`,
      tag: "today",
      revalidate,
      paginated: true,
    })
  ).map(adaptMatch);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const tomorrowMs = todayMs + 86_400_000;
  const nowMs = Date.now();

  return matches.filter((m) => {
    if (m.kickoffAtUtcMs == null) return false;

    return (
      m.kickoffAtUtcMs >= todayMs &&
      m.kickoffAtUtcMs < tomorrowMs &&
      m.kickoffAtUtcMs > nowMs
    );
  });
}

async function fetchFutureMatches(revalidate: number): Promise<Match[]> {
  const matches = await hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/future/2?page=1&pageSize=15`,
    tag: "upcoming",
    revalidate,
    paginated: true,
  });

  return matches.map(adaptMatch);
}

export async function fetchUpcomingMatches(
  opts: HnsCacheOptions = {},
): Promise<Match[]> {
  const revalidate = opts.revalidate ?? MATCH_TTL;

  const [today, future] = await Promise.all([
    fetchTodayMatches(revalidate),
    fetchFutureMatches(revalidate),
  ]);

  const seen = new Set<number>();
  const merged: Match[] = [];

  for (const m of [...today, ...future]) {
    if (m.id == null || seen.has(m.id)) continue;
    seen.add(m.id);
    merged.push(m);
  }

  return merged.sort(
    (a, b) => (a.kickoffAtUtcMs ?? 0) - (b.kickoffAtUtcMs ?? 0),
  );
}

export async function fetchMatchInfo(
  params: { matchId: number } & HnsCacheOptions,
): Promise<Match | null> {
  const match = await hnsResource<HnsMatch>({
    path: () => `/api/live/match/${params.matchId}`,
    tag: `match-${params.matchId}`,
    revalidate: params.revalidate ?? LIVE_MATCH_TTL,
  });

  return match ? adaptMatch(match) : null;
}

export async function fetchMatchEvents(
  params: { matchId: number } & HnsCacheOptions,
): Promise<MatchEvent[]> {
  const events = await hnsList<HnsMatchEvent>({
    path: () => `/api/live/match/${params.matchId}/events?showComments=true`,
    tag: `match-${params.matchId}-events`,
    revalidate: params.revalidate ?? LIVE_MATCH_TTL,
  });

  return events.map(adaptMatchEvent);
}

export async function fetchMatchLineups(
  params: { matchId: number } & HnsCacheOptions,
): Promise<Lineups | null> {
  const lineups = await hnsResource<HnsLineups>({
    path: () => `/api/live/match/${params.matchId}/lineups`,
    tag: `match-${params.matchId}-lineups`,
    revalidate: params.revalidate ?? MATCH_TTL,
  });

  return adaptLineups(lineups);
}

export async function fetchMatchReferees(
  params: { matchId: number } & HnsCacheOptions,
): Promise<MatchInfo | null> {
  const info = await hnsResource<HnsMatchInfo>({
    path: () => `/api/live/match/${params.matchId}/info`,
    tag: `match-${params.matchId}-referees`,
    revalidate: params.revalidate ?? MATCH_TTL,
  });

  return adaptMatchInfo(info);
}
