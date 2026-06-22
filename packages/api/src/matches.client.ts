import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type {
  HnsMatch,
  HnsMatchEvent,
  HnsLineups,
  HnsMatchInfo,
} from "@/types/hns";

// HTTP fetchers — browser → route handler. Server components call lib/ directly.
async function fetchAllMatches(): Promise<HnsMatch[]> {
  return apiFetch.get<HnsMatch[]>("/api/matches");
}

async function fetchUpcomingMatches(): Promise<HnsMatch[]> {
  return apiFetch.get<HnsMatch[]>("/api/matches/upcoming");
}

async function fetchMatchInfo(params: { matchId: number }): Promise<HnsMatch> {
  return apiFetch.get<HnsMatch>(`/api/matches/${params.matchId}`);
}

async function fetchMatchEvents(params: {
  matchId: number;
}): Promise<HnsMatchEvent[]> {
  return apiFetch.get<HnsMatchEvent[]>(`/api/matches/${params.matchId}/events`);
}

async function fetchMatchLineups(params: {
  matchId: number;
}): Promise<HnsLineups> {
  return apiFetch.get<HnsLineups>(`/api/matches/${params.matchId}/lineups`);
}

async function fetchMatchReferees(params: {
  matchId: number;
}): Promise<HnsMatchInfo> {
  return apiFetch.get<HnsMatchInfo>(`/api/matches/${params.matchId}/referees`);
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

export function useGetAllMatches(props?: { enabled?: boolean }) {
  return useQuery({ ...matchesQueries.all(), enabled: props?.enabled });
}

export function useGetUpcomingMatches(props?: { enabled?: boolean }) {
  return useQuery({ ...matchesQueries.upcoming(), enabled: props?.enabled });
}

export function useGetMatchInfo({
  matchId,
  enabled,
}: {
  matchId: number;
  enabled?: boolean;
}) {
  return useQuery({ ...matchesQueries.detail({ matchId }), enabled });
}

export function useGetMatchEvents({
  matchId,
  enabled,
}: {
  matchId: number;
  enabled?: boolean;
}) {
  return useQuery({ ...matchesQueries.events({ matchId }), enabled });
}

export function useGetMatchLineups({
  matchId,
  enabled,
}: {
  matchId: number;
  enabled?: boolean;
}) {
  return useQuery({ ...matchesQueries.lineups({ matchId }), enabled });
}

export function useGetMatchReferees({
  matchId,
  enabled,
}: {
  matchId: number;
  enabled?: boolean;
}) {
  return useQuery({ ...matchesQueries.referees({ matchId }), enabled });
}

export const matchesApi = {
  useGetAllMatches,
  useGetUpcomingMatches,
  useGetMatchInfo,
  useGetMatchEvents,
  useGetMatchLineups,
  useGetMatchReferees,
};
