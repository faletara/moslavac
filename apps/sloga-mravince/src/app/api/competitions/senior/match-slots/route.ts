import { fetchMatchSlots } from "@/lib/hns/competitions";

export async function GET() {
  return Response.json(await fetchMatchSlots());
}
