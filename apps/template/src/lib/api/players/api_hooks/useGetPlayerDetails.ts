import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetPlayerDetailsProps = {
  personId: string;
  enabled?: boolean;
};

export function useGetPlayerDetails({
  personId,
  enabled,
}: UseGetPlayerDetailsProps) {
  return useQuery({
    ...queries.players.detail({ personId }),
    enabled,
  });
}
