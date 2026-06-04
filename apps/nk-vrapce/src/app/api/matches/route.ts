import { fetchAllMatches } from "@/lib/hns/matches";

export async function GET() {
  return Response.json(await fetchAllMatches());
}
