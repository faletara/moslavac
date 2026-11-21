import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/app-shell/seo/sitemap";
import {
  matchSource,
  newsSource,
  playerSource,
} from "@/lib/app-shell/seo/sources";
import { BASE_URL } from "@/lib/siteUrl";
import { fetchCompetitionPagePaths } from "./raspored-i-rezultati/fetchCompetitionPagePaths";

export const revalidate = 3600;

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap({
    baseUrl: BASE_URL,
    routes: [
      { path: "/", changeFrequency: "daily", priority: 1 },
      { path: "/novosti", changeFrequency: "daily", priority: 0.8 },
      { path: "/momcad", changeFrequency: "weekly", priority: 0.7 },
      { path: "/raspored-i-rezultati", changeFrequency: "daily", priority: 0.8 },
      { path: "/o-klubu", changeFrequency: "monthly", priority: 0.6 },
      { path: "/kontakt", changeFrequency: "monthly", priority: 0.6 },
    ],
    sources: [
      newsSource({ segment: "/novosti", priority: 0.5 }),
      async () =>
        (await fetchCompetitionPagePaths({ revalidate })).map((path) => ({
          path,
          changeFrequency: "daily" as const,
          priority: 0.6,
        })),
      matchSource({ segment: "/raspored-i-rezultati" }),
      playerSource({ segment: "/statistika" }),
    ],
  });
}
