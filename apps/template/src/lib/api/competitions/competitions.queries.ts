import { createQueryKeys } from "@lukemorales/query-key-factory";
import { apiFetch } from "../client";
import type {
  HnsMatch,
  HnsCompetition,
  TeamRanking,
  PlayerStats,
} from "@/types/hns";

export async function fetchCurrentSeasonCompetitions(): Promise<
  HnsCompetition[]
> {
  return apiFetch.get<HnsCompetition[]>(
    "/api/competitions/current-season",
  );
}

export async function fetchSeniorCompetition(): Promise<HnsCompetition | null> {
  return apiFetch.get<HnsCompetition | null>("/api/competitions/senior");
}

export async function fetchNextMatch(): Promise<HnsMatch | null> {
  return apiFetch.get<HnsMatch | null>(
    "/api/competitions/senior/next-match",
  );
}

export async function fetchPreviousMatch(): Promise<HnsMatch | null> {
  return apiFetch.get<HnsMatch | null>(
    "/api/competitions/senior/previous-match",
  );
}

export async function fetchCompetitionInfo(params: {
  competitionId: number;
}): Promise<HnsCompetition> {
  return apiFetch.get<HnsCompetition>(
    `/api/competitions/${params.competitionId}`,
  );
}

export async function fetchCompetitionMatches(params: {
  competitionId: number;
}): Promise<HnsMatch[]> {
  return apiFetch.get<HnsMatch[]>(
    `/api/competitions/${params.competitionId}/matches`,
  );
}

export async function fetchAllCompetitionMatches(params: {
  competitionId: number;
}): Promise<HnsMatch[]> {
  return apiFetch.get<HnsMatch[]>(
    `/api/competitions/${params.competitionId}/all-matches`,
  );
}

export async function fetchTeamStandings(params: {
  competitionId: number;
}): Promise<TeamRanking[]> {
  return apiFetch.get<TeamRanking[]>(
    `/api/competitions/${params.competitionId}/standings`,
  );
}

export async function fetchTeamStandingsUnofficial(params: {
  competitionId: number;
}): Promise<TeamRanking[]> {
  return apiFetch.get<TeamRanking[]>(
    `/api/competitions/${params.competitionId}/standings/unofficial`,
  );
}

export async function fetchCompetitionGoalStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return apiFetch.get<PlayerStats[]>(
    `/api/competitions/${params.competitionId}/stats/goals`,
  );
}

export async function fetchAllCompetitionScorers(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return apiFetch.get<PlayerStats[]>(
    `/api/competitions/${params.competitionId}/stats/goals/all`,
  );
}

export async function fetchCompetitionRedCardStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return apiFetch.get<PlayerStats[]>(
    `/api/competitions/${params.competitionId}/stats/redCards`,
  );
}

export async function fetchCompetitionYellowCardStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return apiFetch.get<PlayerStats[]>(
    `/api/competitions/${params.competitionId}/stats/yellowCards`,
  );
}

export async function fetchAllCompetitionYellowCards(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return apiFetch.get<PlayerStats[]>(
    `/api/competitions/${params.competitionId}/stats/yellowCards/all`,
  );
}

export async function fetchAllCompetitionRedCards(params: {
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
  nextMatch: () => ({
    queryKey: ["nextMatch"],
    queryFn: fetchNextMatch,
  }),
  previousMatch: () => ({
    queryKey: ["previousMatch"],
    queryFn: fetchPreviousMatch,
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
