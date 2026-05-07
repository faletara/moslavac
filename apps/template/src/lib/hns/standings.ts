import "server-only";
import { getHnsTeamId, hnsFetch } from "./client";
import { tenantSlug } from "../payload/getTenant";
import type { PlayerStats, TeamRanking } from "@/types/hns";

const STANDINGS_TTL = 900;

export async function fetchTeamStandings(params: {
  competitionId: number;
}): Promise<TeamRanking[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<TeamRanking[]>(
    `/api/live/competition/${params.competitionId}/standings/official?teamIdFilter=${teamId}`,
    {
      revalidate: STANDINGS_TTL,
      tags: [`hns-${tenantSlug}-standings-${params.competitionId}`],
    },
  );
  return result ?? [];
}

export async function fetchTeamStandingsUnofficial(params: {
  competitionId: number;
}): Promise<TeamRanking[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<TeamRanking[]>(
    `/api/live/competition/${params.competitionId}/standings/unofficial?teamIdFilter=${teamId}`,
    {
      revalidate: STANDINGS_TTL,
      tags: [
        `hns-${tenantSlug}-standings-unofficial-${params.competitionId}`,
      ],
    },
  );
  return result ?? [];
}

export async function fetchCompetitionGoalStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PlayerStats[]>(
    `/api/live/competition/${params.competitionId}/stats/goals/${teamId}?teamIdFilter=${teamId}`,
    {
      revalidate: STANDINGS_TTL,
      tags: [
        `hns-${tenantSlug}-stats-goals-${params.competitionId}`,
      ],
    },
  );
  return result ?? [];
}

// HNS doesn't expose a competition-wide scorers endpoint; the path teamId
// scopes the response to that team. Fan out across all teams in the standings,
// then merge & sort.
export async function fetchAllCompetitionScorers(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return fanOutCompetitionStats(params.competitionId, "goals");
}

export async function fetchCompetitionRedCardStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PlayerStats[]>(
    `/api/live/competition/${params.competitionId}/stats/redCards/${teamId}?teamIdFilter=${teamId}`,
    {
      revalidate: STANDINGS_TTL,
      tags: [`hns-${tenantSlug}-stats-red-${params.competitionId}`],
    },
  );
  return result ?? [];
}

export async function fetchCompetitionYellowCardStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<PlayerStats[]>(
    `/api/live/competition/${params.competitionId}/stats/yellowCards/${teamId}?teamIdFilter=${teamId}`,
    {
      revalidate: STANDINGS_TTL,
      tags: [`hns-${tenantSlug}-stats-yellow-${params.competitionId}`],
    },
  );
  return result ?? [];
}

// Same fan-out pattern as fetchAllCompetitionScorers — HNS scopes stats to
// the team in the URL path; aggregate across all teams in standings.
async function fanOutCompetitionStats(
  competitionId: number,
  statKind: "goals" | "yellowCards" | "redCards",
): Promise<PlayerStats[]> {
  const teamId = await getHnsTeamId();
  const standings = await fetchTeamStandings({ competitionId });
  const teamIds = standings
    .map((row) => row.team?.id)
    .filter((id): id is number => id != null);

  const perTeam = await Promise.all(
    teamIds.map((id) =>
      hnsFetch<PlayerStats[]>(
        `/api/live/competition/${competitionId}/stats/${statKind}/${id}?teamIdFilter=${teamId}`,
        {
          revalidate: STANDINGS_TTL,
          tags: [
            `hns-${tenantSlug}-stats-${statKind}-${competitionId}-team-${id}`,
          ],
        },
      ),
    ),
  );

  return perTeam
    .flatMap((list) => list ?? [])
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
}

export async function fetchAllCompetitionYellowCards(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return fanOutCompetitionStats(params.competitionId, "yellowCards");
}

export async function fetchAllCompetitionRedCards(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return fanOutCompetitionStats(params.competitionId, "redCards");
}
