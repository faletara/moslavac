import type { NextRequest } from "next/server";
import { fetchMatchEvents } from "@/lib/hns/matches";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/matches/[matchId]/events">,
) {
  const { matchId } = await ctx.params;
  return Response.json(await fetchMatchEvents({ matchId: Number(matchId) }));
}
