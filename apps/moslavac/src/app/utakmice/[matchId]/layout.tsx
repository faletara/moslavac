import type { Metadata } from "next";
import { getCometImageUrl } from "@/lib/api/images";
import {
  fetchAllCompetitionMatches,
  fetchCurrentSeasonCompetitions,
} from "@/lib/hns/competitions";
import { fetchMatchInfo } from "@/lib/hns/matches";
import { formatDateTime } from "@/lib/helpers/date";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";
import { buildMatchSlug, parseTrailingId } from "@/lib/slug";
import type { Match } from "@/types/hns";

interface Params {
  matchId: string;
}

/** Absolute image URL for a match: home-team logo, falling back to the club OG image. */
function matchImageUrl(match: Match): string {
  const picture = match.homeTeam?.picture ?? match.awayTeam?.picture;
  return picture
    ? `${BASE_URL}${getCometImageUrl(picture)}`
    : `${BASE_URL}/naslovna.jpg`;
}

export async function generateStaticParams() {
  const competitions = await fetchCurrentSeasonCompetitions();
  const validComps = competitions.filter(
    (c): c is typeof c & { id: number } => c.id != null,
  );

  const matchResults = await Promise.allSettled(
    validComps.map((c) => fetchAllCompetitionMatches({ competitionId: c.id })),
  );

  const slugs = new Set<string>();
  for (const result of matchResults) {
    if (result.status === "fulfilled") {
      for (const match of result.value) {
        if (match.id != null && match.allowDetail !== false) {
          slugs.add(buildMatchSlug(match));
        }
      }
    }
  }

  return [...slugs].map((matchId) => ({ matchId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { matchId } = await params;
  const match = await fetchMatchInfo({ matchId: parseTrailingId(matchId) });

  if (!match) return { title: "Utakmica" };

  const home = match.homeTeam?.name ?? "Domaćin";
  const away = match.awayTeam?.name ?? "Gost";
  const homeScore = match.homeTeamResult?.current;
  const awayScore = match.awayTeamResult?.current;
  const hasResult = homeScore != null && awayScore != null;

  const title = hasResult
    ? `${home} ${homeScore}:${awayScore} ${away}`
    : `${home} – ${away}`;

  const { date } = formatDateTime(match.dateTimeUTC ?? 0);
  const parts = [
    match.competition?.name,
    date,
    match.facility?.place,
  ].filter(Boolean);
  const description = parts.join(" · ");

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/utakmice/${buildMatchSlug(match)}`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: matchImageUrl(match), alt: `${home} – ${away}` }],
    },
  };
}

export default async function MatchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { matchId } = await params;
  // fetch is deduplicated with generateMetadata's call (same URL + cache key)
  const [match, tenant] = await Promise.all([
    fetchMatchInfo({ matchId: parseTrailingId(matchId) }),
    getTenant(),
  ]);

  if (!match) return <>{children}</>;

  const home = match.homeTeam?.name ?? "Domaćin";
  const away = match.awayTeam?.name ?? "Gost";
  const homeScore = match.homeTeamResult?.current;
  const awayScore = match.awayTeamResult?.current;

  // schema.org Event requires both startDate and location. Only emit the
  // SportsEvent when both are present, so we never produce an invalid item.
  const facility = match.facility;

  let jsonLd: Record<string, unknown> | null = null;
  if (match.dateTimeUTC != null && facility?.name) {
    const start = new Date(match.dateTimeUTC);
    // Football matches run ~105 min (2×45 + half-time); a reasonable endDate.
    const end = new Date(start.getTime() + 105 * 60 * 1000);

    const { date } = formatDateTime(match.dateTimeUTC);
    const description = [match.competition?.name, date, facility.place]
      .filter(Boolean)
      .join(" · ");

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: `${home} – ${away}`,
      sport: "Football",
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      eventStatus: "https://schema.org/EventScheduled",
      ...(description ? { description } : {}),
      image: [matchImageUrl(match)],
      location: {
        "@type": "Place",
        name: facility.name ?? "Stadion",
        address: {
          "@type": "PostalAddress",
          ...(facility.address ? { streetAddress: facility.address } : {}),
          ...(facility.place ? { addressLocality: facility.place } : {}),
          addressCountry: "HR",
        },
      },
      homeTeam: { "@type": "SportsTeam", name: home },
      awayTeam: { "@type": "SportsTeam", name: away },
      performer: [
        { "@type": "SportsTeam", name: home },
        { "@type": "SportsTeam", name: away },
      ],
      organizer: {
        "@type": "SportsOrganization",
        name: tenant.displayName,
        url: BASE_URL,
      },
    };

    if (match.competition?.name) {
      jsonLd.superEvent = {
        "@type": "SportsEvent",
        name: match.competition.name,
      };
    }
    if (homeScore != null && awayScore != null) {
      jsonLd.homeScore = { "@type": "QuantitativeValue", value: homeScore };
      jsonLd.awayScore = { "@type": "QuantitativeValue", value: awayScore };
    }
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Početna", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Utakmice", item: `${BASE_URL}/utakmice` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${home} – ${away}`,
        item: `${BASE_URL}/utakmice/${buildMatchSlug(match)}`,
      },
    ],
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
