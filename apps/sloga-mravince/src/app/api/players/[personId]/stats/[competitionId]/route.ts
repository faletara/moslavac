import type { NextRequest } from "next/server";
import { fetchPlayerStats } from "@/lib/hns/players";
import { isNumericId } from "@/lib/validate";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/players/[personId]/stats/[competitionId]">,
) {
  const { personId, competitionId } = await ctx.params;
  if (!isNumericId(personId)) {
    return new Response("Invalid player id", { status: 400 });
  }
  return Response.json(
    await fetchPlayerStats({
      personId,
      competitionId: Number(competitionId),
    }),
  );
}
