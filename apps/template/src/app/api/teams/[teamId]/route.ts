import type { NextRequest } from "next/server";
import { fetchTeamDetails } from "@/lib/hns/team";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/teams/[teamId]">,
) {
  const { teamId } = await ctx.params;
  return Response.json(await fetchTeamDetails({ teamId }));
}
