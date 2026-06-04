import type { NextRequest } from "next/server";
import { fetchHnsImageBytes } from "@/lib/hns/images";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/images/[uuid]">,
) {
  const { uuid } = await ctx.params;
  const bytes = await fetchHnsImageBytes(uuid);
  if (!bytes) {
    return new Response("Image not found", { status: 404 });
  }
  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
