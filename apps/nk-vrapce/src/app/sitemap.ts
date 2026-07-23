import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/app-shell/seo/sitemap";
import type { SitemapEntry } from "@/lib/app-shell/seo/sitemap";
import { newsSource } from "@/lib/app-shell/seo/sources";
import { fetchAlbums } from "@/lib/payload/getGallery";
import { BASE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

/** Albumi galerije — specifično za nk-vrapce. */
const albumSource = (): Promise<SitemapEntry[]> =>
  fetchAlbums().then((albums) =>
    albums.map((album) => ({
      path: `/galerija/${album.slug ?? album.id}`,
      changeFrequency: "monthly",
      priority: 0.5,
    })),
  );

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap({
    baseUrl: BASE_URL,
    routes: [
      { path: "/", changeFrequency: "daily", priority: 1 },
      { path: "/novosti", changeFrequency: "daily", priority: 0.9 },
      { path: "/seniori", changeFrequency: "weekly", priority: 0.8 },
      { path: "/skola-nogometa", changeFrequency: "monthly", priority: 0.7 },
      { path: "/povijest", changeFrequency: "yearly", priority: 0.6 },
      { path: "/uprava", changeFrequency: "monthly", priority: 0.6 },
      { path: "/statut", changeFrequency: "yearly", priority: 0.5 },
      { path: "/galerija", changeFrequency: "weekly", priority: 0.7 },
      { path: "/navijaci", changeFrequency: "monthly", priority: 0.6 },
      { path: "/kontakt", changeFrequency: "yearly", priority: 0.6 },
      { path: "/oprema", changeFrequency: "weekly", priority: 0.7 },
    ],
    sources: [
      newsSource({ segment: "/novosti", priority: 0.6 }),
      albumSource,
    ],
  });
}
