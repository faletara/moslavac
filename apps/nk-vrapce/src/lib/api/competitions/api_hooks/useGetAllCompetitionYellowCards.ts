import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetAllCompetitionYellowCardsProps = {
  competitionId: number;
  enabled?: boolean;
};

export function useGetAllCompetitionYellowCards({
  competitionId,
  enabled,
}: UseGetAllCompetitionYellowCardsProps) {
  return useQuery({
    ...queries.competitions.allYellowCards({ competitionId }),
    enabled,
  });
}
