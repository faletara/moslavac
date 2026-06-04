import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/siteUrl";

// Empty template: only the homepage exists. Extend this as you add routes —
// the reference implementation (apps/moslavac) builds news/competition/match
// URLs from HNS + Payload data.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/`,
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
