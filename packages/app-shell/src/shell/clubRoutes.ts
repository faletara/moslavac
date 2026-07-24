import type { Metadata, MetadataRoute } from "next";
import { buildClubMetadata } from "@/lib/app-shell/identity/clubIdentity";
import { buildClubManifest } from "@/lib/app-shell/identity/clubManifest";
import { getTenant } from "@/lib/payload/getTenant";

/**
 * The root-route exports every Club app shares, each a factory over the one
 * thing the platform cannot resolve for a club: its base URL, its brand colour.
 *
 *   export const generateMetadata = clubMetadataRoute(BASE_URL);
 *   export default clubManifestRoute(THEME_COLOR);          // app/manifest.ts
 */

export function clubMetadataRoute(baseUrl: string) {
  return async function generateMetadata(): Promise<Metadata> {
    return buildClubMetadata({ tenant: await getTenant(), baseUrl });
  };
}

export function clubManifestRoute(themeColor: string) {
  return async function manifest(): Promise<MetadataRoute.Manifest> {
    return buildClubManifest({ tenant: await getTenant(), themeColor });
  };
}
