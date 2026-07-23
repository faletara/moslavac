import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/app-shell/seo/sitemap";
import { BASE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Prazan predložak — samo naslovnica. Dodaj rute u `routes`, a dinamički
  // sadržaj (novosti, utakmice) kroz `sources` iz @/lib/app-shell/seo/sources.
  return buildSitemap({
    baseUrl: BASE_URL,
    routes: [{ path: "/", changeFrequency: "daily", priority: 1 }],
  });
}
