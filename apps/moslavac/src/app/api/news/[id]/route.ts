import type { NextRequest } from "next/server";
import { fetchNewsById } from "@/lib/payload/getNews";
import { tenantSlug } from "@/lib/payload/getTenant";
import { isNumericId } from "@/lib/validate";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/news/[id]">,
) {
  const { id } = await ctx.params;
  if (!isNumericId(id)) {
    return new Response("News not found", { status: 404 });
  }
  const news = await fetchNewsById({ id });
  if (!news || news.tenantId !== tenantSlug) {
    return new Response("News not found", { status: 404 });
  }
  return Response.json(news);
}
