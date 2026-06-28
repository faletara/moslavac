import type { MetadataRoute } from "next";

export interface ManifestOptions {
  name: string;
  shortName: string;
  themeColor?: string;
  backgroundColor?: string;
}

/**
 * Build a tenant-branded web app manifest. Shared so every club frontend gets
 * an installable PWA from a 3-line `app/manifest.ts` re-export.
 */
export function buildManifest(opts: ManifestOptions): MetadataRoute.Manifest {
  return {
    name: opts.name,
    short_name: opts.shortName,
    start_url: "/",
    display: "standalone",
    background_color: opts.backgroundColor ?? "#ffffff",
    theme_color: opts.themeColor ?? "#111111",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
