import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Dev-only allowance so Impeccable live mode can load.
const __impeccableLiveDev =
  process.env.NODE_ENV === "development" ? " http://localhost:8400" : "";

// Baseline Content-Security-Policy. Permissive on script/style ('unsafe-inline'
// is required for the inline JSON-LD blocks and framer-motion inline styles;
// 'unsafe-eval' keeps Next's dev HMR working). Tighten to nonce-based later via
// proxy/middleware if stricter guarantees are needed. frame-src covers the
// OpenStreetMap stadium embed and YouTube promo.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com${__impeccableLiveDev}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.vercel-insights.com https://va.vercel-scripts.com${__impeccableLiveDev}`,
  "frame-src 'self' https://www.openstreetmap.org https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' https:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(dirname, "../.."),
  },
  async redirects() {
    return [
      // Legacy/expected contact path — the club's contact lives on /klub.
      { source: "/kontakt", destination: "/klub", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Link", value: '</sitemap.xml>; rel="sitemap"' },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
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
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  images: {
    // Serve images directly via a passthrough loader instead of Vercel's
    // metered Image Optimization — R2 variants are already web-sized and crests
    // proxy through /api/images, so on-the-fly optimization adds little while
    // exhausting the free transformation quota (which breaks images once hit).
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    deviceSizes: [640, 1080, 1920],
    imageSizes: [256],
  },
};

export default nextConfig;
