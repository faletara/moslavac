import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetMatchRefereesProps = {
  matchId: number;
  enabled?: boolean;
};

export function useGetMatchReferees({
  matchId,
  enabled,
}: UseGetMatchRefereesProps) {
  return useQuery({
    ...queries.matches.referees({ matchId }),
    enabled,
  });
}
