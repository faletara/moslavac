import "server-only";
import { getHnsTeamId } from "./client";
import { hnsResource } from "./fetchResource";
import type { Team } from "@/types/hns";

const TEAM_TTL = 3600;

export function fetchTeamDetails(params: {
  teamId: string;
}): Promise<Team | null> {
  if (!params.teamId) return Promise.resolve(null);
  // Path targets the requested team; the auto-appended teamIdFilter is our own
  // team id (from getHnsTeamId), matching the previous behaviour.
  return hnsResource<Team>({
    path: () => `/api/live/team/${params.teamId}`,
    tag: `team-${params.teamId}`,
    revalidate: TEAM_TTL,
  });
}

/** Detalji vlastitog kluba (kontakt, adresa, stadion) iz HNS-a. */
export async function fetchClubDetails(): Promise<Team | null> {
  const teamId = await getHnsTeamId();
  return fetchTeamDetails({ teamId });
}
