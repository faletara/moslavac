/**
 * Single source of truth for the site's public base URL.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL — explicit override (set this in Vercel for production).
 *  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production domain, so a
 *     missing override still yields the real domain instead of localhost.
 *  3. localhost — local development only.
 *
 * NOTE: NEXT_PUBLIC_* values are inlined at build time, so the production build
 * must run with NEXT_PUBLIC_SITE_URL present (e.g. Vercel Production env var).
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:43104";
}

export const BASE_URL = getBaseUrl();
