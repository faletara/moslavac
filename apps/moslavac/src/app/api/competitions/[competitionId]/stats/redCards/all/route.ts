import type { NextRequest } from "next/server";
import { fetchAllCompetitionRedCards } from "@/lib/hns/standings";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/competitions/[competitionId]/stats/redCards/all">,
) {
  const { competitionId } = await ctx.params;
  return Response.json(
    await fetchAllCompetitionRedCards({
      competitionId: Number(competitionId),
    }),
  );
}
