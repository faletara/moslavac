import type { MetadataRoute } from "next";
import { getTenant } from "@/lib/payload/getTenant";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const tenant = await getTenant();
  const logo = tenant.branding?.logo;
  const logoUrl = !logo ? null : typeof logo === "string" ? logo : logo.url;

  return {
    name: tenant.displayName,
    short_name: tenant.branding?.shortName ?? tenant.displayName,
    description:
      tenant.branding?.motto ?? `Službena web stranica nogometnog kluba ${tenant.displayName}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e293b",
    ...(logoUrl ? { icons: [{ src: logoUrl, sizes: "any" }] } : {}),
  };
}
