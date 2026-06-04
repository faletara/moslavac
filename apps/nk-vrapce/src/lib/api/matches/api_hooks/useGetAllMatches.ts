import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetAllMatchesProps = {
  enabled?: boolean;
};

export function useGetAllMatches(props?: UseGetAllMatchesProps) {
  return useQuery({
    ...queries.matches.all(),
    enabled: props?.enabled,
  });
}
