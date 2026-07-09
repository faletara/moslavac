import "server-only";
import type {
  CompetitionPlayerStat,
  HnsPlayerStats,
  HnsTeamRanking,
  TeamRanking,
} from "@/types/hns";
import { adaptCompetitionPlayerStat, adaptTeamRanking } from "./adapters";
import { getHnsTeamId } from "./client";
import { hnsList } from "./fetchResource";

const STANDINGS_TTL = 180;

export async function fetchTeamStandings(params: {
  competitionId: number;
}): Promise<TeamRanking[]> {
  const teamId = Number(await getHnsTeamId());
  const rows = await hnsList<HnsTeamRanking>({
    path: () =>
      `/api/live/competition/${params.competitionId}/standings/official`,
    tag: `standings-${params.competitionId}`,
    revalidate: STANDINGS_TTL,
  });
  return rows.map((row) => adaptTeamRanking(row, teamId));
}

export async function fetchTeamStandingsUnofficial(params: {
  competitionId: number;
}): Promise<TeamRanking[]> {
  const teamId = Number(await getHnsTeamId());
  const rows = await hnsList<HnsTeamRanking>({
    path: () =>
      `/api/live/competition/${params.competitionId}/standings/unofficial`,
    tag: `standings-unofficial-${params.competitionId}`,
    revalidate: STANDINGS_TTL,
  });
  return rows.map((row) => adaptTeamRanking(row, teamId));
}

export async function fetchCompetitionGoalStats(params: {
  competitionId: number;
}): Promise<CompetitionPlayerStat[]> {
  const stats = await hnsList<HnsPlayerStats>({
    path: (teamId) =>
      `/api/live/competition/${params.competitionId}/stats/goals/${teamId}`,
    tag: `stats-goals-${params.competitionId}`,
    revalidate: STANDINGS_TTL,
  });
  return stats.map(adaptCompetitionPlayerStat);
}

// HNS doesn't expose a competition-wide scorers endpoint; the path teamId
// scopes the response to that team. Fan out across all teams in the standings,
// then merge & sort.
export async function fetchAllCompetitionScorers(params: {
  competitionId: number;
}): Promise<CompetitionPlayerStat[]> {
  return fanOutCompetitionStats(params.competitionId, "goals");
}

export async function fetchCompetitionRedCardStats(params: {
  competitionId: number;
}): Promise<CompetitionPlayerStat[]> {
  const stats = await hnsList<HnsPlayerStats>({
    path: (teamId) =>
      `/api/live/competition/${params.competitionId}/stats/redCards/${teamId}`,
    tag: `stats-red-${params.competitionId}`,
    revalidate: STANDINGS_TTL,
  });
  return stats.map(adaptCompetitionPlayerStat);
}

export async function fetchCompetitionYellowCardStats(params: {
  competitionId: number;
}): Promise<CompetitionPlayerStat[]> {
  const stats = await hnsList<HnsPlayerStats>({
    path: (teamId) =>
      `/api/live/competition/${params.competitionId}/stats/yellowCards/${teamId}`,
    tag: `stats-yellow-${params.competitionId}`,
    revalidate: STANDINGS_TTL,
  });
  return stats.map(adaptCompetitionPlayerStat);
}

// Same fan-out pattern as fetchAllCompetitionScorers: HNS scopes stats to the
// team in the URL path, so aggregate across all teams in standings.
async function fanOutCompetitionStats(
  competitionId: number,
  statKind: "goals" | "yellowCards" | "redCards",
): Promise<CompetitionPlayerStat[]> {
  const standings = await fetchTeamStandings({ competitionId });
  const teamIds = standings
    .map((row) => row.team?.id)
    .filter((id): id is number => id != null);

  const perTeam = await Promise.all(
    teamIds.map((id) =>
      hnsList<HnsPlayerStats>({
        path: () =>
          `/api/live/competition/${competitionId}/stats/${statKind}/${id}`,
        tag: `stats-${statKind}-${competitionId}-team-${id}`,
        revalidate: STANDINGS_TTL,
      }),
    ),
  );

  return perTeam
    .flat()
    .map(adaptCompetitionPlayerStat)
    .sort((a, b) => b.value - a.value);
}

export async function fetchAllCompetitionYellowCards(params: {
  competitionId: number;
}): Promise<CompetitionPlayerStat[]> {
  return fanOutCompetitionStats(params.competitionId, "yellowCards");
}

export async function fetchAllCompetitionRedCards(params: {
  competitionId: number;
}): Promise<CompetitionPlayerStat[]> {
  return fanOutCompetitionStats(params.competitionId, "redCards");
}
