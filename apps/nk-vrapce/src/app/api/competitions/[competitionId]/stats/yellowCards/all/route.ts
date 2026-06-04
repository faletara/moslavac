import type { NextRequest } from "next/server";
import { fetchAllCompetitionYellowCards } from "@/lib/hns/standings";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/competitions/[competitionId]/stats/yellowCards/all">,
) {
  const { competitionId } = await ctx.params;
  return Response.json(
    await fetchAllCompetitionYellowCards({
      competitionId: Number(competitionId),
    }),
  );
}
