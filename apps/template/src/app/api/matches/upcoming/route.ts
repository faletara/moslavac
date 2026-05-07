import { fetchUpcomingMatches } from "@/lib/hns/matches";

export async function GET() {
  return Response.json(await fetchUpcomingMatches());
}
