import "server-only";
import type {
  HnsPaginatedResultsTeamPlayer,
  HnsPlayerCompetitionStats,
  HnsTeamPlayer,
  Player,
  PlayerCompetitionStats,
  PlayerSearchResult,
} from "@/types/hns";
import {
  adaptPlayer,
  adaptPlayerCompetitionStats,
  adaptPlayerSearchResult,
} from "./adapters";
import { hnsList, hnsResource } from "./fetchResource";

const PLAYER_TTL = 3600;

export async function fetchPlayerDetails(params: {
  personId: string;
}): Promise<Player | null> {
  if (!params.personId) return null;
  const player = await hnsResource<HnsTeamPlayer>({
    path: () => `/api/live/player/${params.personId}`,
    tag: `player-${params.personId}`,
    revalidate: PLAYER_TTL,
  });
  return adaptPlayer(player);
}

export async function fetchPlayerStats(params: {
  personId: string;
  competitionId: number;
}): Promise<PlayerCompetitionStats | null> {
  if (!params.personId || params.competitionId == null) return null;
  const stats = await hnsList<HnsPlayerCompetitionStats>({
    path: (teamId) => `/api/live/player/${params.personId}/stats/${teamId}`,
    tag: `player-${params.personId}-stats-${params.competitionId}`,
    revalidate: PLAYER_TTL,
  });
  const stat =
    stats.find(
      (s) =>
        s.competition != null &&
        String(s.competition.id) === String(params.competitionId),
    ) ?? null;
  return stat ? adaptPlayerCompetitionStats(stat) : null;
}

export async function searchPlayers(params: {
  keyword: string;
}): Promise<PlayerSearchResult[]> {
  const keyword = params.keyword.trim();
  if (!keyword) return [];

  const result = await hnsResource<HnsPaginatedResultsTeamPlayer>({
    path: () =>
      `/api/live/player/search?keyword=${encodeURIComponent(keyword)}&page=0&pageSize=100`,
    revalidate: PLAYER_TTL,
  });

  return (
    result?.result
      ?.map((player) => adaptPlayerSearchResult(player))
      .filter((player): player is PlayerSearchResult => player !== null) ?? []
  );
}
