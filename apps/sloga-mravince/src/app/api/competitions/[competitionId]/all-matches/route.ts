import type { NextRequest } from "next/server";
import { fetchAllCompetitionMatches } from "@/lib/hns/competitions";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/competitions/[competitionId]/all-matches">,
) {
  const { competitionId } = await ctx.params;
  return Response.json(
    await fetchAllCompetitionMatches({ competitionId: Number(competitionId) }),
  );
}
