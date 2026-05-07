import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetCompetitionInfoProps = {
  competitionId: number;
  enabled?: boolean;
};

export function useGetCompetitionInfo({
  competitionId,
  enabled,
}: UseGetCompetitionInfoProps) {
  return useQuery({
    ...queries.competitions.detail({ competitionId }),
    enabled,
  });
}
