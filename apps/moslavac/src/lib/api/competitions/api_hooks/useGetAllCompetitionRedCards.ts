import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetAllCompetitionRedCardsProps = {
  competitionId: number;
  enabled?: boolean;
};

export function useGetAllCompetitionRedCards({
  competitionId,
  enabled,
}: UseGetAllCompetitionRedCardsProps) {
  return useQuery({
    ...queries.competitions.allRedCards({ competitionId }),
    enabled,
  });
}
