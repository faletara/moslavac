import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetTeamStandingsProps = {
  competitionId: number;
  enabled?: boolean;
};

export function useGetTeamStandings({
  competitionId,
  enabled,
}: UseGetTeamStandingsProps) {
  return useQuery({
    ...queries.competitions.standings({ competitionId }),
    enabled,
  });
}
