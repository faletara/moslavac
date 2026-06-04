import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetAllCompetitionMatchesProps = {
  competitionId: number;
  enabled?: boolean;
};

export function useGetAllCompetitionMatches({
  competitionId,
  enabled,
}: UseGetAllCompetitionMatchesProps) {
  return useQuery({
    ...queries.competitions.allMatches({ competitionId }),
    enabled,
  });
}
