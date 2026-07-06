import type { NextRequest } from "next/server";
import { fetchMatchLineups } from "@/lib/hns/matches";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/matches/[matchId]/lineups">,
) {
  const { matchId } = await ctx.params;
  return Response.json(await fetchMatchLineups({ matchId: Number(matchId) }));
}
