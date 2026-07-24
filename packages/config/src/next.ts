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
};

export function clubNextConfig(
  options: ClubNextConfigOptions = {},
): NextConfig {
  const { redirects = [] } = options;

  return {
    turbopack: {
      root: repoRoot,
    },
    ...(redirects.length > 0
      ? { redirects: async () => redirects }
      : {}),
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            { key: "Link", value: '</sitemap.xml>; rel="sitemap"' },
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
