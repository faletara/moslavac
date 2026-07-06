import type { NextRequest } from "next/server";
import { fetchCompetitionGoalStats } from "@/lib/hns/standings";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/competitions/[competitionId]/stats/goals">,
) {
  const { competitionId } = await ctx.params;
  return Response.json(
    await fetchCompetitionGoalStats({ competitionId: Number(competitionId) }),
  );
}
