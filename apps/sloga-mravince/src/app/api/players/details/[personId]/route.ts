import type { NextRequest } from "next/server";
import { fetchPlayerDetails } from "@/lib/hns/players";
import { isNumericId } from "@/lib/validate";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/players/details/[personId]">,
) {
  const { personId } = await ctx.params;
  if (!isNumericId(personId)) {
    return new Response("Invalid player id", { status: 400 });
  }
  return Response.json(await fetchPlayerDetails({ personId }));
}
