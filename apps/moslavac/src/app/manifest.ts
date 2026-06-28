import type { MetadataRoute } from "next";
import { getTenant } from "@/lib/payload/getTenant";
import { buildManifest } from "@/lib/pwa/manifest";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const tenant = await getTenant();
  return buildManifest({
    name: tenant.displayName,
    shortName: tenant.branding?.shortName ?? tenant.displayName,
  });
}
