import type { MetadataRoute } from "next";
import {
  fetchAllCompetitionMatches,
  fetchCurrentSeasonCompetitions,
  fetchSeniorCompetition,
} from "@/lib/hns/competitions";
import { fetchNewsPaginated } from "@/lib/payload/getNews";
import { fetchRoster } from "@/lib/payload/getRoster";
import { BASE_URL } from "@/lib/siteUrl";
import {
  buildCompetitionSlug,
  buildMatchSlug,
  buildPlayerSlug,
} from "@/lib/slug";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Regenerated hourly (revalidate); use the generation time as a freshness
  // signal for routes without their own modification timestamp.
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/novosti`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/utakmice`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/prva-momcad`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/klub`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/oprema`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/sezonska-iskaznica`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/politika-privatnosti`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/pravna-napomena`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const [newsResult, competitionsResult, rosterResult, seniorResult] =
    await Promise.allSettled([
      fetchNewsPaginated({ page: 1, size: 200 }),
      fetchCurrentSeasonCompetitions(),
      fetchRoster(),
      fetchSeniorCompetition(),
    ]);

  const newsUrls: MetadataRoute.Sitemap =
    newsResult.status === "fulfilled"
      ? newsResult.value.content.map((article) => ({
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
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/sezona/${slug}/tablica`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/sezona/${slug}/strijelci`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/sezona/${slug}/kartoni`,
        lastModified: now,
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
        lastModified: m.dateTimeUTC != null ? new Date(m.dateTimeUTC) : now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
  });

  // Individual player statistics pages (/statistika/{player}/{competition}),
  // built for the senior competition roster. These are otherwise orphaned —
  // only reachable by clicking a player card on /prva-momcad.
  const roster =
    rosterResult.status === "fulfilled" ? rosterResult.value : [];
  const seniorCompetition =
    seniorResult.status === "fulfilled" ? seniorResult.value : null;

  const playerUrls: MetadataRoute.Sitemap =
    seniorCompetition?.id != null
      ? roster
          .filter((entry) => entry.position !== "trener" && entry.personId != null)
          .map((entry) => {
            const playerSlug = buildPlayerSlug({
              personId: entry.personId,
              name: entry.displayName,
            });
            const competitionSlug = buildCompetitionSlug(seniorCompetition);
            return {
              url: `${BASE_URL}/statistika/${playerSlug}/${competitionSlug}`,
              lastModified: now,
              changeFrequency: "weekly" as const,
              priority: 0.5,
            };
          })
      : [];

  return [
    ...staticRoutes,
    ...newsUrls,
    ...competitionUrls,
    ...matchUrls,
    ...playerUrls,
  ];
}
