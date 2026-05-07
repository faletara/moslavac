import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetMatchLineupsProps = {
  matchId: number;
  enabled?: boolean;
};

export function useGetMatchLineups({
  matchId,
  enabled,
}: UseGetMatchLineupsProps) {
  return useQuery({
    ...queries.matches.lineups({ matchId }),
    enabled,
  });
}
