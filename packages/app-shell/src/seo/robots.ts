import type { MetadataRoute } from "next";

/**
 * Pravila za robote vrijede jednako za svaki klub na platformi, pa žive ovdje:
 * promjena politike prema tražilicama ili AI robotima izvodi se jednom.
 */

/**
 * Roboti AI tražilica čitaju robots.txt konzervativno — izostanak pravila umiju
 * protumačiti kao zabranu. Zato ih se propušta izrijekom; oni pokreću citiranje
 * u ChatGPT-u, Perplexityju, Claudeu i Google AI odgovorima.
 */
const AI_SEARCH_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
];

export function buildRobots({
  baseUrl,
}: {
  baseUrl: string;
}): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Posrednik za slike se propušta da tražilice dohvate OG slike i
        // grbove (uže pravilo Allow nadjačava širu zabranu /api/). Same slike
        // nose X-Robots-Tag: noindex, pa ostaju izvan pretraživanja slika.
        allow: ["/", "/api/images/"],
        disallow: "/api/",
      },
      // Common Crawl skuplja podatke za treniranje modela, ne za pretraživanje.
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: AI_SEARCH_AGENTS,
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${baseUrl.replace(/\/+$/, "")}/sitemap.xml`,
  };
}
