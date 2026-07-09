import "server-only";
import { getHnsTeamId } from "./client";
import { hnsList } from "./fetchResource";
import type { PlayerStats, TeamRanking } from "@/types/hns";

const STANDINGS_TTL = 180;

export async function fetchTeamStandings(params: {
  competitionId: number;
}): Promise<TeamRanking[]> {
  const teamId = await getHnsTeamId();
  const rows = await hnsList<TeamRanking>({
    path: () =>
      `/api/live/competition/${params.competitionId}/standings/official`,
    tag: `standings-${params.competitionId}`,
    revalidate: STANDINGS_TTL,
  });
  return markOwnTeam(rows, teamId);
}

// HNS ne popunjava `highlight` — označavamo redak našeg kluba usporedbom s teamId.
function markOwnTeam(rows: TeamRanking[], teamId: string): TeamRanking[] {
  const ownId = Number(teamId);
  return rows.map((row) => ({
    ...row,
    highlight: row.team?.id === ownId,
  }));
}

export async function fetchTeamStandingsUnofficial(params: {
  competitionId: number;
}): Promise<TeamRanking[]> {
  const teamId = await getHnsTeamId();
  const rows = await hnsList<TeamRanking>({
    path: () =>
      `/api/live/competition/${params.competitionId}/standings/unofficial`,
    tag: `standings-unofficial-${params.competitionId}`,
    revalidate: STANDINGS_TTL,
  });
  return markOwnTeam(rows, teamId);
}

export function fetchCompetitionGoalStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return hnsList<PlayerStats>({
    path: (teamId) =>
      `/api/live/competition/${params.competitionId}/stats/goals/${teamId}`,
    tag: `stats-goals-${params.competitionId}`,
    revalidate: STANDINGS_TTL,
  });
}

// HNS doesn't expose a competition-wide scorers endpoint; the path teamId
// scopes the response to that team. Fan out across all teams in the standings,
// then merge & sort.
export async function fetchAllCompetitionScorers(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return fanOutCompetitionStats(params.competitionId, "goals");
}

export function fetchCompetitionRedCardStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return hnsList<PlayerStats>({
    path: (teamId) =>
      `/api/live/competition/${params.competitionId}/stats/redCards/${teamId}`,
    tag: `stats-red-${params.competitionId}`,
    revalidate: STANDINGS_TTL,
  });
}

export function fetchCompetitionYellowCardStats(params: {
  competitionId: number;
}): Promise<PlayerStats[]> {
  return hnsList<PlayerStats>({
    path: (teamId) =>
      `/api/live/competition/${params.competitionId}/stats/yellowCards/${teamId}`,
    tag: `stats-yellow-${params.competitionId}`,
    revalidate: STANDINGS_TTL,
  });
}

// Same fan-out pattern as fetchAllCompetitionScorers — HNS scopes stats to
// the team in the URL path; aggregate across all teams in standings.
async function fanOutCompetitionStats(
  competitionId: number,
  statKind: "goals" | "yellowCards" | "redCards",
): Promise<PlayerStats[]> {
  const standings = await fetchTeamStandings({ competitionId });
  const teamIds = standings
    .map((row) => row.team?.id)
    .filter((id): id is number => id != null);

  const perTeam = await Promise.all(
    teamIds.map((id) =>
      hnsList<PlayerStats>({
        path: () =>
          `/api/live/competition/${competitionId}/stats/${statKind}/${id}`,
        tag: `stats-${statKind}-${competitionId}-team-${id}`,
        revalidate: STANDINGS_TTL,
      }),
    ),
  );

  return perTeam
    .flat()
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
