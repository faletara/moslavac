import { notFound } from "next/navigation";
import PlayerStatsBoard, {
  type PlayerStatsData,
} from "@/components/features/players/PlayerStatsBoard";
import PlayerStatsHero from "@/components/features/players/PlayerStatsHero";
import { getCometImageUrl } from "@/lib/api";
import { fetchPlayerDetails, fetchPlayerStats } from "@/lib/hns/players";
import { getTenant } from "@/lib/payload/getTenant";
import type { PayloadMedia } from "@/lib/payload/types";
import { BASE_URL } from "@/lib/siteUrl";
import {
  buildCompetitionSlug,
  buildPlayerSlug,
  parseTrailingId,
} from "@/lib/slug";

interface Props {
  params: Promise<{ playerId: string; competitionId: string }>;
}

export const revalidate = 600;

function splitName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return { first: "", last: parts[0] ?? name };
  const last = parts.pop() as string;
  return { first: parts.join(" "), last };
}

function getCrestSrc(logo: string | PayloadMedia | null | undefined): string {
  if (!logo) return "/crest.png";
  return typeof logo === "string" ? logo : (logo.url ?? "/crest.png");
}

export default async function PlayerStatsPage({ params }: Props) {
  const { playerId, competitionId } = await params;
  const personId = String(parseTrailingId(playerId));
  const cid = parseTrailingId(competitionId);

  const [playerDetails, playerStats, tenant] = await Promise.all([
    fetchPlayerDetails({ personId }),
    fetchPlayerStats({ personId, competitionId: cid }),
    getTenant(),
  ]);

  if (!playerDetails) notFound();

  // SEO dedup duplikatnih URL oblika rješava canonical <link> u layout.tsx —
  // bez server-side redirecta koji uzrokuje dupli fetch/flicker pri navigaciji.
  const { first, last } = splitName(playerDetails.name ?? "");
  const crestSrc = getCrestSrc(tenant.branding?.logo);
  const photoUrl = playerDetails.picture
    ? getCometImageUrl(playerDetails.picture)
    : null;
  const shirtNumber = playerDetails.shirtNumber;
  const isCaptain = playerDetails.captain ?? false;

  const eyebrowParts = [
    shirtNumber != null ? `#${String(shirtNumber).padStart(2, "0")}` : null,
    playerDetails.position || null,
    isCaptain ? "Kapetan" : null,
  ].filter(Boolean) as string[];

  const subParts = [
    playerDetails.age != null ? `Dob ${playerDetails.age}` : null,
    playerStats?.competition?.name || null,
  ].filter(Boolean) as string[];

  const canonical = `${BASE_URL}/statistika/${buildPlayerSlug({
    personId: Number(personId),
    name: playerDetails.name,
  })}/${
    playerStats?.competition
      ? buildCompetitionSlug(playerStats.competition)
      : competitionId
  }`;

  const athlete: Record<string, unknown> = {
    "@type": "Person",
    name: playerDetails.name,
    ...(photoUrl ? { image: photoUrl } : {}),
    ...(playerDetails.position ? { jobTitle: playerDetails.position } : {}),
    memberOf: {
      "@type": "SportsTeam",
      name: tenant.displayName,
      url: `${BASE_URL}/momcad`,
    },
  };

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Početna", item: `${BASE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Momčad",
          item: `${BASE_URL}/momcad`,
        },
        { "@type": "ListItem", position: 3, name: playerDetails.name, item: canonical },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: canonical,
      mainEntity: athlete,
    },
  ];

  const stats: PlayerStatsData = {
    appearances: playerStats?.matchesPlayed ?? 0,
    goals: playerStats?.goals ?? 0,
    yellowCards: playerStats?.yellowCards ?? 0,
    redCards: playerStats?.redCards ?? 0,
    fullMatches: playerStats?.fullMatchesPlayed ?? 0,
    penalties: playerStats?.penalties ?? 0,
    ownGoals: playerStats?.ownGoals ?? 0,
    minutesPlayed: playerStats?.minutesPlayed ?? 0,
    competitionName: playerStats?.competition?.name ?? "",
  };

  return (
    <div className="bg-background pb-20 sm:pb-28">
      {jsonLd.map((schema) => (
        <script
          key={schema["@type"] as string}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <PlayerStatsHero
        firstName={first}
        lastName={last}
        photoUrl={photoUrl}
        crestSrc={crestSrc}
        jerseyNumber={shirtNumber ?? null}
        eyebrowParts={eyebrowParts}
        subParts={subParts}
        backHref="/momcad"
      />

      <div className="mx-auto w-full max-w-6xl px-6 pt-14 sm:pt-20 lg:px-8">
        <PlayerStatsBoard stats={stats} hasStats={Boolean(playerStats)} />
      </div>
    </div>
  );
}
