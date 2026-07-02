import "server-only";
import type { Equipment } from "@/types/equipment";
import { payloadFetch } from "./client";
import { tenantSlug } from "./getTenant";
import { buildQuery, tenantWhere } from "./query";
import type { PayloadMedia, PayloadPaginated } from "./types";

type PayloadEquipmentCategory =
  | "paketi"
  | "dresovi"
  | "trenirke"
  | "jakne"
  | "dodaci";

interface PayloadEquipment {
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

function pickImageUrl(value: PayloadMedia | number | null | undefined): {
  url: string;
  alt: string;
} {
  if (!value || typeof value !== "object") {
    return { url: "", alt: "" };
  }
  const url = value.sizes?.card?.url ?? value.url ?? "";
  return { url, alt: value.alt ?? "" };
}

function tenantSlugOf(tenant: PayloadEquipment["tenant"]): string {
  if (tenant && typeof tenant === "object") return tenant.slug;
  return tenantSlug;
}

function adaptEquipment(doc: PayloadEquipment): Equipment {
  const { url, alt } = pickImageUrl(doc.image);
  return {
    id: doc.id,
    displayName: doc.displayName,
    name: doc.name,
    category: doc.category,
    price: doc.price,
    imagePath: url,
    imageAlt: alt || doc.displayName,
    externalUrl: doc.externalUrl,
    description: doc.description ?? null,
    displayOrder: doc.displayOrder ?? 0,
    featured: doc.featured ?? false,
    tenantId: tenantSlugOf(doc.tenant),
  };
}

export async function fetchEquipment(): Promise<Equipment[]> {
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
  return result.docs.map(adaptEquipment);
}

export async function fetchFeaturedEquipment(): Promise<Equipment[]> {
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
  return result.docs.map(adaptEquipment);
}
