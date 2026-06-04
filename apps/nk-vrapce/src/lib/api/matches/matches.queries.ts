import { createQueryKeys } from "@lukemorales/query-key-factory";
import { apiFetch } from "../client";
import type {
  HnsMatch,
  HnsMatchEvent,
  HnsLineups,
  HnsMatchInfo,
} from "@/types/hns";

export async function fetchAllMatches(): Promise<HnsMatch[]> {
  return apiFetch.get<HnsMatch[]>("/api/matches");
}

export async function fetchUpcomingMatches(): Promise<HnsMatch[]> {
  return apiFetch.get<HnsMatch[]>("/api/matches/upcoming");
}

export async function fetchMatchInfo(params: {
  matchId: number;
}): Promise<HnsMatch> {
  return apiFetch.get<HnsMatch>(`/api/matches/${params.matchId}`);
}

export async function fetchMatchEvents(params: {
  matchId: number;
}): Promise<HnsMatchEvent[]> {
  return apiFetch.get<HnsMatchEvent[]>(
    `/api/matches/${params.matchId}/events`,
  );
}

export async function fetchMatchLineups(params: {
  matchId: number;
}): Promise<HnsLineups> {
  return apiFetch.get<HnsLineups>(
    `/api/matches/${params.matchId}/lineups`,
  );
}

export async function fetchMatchReferees(params: {
  matchId: number;
}): Promise<HnsMatchInfo> {
  return apiFetch.get<HnsMatchInfo>(
    `/api/matches/${params.matchId}/referees`,
  );
}

export const matchesQueries = createQueryKeys("matches", {
  all: () => ({
    queryKey: ["all"],
    queryFn: fetchAllMatches,
  }),
  upcoming: () => ({
    queryKey: ["upcoming"],
    queryFn: fetchUpcomingMatches,
  }),
  detail: ({ matchId }: { matchId: number }) => ({
    queryKey: [matchId],
    queryFn: () => fetchMatchInfo({ matchId }),
  }),
  events: ({ matchId }: { matchId: number }) => ({
    queryKey: ["events", matchId],
    queryFn: () => fetchMatchEvents({ matchId }),
  }),
  lineups: ({ matchId }: { matchId: number }) => ({
    queryKey: ["lineups", matchId],
    queryFn: () => fetchMatchLineups({ matchId }),
  }),
  referees: ({ matchId }: { matchId: number }) => ({
    queryKey: ["referees", matchId],
    queryFn: () => fetchMatchReferees({ matchId }),
  }),
});
