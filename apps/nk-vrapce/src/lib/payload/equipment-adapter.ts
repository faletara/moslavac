import "server-only";
import type { Equipment } from "@/types/equipment";
import type { PayloadEquipment } from "./getEquipment";
import type { PayloadMedia } from "./types";

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

function tenantSlugOf(
  tenant: PayloadEquipment["tenant"],
  fallback: string,
): string {
  if (!tenant) return fallback;
  if (typeof tenant === "object") return tenant.slug;
  return fallback;
}

export function adaptPayloadEquipment(
  doc: PayloadEquipment,
  tenantSlug: string,
): Equipment {
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
    tenantId: tenantSlugOf(doc.tenant, tenantSlug),
  };
}
