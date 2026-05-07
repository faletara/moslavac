import type { NextRequest } from "next/server";
import { fetchCompetitionMatches } from "@/lib/hns/competitions";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/competitions/[competitionId]/matches">,
) {
  const { competitionId } = await ctx.params;
  return Response.json(
    await fetchCompetitionMatches({ competitionId: Number(competitionId) }),
  );
}
