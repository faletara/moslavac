import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type {
  HnsMatch,
  HnsCompetition,
  MatchSlots,
  TeamRanking,
  PlayerStats,
} from "@/types/hns";

// HTTP fetchers — browser → route handler. Server components call lib/ directly.
async function fetchCurrentSeasonCompetitions(): Promise<HnsCompetition[]> {
  return apiFetch.get<HnsCompetition[]>("/api/competitions/current-season");
}

async function fetchSeniorCompetition(): Promise<HnsCompetition | null> {
  return apiFetch.get<HnsCompetition | null>("/api/competitions/senior");
}

async function fetchMatchSlots(): Promise<MatchSlots> {
  return apiFetch.get<MatchSlots>("/api/competitions/senior/match-slots");
}

async function fetchCompetitionInfo(params: {
  competitionId: number;
}): Promise<HnsCompetition> {
  return apiFetch.get<HnsCompetition>(
    `/api/competitions/${params.competitionId}`,
  );
}

async function fetchCompetitionMatches(params: {
  competitionId: number;
}): Promise<HnsMatch[]> {
  return apiFetch.get<HnsMatch[]>(
    `/api/competitions/${params.competitionId}/matches`,
  );
}

async function fetchAllCompetitionMatches(params: {
  competitionId: number;
}): Promise<HnsMatch[]> {
  return apiFetch.get<HnsMatch[]>(
    `/api/competitions/${params.competitionId}/all-matches`,
  );
}

async function fetchTeamStandings(params: {
  competitionId: number;
}): Promise<TeamRanking[]> {
  return apiFetch.get<TeamRanking[]>(
    `/api/competitions/${params.competitionId}/standings`,
  );
}

async function fetchTeamStandingsUnofficial(params: {
  competitionId: number;
}): Promise<TeamRanking[]> {
  return apiFetch.get<TeamRanking[]>(
    `/api/competitions/${params.competitionId}/standings/unofficial`,
  );
}

async function fetchCompetitionGoalStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return apiFetch.get<PlayerStats[]>(
    `/api/competitions/${params.competitionId}/stats/goals`,
  );
}

async function fetchAllCompetitionScorers(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return apiFetch.get<PlayerStats[]>(
    `/api/competitions/${params.competitionId}/stats/goals/all`,
  );
}

async function fetchCompetitionRedCardStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return apiFetch.get<PlayerStats[]>(
    `/api/competitions/${params.competitionId}/stats/redCards`,
  );
}

async function fetchCompetitionYellowCardStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return apiFetch.get<PlayerStats[]>(
    `/api/competitions/${params.competitionId}/stats/yellowCards`,
  );
}

async function fetchAllCompetitionYellowCards(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return apiFetch.get<PlayerStats[]>(
    `/api/competitions/${params.competitionId}/stats/yellowCards/all`,
  );
}

async function fetchAllCompetitionRedCards(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return apiFetch.get<PlayerStats[]>(
    `/api/competitions/${params.competitionId}/stats/redCards/all`,
  );
}

export const competitionsQueries = createQueryKeys("competitions", {
  currentSeason: () => ({
    queryKey: ["currentSeason"],
    queryFn: fetchCurrentSeasonCompetitions,
  }),
  senior: () => ({
    queryKey: ["senior"],
    queryFn: fetchSeniorCompetition,
  }),
  matchSlots: () => ({
    queryKey: ["matchSlots"],
    queryFn: fetchMatchSlots,
  }),
  detail: ({ competitionId }: { competitionId: number }) => ({
    queryKey: [competitionId],
    queryFn: () => fetchCompetitionInfo({ competitionId }),
  }),
  matches: ({ competitionId }: { competitionId: number }) => ({
    queryKey: ["matches", competitionId],
    queryFn: () => fetchCompetitionMatches({ competitionId }),
  }),
  allMatches: ({ competitionId }: { competitionId: number }) => ({
    queryKey: ["allMatches", competitionId],
    queryFn: () => fetchAllCompetitionMatches({ competitionId }),
  }),
  standings: ({ competitionId }: { competitionId: number }) => ({
    queryKey: ["standings", competitionId],
    queryFn: () => fetchTeamStandings({ competitionId }),
  }),
  standingsUnofficial: ({ competitionId }: { competitionId: number }) => ({
    queryKey: ["standingsUnofficial", competitionId],
    queryFn: () => fetchTeamStandingsUnofficial({ competitionId }),
  }),
  goalStats: ({ competitionId }: { competitionId: number }) => ({
    queryKey: ["goalStats", competitionId],
    queryFn: () => fetchCompetitionGoalStats({ competitionId }),
  }),
  allScorers: ({ competitionId }: { competitionId: number }) => ({
    queryKey: ["allScorers", competitionId],
    queryFn: () => fetchAllCompetitionScorers({ competitionId }),
  }),
  redCardStats: ({ competitionId }: { competitionId: number }) => ({
    queryKey: ["redCardStats", competitionId],
    queryFn: () => fetchCompetitionRedCardStats({ competitionId }),
  }),
  yellowCardStats: ({ competitionId }: { competitionId: number }) => ({
    queryKey: ["yellowCardStats", competitionId],
    queryFn: () => fetchCompetitionYellowCardStats({ competitionId }),
  }),
  allYellowCards: ({ competitionId }: { competitionId: number }) => ({
    queryKey: ["allYellowCards", competitionId],
    queryFn: () => fetchAllCompetitionYellowCards({ competitionId }),
  }),
  allRedCards: ({ competitionId }: { competitionId: number }) => ({
    queryKey: ["allRedCards", competitionId],
    queryFn: () => fetchAllCompetitionRedCards({ competitionId }),
  }),
});

export function useGetCurrentSeasonCompetitions(props?: { enabled?: boolean }) {
  return useQuery({
    ...competitionsQueries.currentSeason(),
    enabled: props?.enabled,
  });
}

export function useGetSeniorCompetition(props?: { enabled?: boolean }) {
  return useQuery({
    ...competitionsQueries.senior(),
    enabled: props?.enabled,
  });
}

export function useGetMatchSlots(props?: { enabled?: boolean }) {
  return useQuery({
    ...competitionsQueries.matchSlots(),
    enabled: props?.enabled,
  });
}

export function useGetCompetitionInfo({
  competitionId,
  enabled,
}: {
  competitionId: number;
  enabled?: boolean;
}) {
  return useQuery({
    ...competitionsQueries.detail({ competitionId }),
    enabled,
  });
}

export function useGetCompetitionMatches({
  competitionId,
  enabled,
}: {
  competitionId: number;
  enabled?: boolean;
}) {
  return useQuery({
    ...competitionsQueries.matches({ competitionId }),
    enabled,
  });
}

export function useGetAllCompetitionMatches({
  competitionId,
  enabled,
}: {
  competitionId: number;
  enabled?: boolean;
}) {
  return useQuery({
    ...competitionsQueries.allMatches({ competitionId }),
    enabled,
  });
}

export function useGetTeamStandings({
  competitionId,
  enabled,
}: {
  competitionId: number;
  enabled?: boolean;
}) {
  return useQuery({
    ...competitionsQueries.standings({ competitionId }),
    enabled,
  });
}

export function useGetCompetitionGoalStats({
  competitionId,
  enabled,
}: {
  competitionId: number;
  enabled?: boolean;
}) {
  return useQuery({
    ...competitionsQueries.goalStats({ competitionId }),
    enabled,
  });
}

export function useGetAllCompetitionScorers({
  competitionId,
  enabled,
}: {
  competitionId: number;
  enabled?: boolean;
}) {
  return useQuery({
    ...competitionsQueries.allScorers({ competitionId }),
    enabled,
  });
}

export function useGetAllCompetitionYellowCards({
  competitionId,
  enabled,
}: {
  competitionId: number;
  enabled?: boolean;
}) {
  return useQuery({
    ...competitionsQueries.allYellowCards({ competitionId }),
    enabled,
  });
}

export function useGetAllCompetitionRedCards({
  competitionId,
  enabled,
}: {
  competitionId: number;
  enabled?: boolean;
}) {
  return useQuery({
    ...competitionsQueries.allRedCards({ competitionId }),
    enabled,
  });
}

export const competitionsApi = {
  useGetAllCompetitionMatches,
  useGetAllCompetitionRedCards,
  useGetAllCompetitionScorers,
  useGetAllCompetitionYellowCards,
  useGetCompetitionGoalStats,
  useGetCompetitionInfo,
  useGetCompetitionMatches,
  useGetCurrentSeasonCompetitions,
  useGetMatchSlots,
  useGetSeniorCompetition,
  useGetTeamStandings,
};
