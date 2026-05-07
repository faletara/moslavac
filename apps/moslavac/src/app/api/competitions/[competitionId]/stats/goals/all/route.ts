import type { NextRequest } from "next/server";
import { fetchAllCompetitionScorers } from "@/lib/hns/standings";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/competitions/[competitionId]/stats/goals/all">,
) {
  const { competitionId } = await ctx.params;
  return Response.json(
    await fetchAllCompetitionScorers({
      competitionId: Number(competitionId),
    }),
  );
}
