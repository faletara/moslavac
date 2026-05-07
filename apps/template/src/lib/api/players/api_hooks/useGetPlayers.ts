import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetPlayersProps = {
  enabled?: boolean;
};

export function useGetPlayers(props?: UseGetPlayersProps) {
  return useQuery({
    ...queries.players.all(),
    enabled: props?.enabled,
  });
}
