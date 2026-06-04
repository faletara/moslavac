import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetMatchSlotsProps = {
  enabled?: boolean;
};

export function useGetMatchSlots(props?: UseGetMatchSlotsProps) {
  return useQuery({
    ...queries.competitions.matchSlots(),
    enabled: props?.enabled,
  });
}
