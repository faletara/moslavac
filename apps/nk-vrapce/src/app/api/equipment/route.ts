import { fetchEquipment } from "@/lib/payload/getEquipment";
import { tenantSlug } from "@/lib/payload/getTenant";
import { adaptPayloadEquipment } from "@/lib/payload/equipment-adapter";

export async function GET() {
  const docs = await fetchEquipment();
  return Response.json(docs.map((d) => adaptPayloadEquipment(d, tenantSlug)));
}
