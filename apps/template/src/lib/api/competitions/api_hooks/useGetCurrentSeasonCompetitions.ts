import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetCurrentSeasonCompetitionsProps = {
  enabled?: boolean;
};

export function useGetCurrentSeasonCompetitions(
  props?: UseGetCurrentSeasonCompetitionsProps,
) {
  return useQuery({
    ...queries.competitions.currentSeason(),
    enabled: props?.enabled,
  });
}
