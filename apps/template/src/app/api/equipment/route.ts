import { fetchEquipment } from "@/lib/payload/getEquipment";

export async function GET() {
  return Response.json(await fetchEquipment());
}
