import type { NextRequest } from "next/server";
import { fetchTeamStandings } from "@/lib/hns/standings";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/competitions/[competitionId]/standings">,
) {
  const { competitionId } = await ctx.params;
  return Response.json(
    await fetchTeamStandings({ competitionId: Number(competitionId) }),
  );
}
