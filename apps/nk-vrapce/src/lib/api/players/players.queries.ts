import { createQueryKeys } from "@lukemorales/query-key-factory";
import { apiFetch } from "../client";
import type { Player } from "@/types/player";
import type { HnsTeamPlayer, PlayerCompetitionStats } from "@/types/hns";

export async function fetchPlayers(): Promise<Player[]> {
  return apiFetch.get<Player[]>("/api/players");
}

export async function fetchPlayerDetails(params: {
  personId: string;
}): Promise<HnsTeamPlayer> {
  return apiFetch.get<HnsTeamPlayer>(
    `/api/players/details/${params.personId}`,
  );
}

export async function fetchPlayerStats(params: {
  personId: string;
  competitionId: number;
}): Promise<PlayerCompetitionStats | null> {
  return apiFetch.get<PlayerCompetitionStats | null>(
    `/api/players/${params.personId}/stats/${params.competitionId}`,
  );
}

export const playersQueries = createQueryKeys("players", {
  all: () => ({
    queryKey: ["all"],
    queryFn: fetchPlayers,
  }),
  detail: ({ personId }: { personId: string }) => ({
    queryKey: [personId],
    queryFn: () => fetchPlayerDetails({ personId }),
  }),
  stats: ({
    personId,
    competitionId,
  }: {
    personId: string;
    competitionId: number;
  }) => ({
    queryKey: [personId, competitionId],
    queryFn: () => fetchPlayerStats({ personId, competitionId }),
  }),
});
