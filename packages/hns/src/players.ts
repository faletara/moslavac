import "server-only";
import { getHnsTeamId, hnsFetch } from "./client";
import { tenantSlug } from "@/lib/payload/getTenant";
import type {
  HnsTeamPlayer,
  PaginatedResult,
  PlayerCompetitionStats,
} from "@/types/hns";

const PLAYER_TTL = 3600;

export async function fetchPlayerDetails(params: {
  personId: string;
}): Promise<HnsTeamPlayer | null> {
  if (!params.personId) return null;
  const teamId = await getHnsTeamId();
  return hnsFetch<HnsTeamPlayer>(
    `/api/live/player/${params.personId}?teamIdFilter=${teamId}`,
    {
      revalidate: PLAYER_TTL,
      tags: [`hns-${tenantSlug}-player-${params.personId}`],
    },
  );
}

export async function fetchPlayerStats(params: {
  personId: string;
  competitionId: number;
}): Promise<PlayerCompetitionStats | null> {
  if (!params.personId || params.competitionId == null) return null;
  const teamId = await getHnsTeamId();
  const stats = await hnsFetch<PlayerCompetitionStats[]>(
    `/api/live/player/${params.personId}/stats/${teamId}?teamIdFilter=${teamId}`,
    {
      revalidate: PLAYER_TTL,
      tags: [
        `hns-${tenantSlug}-player-${params.personId}-stats-${params.competitionId}`,
      ],
    },
  );
  if (!stats) return null;
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
}): Promise<PaginatedResult<HnsTeamPlayer>> {
  if (!params.keyword.trim()) {
    return { result: [], size: 0 };
  }
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PaginatedResult<HnsTeamPlayer>>(
    `/api/live/player/search?keyword=${encodeURIComponent(params.keyword)}&page=0&pageSize=100&teamIdFilter=${teamId}`,
    { revalidate: PLAYER_TTL },
  );
  return result ?? { result: [], size: 0 };
}
