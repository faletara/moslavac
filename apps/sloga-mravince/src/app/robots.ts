import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Allow the image proxy so crawlers can fetch og:images and crests
        // (more specific Allow wins over the /api/ Disallow). Images still
        // carry X-Robots-Tag: noindex, so they stay out of image search.
        allow: ["/", "/api/images/"],
        disallow: "/api/",
      },
      // Common Crawl bot — used to build AI training datasets; disallow per content policy
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
