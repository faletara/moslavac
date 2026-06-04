import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetCompetitionMatchesProps = {
  competitionId: number;
  enabled?: boolean;
};

export function useGetCompetitionMatches({
  competitionId,
  enabled,
}: UseGetCompetitionMatchesProps) {
  return useQuery({
    ...queries.competitions.matches({ competitionId }),
    enabled,
  });
}
