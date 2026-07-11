import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import MatchHero from "@/components/features/matches/MatchHero";
import MatchTabs from "@/components/features/matches/MatchTabs";
import { RefreshWhile } from "@/components/ui/refresh-while";
import { redirectToCanonical } from "@/lib/canonical";
import { formatDateTime } from "@/lib/helpers/date";
import {
  fetchAllCompetitionMatches,
  fetchCurrentSeasonCompetitions,
} from "@/lib/hns/competitions";
import {
  fetchMatchEvents,
  fetchMatchInfo,
  fetchMatchLineups,
  fetchMatchReferees,
} from "@/lib/hns/matches";
import { isFinished, isLive } from "@/lib/hns/matchStatus";
import { fetchTeamStandings } from "@/lib/hns/standings";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";
import { buildMatchSlug, parseTrailingId } from "@/lib/slug";
import type { Match } from "@/types/hns";

interface Props {
  params: Promise<{ slug: string }>;
}

// Kept in step with the 30s TTL on the live match/events fetchers — a longer
// page TTL would cap them and freeze a live score behind a stale render.
export const revalidate = 30;

function matchTitle(match: Match): string {
  const home = match.homeTeam?.name ?? "Domaćin";
  const away = match.awayTeam?.name ?? "Gost";
  const homeScore = match.score.home?.current;
  const awayScore = match.score.away?.current;

  return homeScore != null && awayScore != null
    ? `${home} ${homeScore}:${awayScore} ${away}`
    : `${home} – ${away}`;
}

export async function generateStaticParams() {
  const competitions = await fetchCurrentSeasonCompetitions();
  const withId = competitions.filter(
    (competition): competition is typeof competition & { id: number } =>
      competition.id != null,
  );

  // One competition failing must not sink the whole build — take what resolves.
  const results = await Promise.allSettled(
    withId.map((competition) =>
      fetchAllCompetitionMatches({ competitionId: competition.id }),
    ),
  );

  const slugs = new Set<string>();
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const match of result.value) {
      if (match.id != null && match.allowDetail) slugs.add(buildMatchSlug(match));
    }
  }

  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const match = await fetchMatchInfo({ matchId: parseTrailingId(slug) });
  if (!match) return {};

  const title = matchTitle(match);
  const { date } = match.kickoffAtUtcMs
    ? formatDateTime(match.kickoffAtUtcMs)
    : { date: "" };

  const description =
    [match.competition?.name?.trim(), date, match.facility?.place?.trim()]
      .filter(Boolean)
      .join(" · ") || title;

  const canonical = `/raspored-i-rezultati/${buildMatchSlug(match)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "website", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MatchPage({ params }: Props) {
  const { slug } = await params;
  const matchId = parseTrailingId(slug);

  const [match, events, lineups, info] = await Promise.all([
    fetchMatchInfo({ matchId }),
    fetchMatchEvents({ matchId }),
    fetchMatchLineups({ matchId }),
    fetchMatchReferees({ matchId }),
  ]);

  if (!match) notFound();

  // Collapse the bare-id and partial-slug forms onto the canonical URL, so the
  // same match isn't indexed under several addresses.
  redirectToCanonical(
    `/raspored-i-rezultati/${slug}`,
    `/raspored-i-rezultati/${buildMatchSlug(match)}`,
  );

  // Keyed off the match's own competition, so it can only start once the match
  // resolves. Cup ties have no table — an empty list simply hides the tab.
  const competitionId = match.competition?.id ?? null;
  const standings =
    competitionId != null ? await fetchTeamStandings({ competitionId }) : [];

  const live = isLive(match);
  const started = live || isFinished(match);
  const tenant = await getTenant();
  const jsonLd = buildJsonLd({ match, tenantName: tenant.displayName });

  return (
    <div className="bg-background">
      {jsonLd.map((schema) => (
        <script
          key={schema["@type"] as string}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Dok utakmica traje, stranica se sama osvježava — bez F5 na tribini. */}
      <RefreshWhile active={live} intervalMs={30_000} />

      <MatchHero match={match} />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        <Suspense fallback={null}>
          <MatchTabs
            match={match}
            events={events}
            lineups={lineups}
            info={info}
            standings={standings}
            started={started}
          />
        </Suspense>
      </section>
    </div>
  );
}

/**
 * SportsEvent + BreadcrumbList. `SportsEvent` requires a start time and a
 * location to be valid, so it is emitted only when the match has both —
 * a half-filled item is worse than none.
 */
function buildJsonLd({
  match,
  tenantName,
}: {
  match: Match;
  tenantName: string;
}): Record<string, unknown>[] {
  const home = match.homeTeam?.name ?? "Domaćin";
  const away = match.awayTeam?.name ?? "Gost";
  const slug = buildMatchSlug(match);
  const url = `${BASE_URL}/raspored-i-rezultati/${slug}`;

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Početna",
          item: `${BASE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Raspored i rezultati",
          item: `${BASE_URL}/raspored-i-rezultati`,
        },
        { "@type": "ListItem", position: 3, name: `${home} – ${away}`, item: url },
      ],
    },
  ];

  const facility = match.facility;
  if (match.kickoffAtUtcMs == null || !facility?.name) return schemas;

  const start = new Date(match.kickoffAtUtcMs);
  // 2×45 plus half-time — a defensible endDate; schema.org wants one.
  const end = new Date(start.getTime() + 105 * 60 * 1000);

  const status =
    match.liveStatus === "CANCELED"
      ? "https://schema.org/EventCancelled"
      : match.liveStatus === "POSTPONED"
        ? "https://schema.org/EventPostponed"
        : "https://schema.org/EventScheduled";

  const event: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${home} – ${away}`,
    url,
    sport: "Football",
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    eventStatus: status,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: facility.name,
      address: {
        "@type": "PostalAddress",
        ...(facility.address ? { streetAddress: facility.address } : {}),
        ...(facility.place ? { addressLocality: facility.place } : {}),
        addressCountry: "HR",
      },
    },
    homeTeam: { "@type": "SportsTeam", name: home },
    awayTeam: { "@type": "SportsTeam", name: away },
    organizer: {
      "@type": "SportsOrganization",
      name: tenantName,
      url: BASE_URL,
    },
  };

  if (match.competition?.name) {
    event.superEvent = {
      "@type": "SportsEvent",
      name: match.competition.name,
    };
  }

  const homeScore = match.score.home?.current;
  const awayScore = match.score.away?.current;
  if (homeScore != null && awayScore != null) {
    event.homeScore = { "@type": "QuantitativeValue", value: homeScore };
    event.awayScore = { "@type": "QuantitativeValue", value: awayScore };
  }

  schemas.push(event);
  return schemas;
}
