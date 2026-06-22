import type { MetadataRoute } from "next";
import { fetchAlbums } from "@/lib/payload/getGallery";
import { fetchNewsPaginated } from "@/lib/payload/getNews";
import { BASE_URL } from "@/lib/siteUrl";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
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
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, albums] = await Promise.all([
    fetchNewsPaginated({ page: 1, size: 200 }).catch(() => null),
    fetchAlbums().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const newsEntries: MetadataRoute.Sitemap =
    news?.content.map((doc) => ({
      url: `${BASE_URL}/novosti/${doc.slug ?? doc.id}`,
      lastModified: doc.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    })) ?? [];

  const albumEntries: MetadataRoute.Sitemap = albums.map((album) => ({
    url: `${BASE_URL}/galerija/${album.slug ?? album.id}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...newsEntries, ...albumEntries];
}
