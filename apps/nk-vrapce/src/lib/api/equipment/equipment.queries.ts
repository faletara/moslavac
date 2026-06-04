import { createQueryKeys } from "@lukemorales/query-key-factory";
import { apiFetch } from "../client";
import type { Equipment } from "@/types/equipment";

export async function fetchEquipment(): Promise<Equipment[]> {
  return apiFetch.get<Equipment[]>("/api/equipment");
}

export async function fetchFeaturedEquipment(): Promise<Equipment[]> {
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
