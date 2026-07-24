import type { MetadataRoute } from "next";
import type { FrontendTenant } from "@/lib/payload/types";
import { clubDescription } from "./clubIdentity";

/**
 * Projection of a Tenant into an installable web app manifest — the same club
 * identity `buildClubMetadata` renders for crawlers, shaped for the home screen.
 *
 * Icons deliberately come from the app's own `icon.png` / `apple-icon.png` file
 * conventions rather than the Tenant logo: an installable icon must declare a
 * size that matches its bitmap, which an arbitrary uploaded logo cannot promise.
 */

/**
 * The icon files every Club app ships, at the sizes it ships them. Declaring a
 * size the bitmap does not have makes Chrome reject the icon, so these numbers
 * are a contract with `app/icon.png` and `app/apple-icon.png` — change one and
 * you change the other. 256px clears Chrome's 192px installability floor.
 */
const ICONS = [
  { src: "/icon.png", sizes: "256x256", type: "image/png", purpose: "any" },
  { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
] as const;

type ClubManifestInput = {
  tenant: FrontendTenant;
  /**
   * The club's brand colour, colocated with the theme it names (the app's own
   * `theme.ts` next to `globals.css`) so the chrome bar cannot drift from the
   * palette it is meant to match.
   */
  themeColor: string;
};

export function buildClubManifest({
  tenant,
  themeColor,
}: ClubManifestInput): MetadataRoute.Manifest {
  return {
    name: tenant.displayName,
    short_name: tenant.branding?.shortName ?? tenant.displayName,
    description: clubDescription(tenant),
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: themeColor,
    icons: [...ICONS],
  };
}
