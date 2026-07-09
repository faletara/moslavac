import "server-only";
import type { HnsTeam, Team } from "@/types/hns";
import { adaptTeam } from "./adapters";
import { getHnsTeamId } from "./client";
import { hnsResource } from "./fetchResource";

const TEAM_TTL = 3600;

export async function fetchTeamDetails(params: {
  teamId: string;
}): Promise<Team | null> {
  if (!params.teamId) return null;
  // Path targets the requested team; the auto-appended teamIdFilter is our own
  // team id (from getHnsTeamId), matching the previous behaviour.
  const team = await hnsResource<HnsTeam>({
    path: () => `/api/live/team/${params.teamId}`,
    tag: `team-${params.teamId}`,
    revalidate: TEAM_TTL,
  });
  return adaptTeam(team);
}

/** Detalji vlastitog kluba (kontakt, adresa, stadion) iz HNS-a. */
export async function fetchClubDetails(): Promise<Team | null> {
  const teamId = await getHnsTeamId();
  return fetchTeamDetails({ teamId });
}
