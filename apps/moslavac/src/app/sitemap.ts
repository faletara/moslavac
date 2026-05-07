import type { MetadataRoute } from "next";
import {
  fetchAllCompetitionMatches,
  fetchCurrentSeasonCompetitions,
} from "@/lib/hns/competitions";
import { fetchNewsPaginated } from "@/lib/payload/getNews";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
  { url: `${BASE_URL}/news`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE_URL}/matches`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/first-team`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/klub`, changeFrequency: "yearly", priority: 0.6 },
  { url: `${BASE_URL}/oprema`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/season-ticket`, changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [newsResult, competitionsResult] = await Promise.allSettled([
    fetchNewsPaginated({ page: 1, size: 200 }),
    fetchCurrentSeasonCompetitions(),
  ]);

  const newsUrls: MetadataRoute.Sitemap =
    newsResult.status === "fulfilled"
      ? newsResult.value.docs.map((article) => ({
          url: `${BASE_URL}/news/${article.id}`,
          lastModified: new Date(article.updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
      : [];

  const competitions =
    competitionsResult.status === "fulfilled"
      ? competitionsResult.value.filter(
          (c): c is typeof c & { id: number } => c.id != null,
        )
      : [];

  const competitionUrls: MetadataRoute.Sitemap = competitions.flatMap((c) => [
    {
      url: `${BASE_URL}/season/${c.id}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/season/${c.id}/utakmice`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/season/${c.id}/strijelci`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/season/${c.id}/kartoni`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ]);

  const matchResults = await Promise.allSettled(
    competitions.map((c) =>
      fetchAllCompetitionMatches({ competitionId: c.id }),
    ),
  );

  const matchUrls: MetadataRoute.Sitemap = matchResults.flatMap((result) => {
    if (result.status !== "fulfilled") return [];
    return result.value
      .filter((m) => m.id != null && m.allowDetail !== false)
      .map((m) => ({
        url: `${BASE_URL}/matches/${m.id}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
  });

  return [...STATIC_ROUTES, ...newsUrls, ...competitionUrls, ...matchUrls];
}
