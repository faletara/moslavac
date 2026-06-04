import type { NextRequest } from "next/server";
import { fetchTeamStandingsUnofficial } from "@/lib/hns/standings";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/competitions/[competitionId]/standings/unofficial">,
) {
  const { competitionId } = await ctx.params;
  return Response.json(
    await fetchTeamStandingsUnofficial({
      competitionId: Number(competitionId),
    }),
  );
}
