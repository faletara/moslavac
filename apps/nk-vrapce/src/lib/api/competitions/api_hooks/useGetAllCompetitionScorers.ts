import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetAllCompetitionScorersProps = {
  competitionId: number;
  enabled?: boolean;
};

export function useGetAllCompetitionScorers({
  competitionId,
  enabled,
}: UseGetAllCompetitionScorersProps) {
  return useQuery({
    ...queries.competitions.allScorers({ competitionId }),
    enabled,
  });
}
