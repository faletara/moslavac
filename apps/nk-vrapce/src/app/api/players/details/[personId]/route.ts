import type { NextRequest } from "next/server";
import { fetchPlayerDetails } from "@/lib/hns/players";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/players/details/[personId]">,
) {
  const { personId } = await ctx.params;
  return Response.json(await fetchPlayerDetails({ personId }));
}
