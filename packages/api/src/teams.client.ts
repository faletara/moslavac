import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { HnsTeamDetails } from "@/types/hns";

// HTTP fetchers — browser → route handler. Server components call lib/ directly.
async function fetchTeamDetails(params: {
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

export function useGetTeamDetails({
  teamId,
  enabled,
}: {
  teamId: string;
  enabled?: boolean;
}) {
  return useQuery({ ...teamsQueries.detail({ teamId }), enabled });
}

export const teamsApi = {
  useGetTeamDetails,
};
