import type { NextRequest } from "next/server";
import { fetchNewsPaginated } from "@/lib/payload/getNews";
import { clampInt } from "@/lib/validate";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const page = clampInt(url.searchParams.get("page"), 0, 0, 1000) + 1;
  const size = clampInt(url.searchParams.get("size"), 10, 1, 50);
  return Response.json(await fetchNewsPaginated({ page, size }));
}
