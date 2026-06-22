import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Equipment } from "@/types/equipment";

// HTTP fetchers — browser → route handler. Server components call lib/ directly.
async function fetchEquipment(): Promise<Equipment[]> {
  return apiFetch.get<Equipment[]>("/api/equipment");
}

async function fetchFeaturedEquipment(): Promise<Equipment[]> {
  return apiFetch.get<Equipment[]>("/api/equipment/featured");
}

export const equipmentQueries = createQueryKeys("equipment", {
  all: () => ({
    queryKey: ["all"],
    queryFn: fetchEquipment,
  }),
  featured: () => ({
    queryKey: ["featured"],
    queryFn: fetchFeaturedEquipment,
  }),
});

export function useGetEquipment(props?: { enabled?: boolean }) {
  return useQuery({ ...equipmentQueries.all(), enabled: props?.enabled });
}

export function useGetFeaturedEquipment(props?: { enabled?: boolean }) {
  return useQuery({ ...equipmentQueries.featured(), enabled: props?.enabled });
}

export const equipmentApi = {
  useGetEquipment,
  useGetFeaturedEquipment,
};
