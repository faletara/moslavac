import "server-only";
import type {
  HnsLineups,
  HnsMatch,
  HnsMatchEvent,
  HnsMatchInfo,
  Lineups,
  LiveMatch,
  Match,
  MatchEvent,
  MatchInfo,
} from "@/types/hns";
import { adaptLineups, adaptMatch, adaptMatchEvent, adaptMatchInfo } from "./adapters";
import {
  hnsList,
  hnsListResult,
  hnsResource,
  hnsResourceResult,
} from "./fetchResource";

const MATCH_TTL = 60;

const LIVE_MATCH_TTL = 30;

async function fetchPastTeamMatches(): Promise<Match[]> {
  const matches = await hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/past/2?page=1&pageSize=75`,
    tag: "team-matches",
    revalidate: MATCH_TTL,
    paginated: true,
  });

  return matches.map(adaptMatch);
}

async function fetchFutureTeamMatches(): Promise<Match[]> {
  const matches = await hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/future/2?page=1&pageSize=75`,
    tag: "team-matches",
    revalidate: MATCH_TTL,
    paginated: true,
  });

  return matches.map(adaptMatch);
}

export async function fetchAllMatches(): Promise<Match[]> {
  const [past, future] = await Promise.all([
    fetchPastTeamMatches(),
    fetchFutureTeamMatches(),
  ]);

  return [...past, ...future];
}

async function fetchTodayMatches(): Promise<Match[]> {
  const matches = (
    await hnsList<HnsMatch>({
      path: (teamId) =>
        `/api/live/team/${teamId}/matches/paginated/past/2?page=1&pageSize=10`,
      tag: "today",
      revalidate: MATCH_TTL,
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

async function fetchFutureMatches(): Promise<Match[]> {
  const matches = await hnsList<HnsMatch>({
    path: (teamId) =>
      `/api/live/team/${teamId}/matches/paginated/future/2?page=1&pageSize=15`,
    tag: "upcoming",
    revalidate: MATCH_TTL,
    paginated: true,
  });

  return matches.map(adaptMatch);
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

  return merged.sort(
    (a, b) => (a.kickoffAtUtcMs ?? 0) - (b.kickoffAtUtcMs ?? 0),
  );
}

export async function fetchMatchInfo(params: {
  matchId: number;
}): Promise<Match | null> {
  const match = await hnsResource<HnsMatch>({
    path: () => `/api/live/match/${params.matchId}`,
    tag: `match-${params.matchId}`,
    revalidate: LIVE_MATCH_TTL,
  });

  return match ? adaptMatch(match) : null;
}

export async function fetchMatchEvents(params: {
  matchId: number;
}): Promise<MatchEvent[]> {
  const events = await hnsList<HnsMatchEvent>({
    path: () => `/api/live/match/${params.matchId}/events?showComments=true`,
    tag: `match-${params.matchId}-events`,
    revalidate: LIVE_MATCH_TTL,
  });

  return events.map(adaptMatchEvent);
}

export async function fetchMatchLineups(params: {
  matchId: number;
}): Promise<Lineups | null> {
  const lineups = await hnsResource<HnsLineups>({
    path: () => `/api/live/match/${params.matchId}/lineups`,
    tag: `match-${params.matchId}-lineups`,
    revalidate: MATCH_TTL,
  });

  return adaptLineups(lineups);
}

export async function fetchMatchReferees(params: {
  matchId: number;
}): Promise<MatchInfo | null> {
  const info = await hnsResource<HnsMatchInfo>({
    path: () => `/api/live/match/${params.matchId}/info`,
    tag: `match-${params.matchId}-referees`,
    revalidate: MATCH_TTL,
  });

  return adaptMatchInfo(info);
}

/** HNS nije odgovorio ili je vratio grešku — različito od "utakmica ne postoji". */
export class HnsUnavailableError extends Error {
  constructor(matchId: number) {
    super(`HNS nedostupan za utakmicu ${matchId}`);
    this.name = "HnsUnavailableError";
  }
}

/**
 * Trenutno stanje utakmice za rutu uživo: utakmica, događaji i postave, svi s
 * rokom keša od 30 s. `null` znači da utakmica ne postoji. Ako zakaže bilo koji
 * od tri poziva, baca `HnsUnavailableError` umjesto da vrati djelomično stanje —
 * prazni događaji ili postave pregazili bi u pregledniku zadnje ispravno stanje.
 */
export async function fetchLiveMatch(params: {
  matchId: number;
}): Promise<LiveMatch | null> {
  const { matchId } = params;

  const [match, events, lineups] = await Promise.all([
    hnsResourceResult<HnsMatch>({
      path: () => `/api/live/match/${matchId}`,
      tag: `match-${matchId}`,
      revalidate: LIVE_MATCH_TTL,
    }),
    hnsListResult<HnsMatchEvent>({
      path: () => `/api/live/match/${matchId}/events?showComments=true`,
      tag: `match-${matchId}-events`,
      revalidate: LIVE_MATCH_TTL,
    }),
    hnsResourceResult<HnsLineups>({
      path: () => `/api/live/match/${matchId}/lineups`,
      tag: `match-${matchId}-lineups`,
      revalidate: LIVE_MATCH_TTL,
    }),
  ]);

  // Na nepoznatu utakmicu HNS vraća 404 za utakmicu, ali 400 za događaje i
  // postave — zato se "ne postoji" provjerava prije grešaka ostala dva poziva.
  if (match.ok && !match.data) return null;

  if (!match.ok || !events.ok || !lineups.ok || !match.data) {
    throw new HnsUnavailableError(matchId);
  }

  const adapted = adaptMatch(match.data);

  return {
    matchId,
    score: adapted.score,
    liveStatus: adapted.liveStatus,
    minute: adapted.minute,
    currentMinute: adapted.currentMinute,
    events: events.data.map(adaptMatchEvent),
    lineups: adaptLineups(lineups.data),
  };
}
