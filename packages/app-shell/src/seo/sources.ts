import "server-only";
import {
  fetchAllCompetitionMatches,
  fetchCurrentSeasonCompetitions,
  fetchSeniorCompetition,
} from "@/lib/hns/competitions";
import { fetchNewsSitemapEntries } from "@/lib/payload/getNews";
import { fetchRoster } from "@/lib/payload/getRoster";
import {
  buildCompetitionSlug,
  buildMatchSlug,
  buildPlayerSlug,
} from "@/lib/helpers/slug";
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
  fetchEntries = fetchNewsSitemapEntries,
}: {
  segment: string;
  priority?: number;
  /** Dohvat novosti; zamjenjiv u testu bez mockanja modula. */
  fetchEntries?: typeof fetchNewsSitemapEntries;
}): SitemapSource {
  return async () => {
    const entries = await fetchEntries();

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
  fetchCompetitions = fetchCurrentSeasonCompetitions,
  fetchMatches = fetchAllCompetitionMatches,
}: {
  segment: string;
  priority?: number;
  /** Dohvat natjecanja sezone; zamjenjiv u testu bez mockanja modula. */
  fetchCompetitions?: typeof fetchCurrentSeasonCompetitions;
  /** Dohvat utakmica natjecanja; zamjenjiv u testu bez mockanja modula. */
  fetchMatches?: typeof fetchAllCompetitionMatches;
}): SitemapSource {
  return async () => {
    const competitions = await fetchCompetitions();

    const withId = competitions.filter(
      (competition): competition is typeof competition & { id: number } =>
        competition.id != null,
    );

    const results = await Promise.allSettled(
      withId.map((competition) =>
        fetchMatches({ competitionId: competition.id }),
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

/**
 * Statističke stranice pojedinog igrača (`{segment}/{igrač}/{natjecanje}`) za
 * seniorsku momčad. Bez ovog izvora su siročad — dostupne su samo klikom s
 * popisa momčadi, pa ih tražilica otkrije kasno ili nikako.
 */
export function playerSource({
  segment,
  priority = 0.5,
}: {
  segment: string;
  priority?: number;
}): SitemapSource {
  return async () => {
    const [roster, senior] = await Promise.all([
      fetchRoster(),
      fetchSeniorCompetition(),
    ]);

    if (senior?.id == null) return [];
    const competitionSlug = buildCompetitionSlug(senior);

    return roster
      .filter((entry) => entry.position !== "trener" && entry.personId != null)
      .map((entry): SitemapEntry => {
        const playerSlug = buildPlayerSlug({
          personId: entry.personId,
          name: entry.displayName,
        });

        return {
          path: segmentPath(segment, `${playerSlug}/${competitionSlug}`),
          changeFrequency: "weekly",
          priority,
        };
      });
  };
}
