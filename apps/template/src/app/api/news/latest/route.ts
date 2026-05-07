import { fetchLatestNews } from "@/lib/payload/getNews";
import { tenantSlug } from "@/lib/payload/getTenant";
import { adaptPayloadNews } from "@/lib/payload/news-adapter";

export async function GET() {
  const docs = await fetchLatestNews();
  return Response.json(docs.map((d) => adaptPayloadNews(d, tenantSlug)));
}
