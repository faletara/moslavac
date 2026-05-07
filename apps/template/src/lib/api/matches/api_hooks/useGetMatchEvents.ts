import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetMatchEventsProps = {
  matchId: number;
  enabled?: boolean;
};

export function useGetMatchEvents({
  matchId,
  enabled,
}: UseGetMatchEventsProps) {
  return useQuery({
    ...queries.matches.events({ matchId }),
    enabled,
  });
}
