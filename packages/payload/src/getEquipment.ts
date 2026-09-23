import "server-only";
import { z } from "zod";
import type { Equipment } from "@/types/equipment";
import { fetchList } from "./fetchCollection";
import { mediaRef, tenantRef } from "./schemas";
import { resolveTenantSlug } from "./tenant";

export const equipmentSchema = z.object({
  id: z.number(),
  displayName: z.string().nullish().transform((text) => text ?? ""),
  category: z
    .enum(["paketi", "dresovi", "trenirke", "jakne", "dodaci"])
    .catch("dodaci"),
  price: z.number().nullish().transform((n) => n ?? 0),
  image: mediaRef,
  externalUrl: z.string().nullish().transform((text) => text ?? ""),
  displayOrder: z.number().nullish().default(null),
  featured: z.boolean().nullish().default(null),
  active: z.boolean().nullish().default(null),
  tenant: tenantRef,
  createdAt: z.string().nullish().transform((text) => text ?? ""),
  updatedAt: z.string().nullish().transform((text) => text ?? ""),
});

type PayloadEquipment = z.output<typeof equipmentSchema>;

function tenantSlugOf(tenant: PayloadEquipment["tenant"]): string {
  return tenant?.slug ?? resolveTenantSlug();
}

export function adaptEquipment(doc: PayloadEquipment): Equipment {
  return {
    id: doc.id,
    displayName: doc.displayName,
    category: doc.category,
    price: doc.price,
    imagePath: doc.image?.cardUrl ?? "",
    imageAlt: doc.image?.alt || doc.displayName,
    externalUrl: doc.externalUrl,
    displayOrder: doc.displayOrder ?? 0,
    featured: doc.featured ?? false,
    tenantId: tenantSlugOf(doc.tenant),
  };
}

export const fetchEquipment = (): Promise<Equipment[]> =>
  fetchList<PayloadEquipment, Equipment>({
    collection: "equipment",
    schema: equipmentSchema,
    where: { "where[active][equals]": "true" },
    sort: "displayOrder",
    limit: 100,
    adapt: adaptEquipment,
  });

export const fetchFeaturedEquipment = (): Promise<Equipment[]> =>
  fetchList<PayloadEquipment, Equipment>({
    collection: "equipment",
    schema: equipmentSchema,
    where: {
      "where[active][equals]": "true",
      "where[featured][equals]": "true",
    },
    sort: "displayOrder",
    limit: 12,
    adapt: adaptEquipment,
  });
