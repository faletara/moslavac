import type { MetadataRoute } from "next";
import {
  fetchAllCompetitionMatches,
  fetchCurrentSeasonCompetitions,
} from "@/lib/hns/competitions";
import { BASE_URL } from "@/lib/siteUrl";
import { buildMatchSlug } from "@/lib/slug";
import type { Match } from "@/types/hns";

export const revalidate = 3600;

/**
 * Every match of the current season that has a detail page. HNS decides whether
 * a match may be shown at all (`allowDetail`), so one it withholds is left out
 * here too — pointing Google at a 404 is worse than not pointing it anywhere.
 *
 * A failing competition is skipped rather than allowed to take the sitemap down
 * with it: a partial sitemap still gets the rest of the site indexed.
 */
async function matchEntries(fallback: Date): Promise<MetadataRoute.Sitemap> {
  const competitions = await fetchCurrentSeasonCompetitions();
  const withId = competitions.filter(
    (competition): competition is typeof competition & { id: number } =>
      competition.id != null,
  );

  const results = await Promise.allSettled(
    withId.map((competition) =>
      fetchAllCompetitionMatches({ competitionId: competition.id }),
    ),
  );

  const matches = new Map<number, Match>();
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const match of result.value) {
      if (match.id != null && match.allowDetail) matches.set(match.id, match);
    }
  }

  return [...matches.values()].map((match) => ({
    url: `${BASE_URL}/raspored-i-rezultati/${buildMatchSlug(match)}`,
    lastModified: match.kickoffAtUtcMs
      ? new Date(match.kickoffAtUtcMs)
      : fallback,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const matches = await matchEntries(now).catch(() => []);

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/novosti`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/momcad`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/raspored-i-rezultati`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...matches,
  ];
}
