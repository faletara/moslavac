import type { NextRequest } from "next/server";
import { fetchMatchInfo } from "@/lib/hns/matches";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/matches/[matchId]">,
) {
  const { matchId } = await ctx.params;
  const data = await fetchMatchInfo({ matchId: Number(matchId) });
  return Response.json(data);
}
