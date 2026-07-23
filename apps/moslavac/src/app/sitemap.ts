import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/app-shell/seo/sitemap";
import type { SitemapEntry } from "@/lib/app-shell/seo/sitemap";
import { matchSource, newsSource } from "@/lib/app-shell/seo/sources";
import {
  fetchCurrentSeasonCompetitions,
  fetchSeniorCompetition,
} from "@/lib/hns/competitions";
import { fetchRoster } from "@/lib/payload/getRoster";
import { BASE_URL } from "@/lib/siteUrl";
import { buildCompetitionSlug, buildPlayerSlug } from "@/lib/helpers/slug";

export const revalidate = 3600;

/** Po natjecanju: pregled, tablica, strijelci, kartoni — specifično za moslavac. */
const seasonSource = (): Promise<SitemapEntry[]> =>
  fetchCurrentSeasonCompetitions().then((competitions) =>
    competitions
      .filter((c): c is typeof c & { id: number } => c.id != null)
      .flatMap((c) => {
        const slug = buildCompetitionSlug(c);
        return [
          { path: `/sezona/${slug}`, changeFrequency: "daily", priority: 0.8 },
          { path: `/sezona/${slug}/tablica`, changeFrequency: "daily", priority: 0.7 },
          { path: `/sezona/${slug}/strijelci`, changeFrequency: "weekly", priority: 0.6 },
          { path: `/sezona/${slug}/kartoni`, changeFrequency: "weekly", priority: 0.6 },
        ];
      }),
  );

/**
 * Statistička stranica po igraču (/statistika/{igrač}/{natjecanje}) za seniorsku
 * momčad. Inače su siročad — dostupne samo klikom na karticu igrača na /prva-momcad.
 */
const playerSource = async (): Promise<SitemapEntry[]> => {
  const [roster, senior] = await Promise.all([
    fetchRoster(),
    fetchSeniorCompetition(),
  ]);
  if (senior?.id == null) return [];
  const competitionSlug = buildCompetitionSlug(senior);
  return roster
    .filter((entry) => entry.position !== "trener" && entry.personId != null)
    .map((entry) => ({
      path: `/statistika/${buildPlayerSlug({
        personId: entry.personId,
        name: entry.displayName,
      })}/${competitionSlug}`,
      changeFrequency: "weekly",
      priority: 0.5,
    }));
};

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap({
    baseUrl: BASE_URL,
    routes: [
      { path: "/", changeFrequency: "daily", priority: 1 },
      { path: "/novosti", changeFrequency: "daily", priority: 0.9 },
      { path: "/utakmice", changeFrequency: "weekly", priority: 0.8 },
      { path: "/prva-momcad", changeFrequency: "monthly", priority: 0.7 },
      { path: "/klub", changeFrequency: "yearly", priority: 0.6 },
      { path: "/oprema", changeFrequency: "monthly", priority: 0.5 },
      { path: "/sezonska-iskaznica", changeFrequency: "monthly", priority: 0.5 },
      { path: "/politika-privatnosti", changeFrequency: "yearly", priority: 0.2 },
      { path: "/pravna-napomena", changeFrequency: "yearly", priority: 0.2 },
    ],
    sources: [
      newsSource({ segment: "/novosti", priority: 0.7 }),
      matchSource({ segment: "/utakmice" }),
      seasonSource,
      playerSource,
    ],
  });
}
