import type { Metadata } from "next";
import {
  fetchAllCompetitionMatches,
  fetchCurrentSeasonCompetitions,
} from "@/lib/hns/competitions";
import { fetchMatchInfo } from "@/lib/hns/matches";
import { formatDateTime } from "@/lib/helpers/date";
import { BASE_URL } from "@/lib/siteUrl";

interface Params {
  matchId: string;
}

export async function generateStaticParams() {
  const competitions = await fetchCurrentSeasonCompetitions();
  const validComps = competitions.filter(
    (c): c is typeof c & { id: number } => c.id != null,
  );

  const matchResults = await Promise.allSettled(
    validComps.map((c) => fetchAllCompetitionMatches({ competitionId: c.id })),
  );

  const matchIds = new Set<string>();
  for (const result of matchResults) {
    if (result.status === "fulfilled") {
      for (const match of result.value) {
        if (match.id != null && match.allowDetail !== false) {
          matchIds.add(String(match.id));
        }
      }
    }
  }

  return [...matchIds].map((id) => ({ matchId: id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { matchId } = await params;
  const match = await fetchMatchInfo({ matchId: Number(matchId) });

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

  return {
    title,
    description: parts.join(" · "),
    alternates: {
      canonical: `${BASE_URL}/utakmice/${matchId}`,
    },
    openGraph: {
      type: "website",
      title,
      description: parts.join(" · "),
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
  const match = await fetchMatchInfo({ matchId: Number(matchId) });

  if (!match) return <>{children}</>;

  const home = match.homeTeam?.name ?? "Domaćin";
  const away = match.awayTeam?.name ?? "Gost";
  const homeScore = match.homeTeamResult?.current;
  const awayScore = match.awayTeamResult?.current;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${home} – ${away}`,
    sport: "Football",
    homeTeam: { "@type": "SportsTeam", name: home },
    awayTeam: { "@type": "SportsTeam", name: away },
  };

  if (match.dateTimeUTC) {
    jsonLd.startDate = new Date(match.dateTimeUTC).toISOString();
  }
  if (match.competition?.name) {
    jsonLd.superEvent = { "@type": "SportsEvent", name: match.competition.name };
  }
  if (match.facility) {
    jsonLd.location = {
      "@type": "Place",
      name: match.facility.name ?? "Stadion",
      ...(match.facility.address ? { streetAddress: match.facility.address } : {}),
      ...(match.facility.place ? { addressLocality: match.facility.place } : {}),
    };
  }
  if (homeScore != null && awayScore != null) {
    jsonLd.homeScore = { "@type": "QuantitativeValue", value: homeScore };
    jsonLd.awayScore = { "@type": "QuantitativeValue", value: awayScore };
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
        item: `${BASE_URL}/utakmice/${matchId}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
