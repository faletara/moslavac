import type { NextRequest } from "next/server";
import { fetchMatchReferees } from "@/lib/hns/matches";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/matches/[matchId]/referees">,
) {
  const { matchId } = await ctx.params;
  return Response.json(await fetchMatchReferees({ matchId: Number(matchId) }));
}
