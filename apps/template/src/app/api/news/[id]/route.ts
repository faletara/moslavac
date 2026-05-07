import type { NextRequest } from "next/server";
import { fetchNewsById } from "@/lib/payload/getNews";
import { tenantSlug } from "@/lib/payload/getTenant";
import { adaptPayloadNews } from "@/lib/payload/news-adapter";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/news/[id]">,
) {
  const { id } = await ctx.params;
  const doc = await fetchNewsById({ id });
  if (!doc) {
    return new Response("News not found", { status: 404 });
  }
  if (
    doc.tenant &&
    typeof doc.tenant === "object" &&
    doc.tenant.slug !== tenantSlug
  ) {
    return new Response("News not found", { status: 404 });
  }
  return Response.json(adaptPayloadNews(doc, tenantSlug));
}
