import type { NextRequest } from "next/server";
import { createHnsImageResponse } from "@/lib/hns/imageResponse";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/images/[uuid]">,
) {
  const { uuid } = await ctx.params;
  return createHnsImageResponse(req, uuid);
}
