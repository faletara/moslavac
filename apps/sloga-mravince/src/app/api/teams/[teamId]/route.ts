import type { NextRequest } from "next/server";
import { fetchTeamDetails } from "@/lib/hns/team";
import { isNumericId } from "@/lib/validate";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/teams/[teamId]">,
) {
  const { teamId } = await ctx.params;
  if (!isNumericId(teamId)) {
    return new Response("Invalid team id", { status: 400 });
  }
  return Response.json(await fetchTeamDetails({ teamId }));
}
