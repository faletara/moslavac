import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetFeaturedEquipmentProps = {
  enabled?: boolean;
};

export function useGetFeaturedEquipment(props?: UseGetFeaturedEquipmentProps) {
  return useQuery({
    ...queries.equipment.featured(),
    enabled: props?.enabled,
  });
}
