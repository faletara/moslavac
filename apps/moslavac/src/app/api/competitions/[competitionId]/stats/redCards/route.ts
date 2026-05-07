import type { NextRequest } from "next/server";
import { fetchCompetitionRedCardStats } from "@/lib/hns/standings";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/competitions/[competitionId]/stats/redCards">,
) {
  const { competitionId } = await ctx.params;
  return Response.json(
    await fetchCompetitionRedCardStats({
      competitionId: Number(competitionId),
    }),
  );
}
