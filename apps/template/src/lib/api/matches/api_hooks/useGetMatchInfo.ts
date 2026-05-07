import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetMatchInfoProps = {
  matchId: number;
  enabled?: boolean;
};

export function useGetMatchInfo({ matchId, enabled }: UseGetMatchInfoProps) {
  return useQuery({
    ...queries.matches.detail({ matchId }),
    enabled,
  });
}
