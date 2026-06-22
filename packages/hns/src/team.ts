import "server-only";
import { getHnsTeamId, hnsFetch } from "./client";
import { tenantSlug } from "@/lib/payload/getTenant";
import type { HnsTeamDetails } from "@/types/hns";

const TEAM_TTL = 3600;

export async function fetchTeamDetails(params: {
  teamId: string;
}): Promise<HnsTeamDetails | null> {
  if (!params.teamId) return null;
  const filterTeamId = await getHnsTeamId();
  return hnsFetch<HnsTeamDetails>(
    `/api/live/team/${params.teamId}?teamIdFilter=${filterTeamId}`,
    {
      revalidate: TEAM_TTL,
      tags: [`hns-${tenantSlug}-team-${params.teamId}`],
    },
  );
}

/** Detalji vlastitog kluba (kontakt, adresa, stadion) iz HNS-a. */
export async function fetchClubDetails(): Promise<HnsTeamDetails | null> {
  const teamId = await getHnsTeamId();
  return fetchTeamDetails({ teamId });
}
