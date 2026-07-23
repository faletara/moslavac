/**
 * Resolution order for a Club app's public base URL:
 *  1. NEXT_PUBLIC_SITE_URL — explicit override (set this in Vercel for production).
 *  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production domain, so a
 *     missing override still yields the real domain instead of localhost.
 *  3. localhost on the club's own dev port — local development only.
 *
 * NOTE: NEXT_PUBLIC_* values are inlined at build time, so the production build
 * must run with NEXT_PUBLIC_SITE_URL present (e.g. Vercel Production env var).
 */

/**
 * A trailing slash on the base URL leaks into every `${BASE_URL}/path`
 * concatenation as a `//` double slash (sitemap `<loc>`, robots `Sitemap:`),
 * so normalise it away regardless of how the env var was entered.
 */
function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function resolveBaseUrl({ devPort }: { devPort: number }): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return stripTrailingSlash(
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    );
  }
  return `http://localhost:${devPort}`;
}
