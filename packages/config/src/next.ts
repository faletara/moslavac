import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The build configuration every Club app shares: security headers, the image
 * loader, and the monorepo root Turbopack needs. A club's `next.config.ts` is a
 * call to this, so a header can no longer go missing by being copied out of a
 * template — which is how three of the four apps ended up without a CSP.
 */

// Repo root, derived from this file's own location rather than the caller's, so
// no app has to know how deep it sits.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

// Dev-only allowance so Impeccable live mode can load.
const impeccableLiveDev =
  process.env.NODE_ENV === "development" ? " http://localhost:8400" : "";

// Baseline Content-Security-Policy. Permissive on script/style ('unsafe-inline'
// is required for the inline JSON-LD blocks and framer-motion inline styles;
// 'unsafe-eval' keeps Next's dev HMR working). Tighten to nonce-based later via
// proxy/middleware if stricter guarantees are needed. frame-src covers the
// OpenStreetMap stadium embeds and YouTube promos every club renders.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com${impeccableLiveDev}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.vercel-insights.com https://va.vercel-scripts.com${impeccableLiveDev}`,
  "frame-src 'self' https://www.openstreetmap.org https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' https:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

type Redirects = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;

type ClubNextConfigOptions = {
  /** Club-specific permanent redirects, e.g. a legacy path this club once had. */
  redirects?: Redirects;
  /**
   * Set only for clubs that actually serve `/llms.txt`. It adds the RFC 8288
   * `Link` relations agents look for to point them at that description; a club
   * without the route must leave it off rather than advertise a 404.
   */
  llmsTxt?: boolean;
};

export function clubNextConfig(
  options: ClubNextConfigOptions = {},
): NextConfig {
  const { redirects = [], llmsTxt = false } = options;

  // RFC 8288 Link relations. Agents read these before fetching the page body:
  // `sitemap` gives them every URL, `describedby`/`service-doc` point at the
  // plain-text description of the site. Comma-separated values are one header.
  const linkHeader = [
    '</sitemap.xml>; rel="sitemap"',
    ...(llmsTxt
      ? [
          '</llms.txt>; rel="describedby"; type="text/plain"',
          '</llms.txt>; rel="service-doc"; type="text/plain"',
        ]
      : []),
  ].join(", ");

  return {
    turbopack: {
      root: repoRoot,
    },
    // Koliko dugo CDN smije servirati staru (stale) verziju ISR stranice dok se
    // nova gradi u pozadini. Next default je godina dana, pa je prvi posjetitelj
    // nakon isteka `revalidate` uvijek dobivao stari sadržaj i tek okidao obnovu
    // — zbog toga se nova novost nije vidjela do hard refresha. 120 s je iznad
    // najkraćeg `revalidate` u aplikacijama (30 s), pa SWR i dalje radi, kratko.
    expireTime: 120,
    ...(redirects.length > 0
      ? { redirects: async () => redirects }
      : {}),
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            { key: "Link", value: linkHeader },
            { key: "X-Frame-Options", value: "SAMEORIGIN" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
            { key: "Content-Security-Policy", value: csp },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=()",
            },
          ],
        },
        {
          source: "/api/(.*)",
          headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
        },
      ];
    },
    images: {
      // `loaderFile` resolves against the calling app, not this file: every Club
      // app must keep its one-line `src/lib/imageLoader.ts` re-export or the
      // build fails here.
      //
      // Serve images directly via a passthrough loader instead of Vercel's
      // metered Image Optimization — R2 variants are already web-sized and
      // crests proxy through /api/images, so on-the-fly optimization adds little
      // while exhausting the free transformation quota (which breaks images
      // once hit).
      loader: "custom",
      loaderFile: "./src/lib/imageLoader.ts",
      deviceSizes: [640, 1080, 1920],
      imageSizes: [256],
    },
  };
}
