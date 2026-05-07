import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetCompetitionGoalStatsProps = {
  competitionId: number;
  enabled?: boolean;
};

export function useGetCompetitionGoalStats({
  competitionId,
  enabled,
}: UseGetCompetitionGoalStatsProps) {
  return useQuery({
    ...queries.competitions.goalStats({ competitionId }),
    enabled,
  });
}
