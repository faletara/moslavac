import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetPreviousMatchProps = {
  enabled?: boolean;
};

export function useGetPreviousMatch(props?: UseGetPreviousMatchProps) {
  return useQuery({
    ...queries.competitions.previousMatch(),
    enabled: props?.enabled,
  });
}
