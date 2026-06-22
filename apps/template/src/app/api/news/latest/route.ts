import { fetchLatestNews } from "@/lib/payload/getNews";

export async function GET() {
  return Response.json(await fetchLatestNews());
}
