import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Player } from "@/types/player";
import type { HnsTeamPlayer, PlayerCompetitionStats } from "@/types/hns";

// HTTP fetchers — browser → route handler. Server components call lib/ directly.
async function fetchPlayers(): Promise<Player[]> {
  return apiFetch.get<Player[]>("/api/players");
}

async function fetchPlayerDetails(params: {
  personId: string;
}): Promise<HnsTeamPlayer> {
  return apiFetch.get<HnsTeamPlayer>(`/api/players/details/${params.personId}`);
}

async function fetchPlayerStats(params: {
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

export function useGetPlayers(props?: { enabled?: boolean }) {
  return useQuery({ ...playersQueries.all(), enabled: props?.enabled });
}

export function useGetPlayerDetails({
  personId,
  enabled,
}: {
  personId: string;
  enabled?: boolean;
}) {
  return useQuery({ ...playersQueries.detail({ personId }), enabled });
}

export function useGetPlayerStats({
  personId,
  competitionId,
  enabled,
}: {
  personId: string;
  competitionId: number;
  enabled?: boolean;
}) {
  return useQuery({
    ...playersQueries.stats({ personId, competitionId }),
    enabled,
  });
}

export const playersApi = {
  useGetPlayers,
  useGetPlayerDetails,
  useGetPlayerStats,
};
