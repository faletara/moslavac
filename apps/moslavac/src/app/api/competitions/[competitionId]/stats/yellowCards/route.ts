import type { NextRequest } from "next/server";
import { fetchCompetitionYellowCardStats } from "@/lib/hns/standings";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/competitions/[competitionId]/stats/yellowCards">,
) {
  const { competitionId } = await ctx.params;
  return Response.json(
    await fetchCompetitionYellowCardStats({
      competitionId: Number(competitionId),
    }),
  );
}
