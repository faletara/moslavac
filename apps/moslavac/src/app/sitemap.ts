import type { MetadataRoute } from "next";
import {
  fetchAllCompetitionMatches,
  fetchCurrentSeasonCompetitions,
} from "@/lib/hns/competitions";
import { fetchNewsPaginated } from "@/lib/payload/getNews";
import { BASE_URL } from "@/lib/siteUrl";
import { buildCompetitionSlug, buildMatchSlug } from "@/lib/slug";

export const revalidate = 3600;

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
  { url: `${BASE_URL}/novosti`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE_URL}/utakmice`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/prva-momcad`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/klub`, changeFrequency: "yearly", priority: 0.6 },
  { url: `${BASE_URL}/oprema`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/sezonska-iskaznica`, changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [newsResult, competitionsResult] = await Promise.allSettled([
    fetchNewsPaginated({ page: 1, size: 200 }),
    fetchCurrentSeasonCompetitions(),
  ]);

  const newsUrls: MetadataRoute.Sitemap =
    newsResult.status === "fulfilled"
      ? newsResult.value.docs.map((article) => ({
          url: `${BASE_URL}/novosti/${article.slug ?? article.id}`,
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

  const competitionUrls: MetadataRoute.Sitemap = competitions.flatMap((c) => {
    const slug = buildCompetitionSlug(c);
    return [
      {
        url: `${BASE_URL}/sezona/${slug}`,
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/sezona/${slug}/tablica`,
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/sezona/${slug}/strijelci`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/sezona/${slug}/kartoni`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
    ];
  });

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
        url: `${BASE_URL}/utakmice/${buildMatchSlug(m)}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
  });

  return [...STATIC_ROUTES, ...newsUrls, ...competitionUrls, ...matchUrls];
}
