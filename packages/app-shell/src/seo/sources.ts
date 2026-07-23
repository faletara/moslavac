import "server-only";
import {
  fetchAllCompetitionMatches,
  fetchCurrentSeasonCompetitions,
} from "@/lib/hns/competitions";
import { fetchNewsSitemapEntries } from "@/lib/payload/getNews";
import { buildMatchSlug } from "@/lib/helpers/slug";
import type { SitemapEntry, SitemapSource } from "./sitemap";

/**
 * Zajednički dinamički izvori sitemapa. Klub bira samo segment rute pod kojim
 * mu novosti i utakmice žive (hrvatski nazivi variraju: `/utakmice` vs
 * `/raspored-i-rezultati`), a dohvat i mapiranje ostaju ovdje.
 */

function segmentPath(segment: string, slug: string): string {
  return `${segment.replace(/\/+$/, "")}/${slug}`;
}

/** Sve objavljene novosti kao stavke sitemapa pod zadanim segmentom rute. */
export function newsSource({
  segment,
  priority = 0.6,
}: {
  segment: string;
  priority?: number;
}): SitemapSource {
  return async () => {
    const entries = await fetchNewsSitemapEntries();
    return entries.map(
      (entry): SitemapEntry => ({
        path: segmentPath(segment, entry.slug),
        lastModified: entry.updatedAt,
        changeFrequency: "monthly",
        priority,
      }),
    );
  };
}

/**
 * Sve utakmice tekuće sezone koje imaju detaljnu stranicu. HNS odlučuje smije li
 * se utakmica prikazati (`allowDetail`), pa ona koju uskraćuje ovdje izostaje —
 * upućivati tražilicu na 404 gore je nego ne upućivati je nikamo. Natjecanje
 * koje zakaže preskače se umjesto da sruši cijeli izvor.
 */
export function matchSource({
  segment,
  priority = 0.6,
}: {
  segment: string;
  priority?: number;
}): SitemapSource {
  return async () => {
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

    return results.flatMap((result): SitemapEntry[] => {
      if (result.status !== "fulfilled") return [];
      return result.value
        .filter((match) => match.id != null && match.allowDetail)
        .map((match) => ({
          path: segmentPath(segment, buildMatchSlug(match)),
          lastModified: match.kickoffAtUtcMs,
          changeFrequency: "weekly",
          priority,
        }));
    });
  };
}
