import type { NextRequest } from "next/server";
import { fetchPlayerStats } from "@/lib/hns/players";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/players/[personId]/stats/[competitionId]">,
) {
  const { personId, competitionId } = await ctx.params;
  return Response.json(
    await fetchPlayerStats({
      personId,
      competitionId: Number(competitionId),
    }),
  );
}
