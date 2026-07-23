import type { MetadataRoute } from "next";
import { buildRobots } from "@/lib/app-shell/seo/robots";
import { BASE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return buildRobots({ baseUrl: BASE_URL });
}
