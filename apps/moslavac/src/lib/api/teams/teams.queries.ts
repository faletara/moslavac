import { createQueryKeys } from "@lukemorales/query-key-factory";
import { apiFetch } from "../client";
import type { HnsTeamDetails } from "@/types/hns";

export async function fetchTeamDetails(params: {
  teamId: string;
}): Promise<HnsTeamDetails | null> {
  return apiFetch.get<HnsTeamDetails | null>(`/api/teams/${params.teamId}`);
}

export const teamsQueries = createQueryKeys("teams", {
  detail: ({ teamId }: { teamId: string }) => ({
    queryKey: [teamId],
    queryFn: () => fetchTeamDetails({ teamId }),
  }),
});
