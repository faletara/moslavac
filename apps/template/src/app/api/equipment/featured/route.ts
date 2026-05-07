import { fetchFeaturedEquipment } from "@/lib/payload/getEquipment";
import { tenantSlug } from "@/lib/payload/getTenant";
import { adaptPayloadEquipment } from "@/lib/payload/equipment-adapter";

export async function GET() {
  const docs = await fetchFeaturedEquipment();
  return Response.json(docs.map((d) => adaptPayloadEquipment(d, tenantSlug)));
}
