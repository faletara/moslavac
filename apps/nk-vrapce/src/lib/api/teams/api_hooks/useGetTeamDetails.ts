import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetTeamDetailsProps = {
  teamId: string;
  enabled?: boolean;
};

export function useGetTeamDetails({
  teamId,
  enabled,
}: UseGetTeamDetailsProps) {
  return useQuery({
    ...queries.teams.detail({ teamId }),
    enabled,
  });
}
