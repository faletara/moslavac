import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetEquipmentProps = {
  enabled?: boolean;
};

export function useGetEquipment(props?: UseGetEquipmentProps) {
  return useQuery({
    ...queries.equipment.all(),
    enabled: props?.enabled,
  });
}
