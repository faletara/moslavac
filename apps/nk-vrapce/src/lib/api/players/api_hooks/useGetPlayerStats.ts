import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetPlayerStatsProps = {
  personId: string;
  competitionId: number;
  enabled?: boolean;
};

export function useGetPlayerStats({
  personId,
  competitionId,
  enabled,
}: UseGetPlayerStatsProps) {
  return useQuery({
    ...queries.players.stats({ personId, competitionId }),
    enabled,
  });
}
