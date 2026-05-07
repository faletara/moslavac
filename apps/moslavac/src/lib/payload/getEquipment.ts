import "server-only";
import { payloadFetch } from "./client";
import { tenantSlug } from "./getTenant";
import type { PayloadMedia, PayloadPaginated } from "./types";

export type PayloadEquipmentCategory =
  | "paketi"
  | "dresovi"
  | "trenirke"
  | "jakne"
  | "dodaci";

export interface PayloadEquipment {
  id: number;
  displayName: string;
  name: string;
  category: PayloadEquipmentCategory;
  price: number;
  image: PayloadMedia | number | null;
  externalUrl: string;
  description: string | null;
  displayOrder: number | null;
  featured: boolean | null;
  active: boolean | null;
  tenant: number | { id: number; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

const equipmentTags = () => [`equipment-${tenantSlug}`];

const tenantWhere = (slug: string) => ({
  "where[tenant.slug][equals]": slug,
});

function buildQuery(params: Record<string, string | number>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.append(key, String(value));
  }
  return search.toString();
}

export async function fetchEquipment(): Promise<PayloadEquipment[]> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    "where[active][equals]": "true",
    limit: 100,
    sort: "displayOrder",
    depth: 2,
  });
  const result = await payloadFetch<PayloadPaginated<PayloadEquipment>>(
    `/equipment?${query}`,
    { next: { revalidate: 60, tags: equipmentTags() } },
  );
  return result.docs;
}

export async function fetchFeaturedEquipment(): Promise<PayloadEquipment[]> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    "where[active][equals]": "true",
    "where[featured][equals]": "true",
    limit: 12,
    sort: "displayOrder",
    depth: 2,
  });
  const result = await payloadFetch<PayloadPaginated<PayloadEquipment>>(
    `/equipment?${query}`,
    { next: { revalidate: 60, tags: equipmentTags() } },
  );
  return result.docs;
}
