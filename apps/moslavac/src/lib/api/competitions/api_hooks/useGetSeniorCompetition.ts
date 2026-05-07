import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetSeniorCompetitionProps = {
  enabled?: boolean;
};

export function useGetSeniorCompetition(
  props?: UseGetSeniorCompetitionProps,
) {
  return useQuery({
    ...queries.competitions.senior(),
    enabled: props?.enabled,
  });
}
