import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetUpcomingMatchesProps = {
  enabled?: boolean;
};

export function useGetUpcomingMatches(props?: UseGetUpcomingMatchesProps) {
  return useQuery({
    ...queries.matches.upcoming(),
    enabled: props?.enabled,
  });
}
