import type { NextRequest } from "next/server";
import { fetchNewsPaginated } from "@/lib/payload/getNews";
import { tenantSlug } from "@/lib/payload/getTenant";
import { adaptPayloadNewsPaginated } from "@/lib/payload/news-adapter";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const page = Number(url.searchParams.get("page") ?? "0") + 1;
  const size = Number(url.searchParams.get("size") ?? "10");
  const result = await fetchNewsPaginated({ page, size });
  return Response.json(adaptPayloadNewsPaginated(result, tenantSlug));
}
