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
      // Explicitly welcome AI search crawlers (they read robots.txt
      // conservatively and a missing rule can be treated as a soft block).
      // These power citations in ChatGPT, Perplexity, Claude and Google AI.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "Perplexity-User",
          "ClaudeBot",
          "Claude-User",
          "Google-Extended",
        ],
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
