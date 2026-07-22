import "server-only";
import type { Equipment } from "@/types/equipment";
import { fetchList } from "./fetchCollection";
import { mediaCardImage } from "./media";
import { resolveTenantSlug } from "./tenant";
import type { PayloadMedia } from "./types";

type PayloadEquipmentCategory =
  | "paketi"
  | "dresovi"
  | "trenirke"
  | "jakne"
  | "dodaci";

interface PayloadEquipment {
  id: number;
  displayName: string;
  category: PayloadEquipmentCategory;
  price: number;
  image: PayloadMedia | number | null;
  externalUrl: string;
  displayOrder: number | null;
  featured: boolean | null;
  active: boolean | null;
  tenant: number | { id: number; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

function tenantSlugOf(tenant: PayloadEquipment["tenant"]): string {
  if (tenant && typeof tenant === "object") return tenant.slug;
  return resolveTenantSlug();
}

export function adaptEquipment(doc: PayloadEquipment): Equipment {
  const { url, alt } = mediaCardImage(doc.image);
  return {
    id: doc.id,
    displayName: doc.displayName,
    category: doc.category,
    price: doc.price,
    imagePath: url,
    imageAlt: alt || doc.displayName,
    externalUrl: doc.externalUrl,
    displayOrder: doc.displayOrder ?? 0,
    featured: doc.featured ?? false,
    tenantId: tenantSlugOf(doc.tenant),
  };
}

export const fetchEquipment = (): Promise<Equipment[]> =>
  fetchList<PayloadEquipment, Equipment>({
    collection: "equipment",
    where: { "where[active][equals]": "true" },
    sort: "displayOrder",
    limit: 100,
    adapt: adaptEquipment,
  });

export const fetchFeaturedEquipment = (): Promise<Equipment[]> =>
  fetchList<PayloadEquipment, Equipment>({
    collection: "equipment",
    where: {
      "where[active][equals]": "true",
      "where[featured][equals]": "true",
    },
    sort: "displayOrder",
    limit: 12,
    adapt: adaptEquipment,
  });
