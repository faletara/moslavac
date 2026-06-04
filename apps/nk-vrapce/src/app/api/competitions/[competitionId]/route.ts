import type { NextRequest } from "next/server";
import { fetchCompetitionInfo } from "@/lib/hns/competitions";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/competitions/[competitionId]">,
) {
  const { competitionId } = await ctx.params;
  return Response.json(
    await fetchCompetitionInfo({ competitionId: Number(competitionId) }),
  );
}
