import "server-only";
import { hnsList, hnsResource } from "./fetchResource";
import type {
  TeamPlayer,
  PaginatedResultsTeamPlayer,
  PlayerCompetitionStats,
} from "@/types/hns";

const PLAYER_TTL = 3600;

export function fetchPlayerDetails(params: {
  personId: string;
}): Promise<TeamPlayer | null> {
  if (!params.personId) return Promise.resolve(null);
  return hnsResource<TeamPlayer>({
    path: () => `/api/live/player/${params.personId}`,
    tag: `player-${params.personId}`,
    revalidate: PLAYER_TTL,
  });
}

export async function fetchPlayerStats(params: {
  personId: string;
  competitionId: number;
}): Promise<PlayerCompetitionStats | null> {
  if (!params.personId || params.competitionId == null) return null;
  const stats = await hnsList<PlayerCompetitionStats>({
    path: (teamId) => `/api/live/player/${params.personId}/stats/${teamId}`,
    tag: `player-${params.personId}-stats-${params.competitionId}`,
    revalidate: PLAYER_TTL,
  });
  return (
    stats.find(
      (s) =>
        s.competition != null &&
        String(s.competition.id) === String(params.competitionId),
    ) ?? null
  );
}

export async function searchPlayers(params: {
  keyword: string;
}): Promise<PaginatedResultsTeamPlayer> {
  if (!params.keyword.trim()) {
    return { result: [], size: 0 };
  }
  const result = await hnsResource<PaginatedResultsTeamPlayer>({
    path: () =>
      `/api/live/player/search?keyword=${encodeURIComponent(params.keyword)}&page=0&pageSize=100`,
    revalidate: PLAYER_TTL,
  });
  return result ?? { result: [], size: 0 };
}
