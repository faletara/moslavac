import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetNextMatchProps = {
  enabled?: boolean;
};

export function useGetNextMatch(props?: UseGetNextMatchProps) {
  return useQuery({
    ...queries.competitions.nextMatch(),
    enabled: props?.enabled,
  });
}
