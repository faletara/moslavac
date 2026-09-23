import { notFound } from "next/navigation";
import PlayerStatsBoard, {
  type PlayerStatsData,
} from "@/components/features/players/PlayerStatsBoard";
import PlayerStatsHero from "@/components/features/players/PlayerStatsHero";
import { getCometImageUrl } from "@/lib/hns/imageUrl";
import { fetchPlayerDetails, fetchPlayerStats } from "@/lib/hns/players";
import { fetchRoster } from "@/lib/payload/getRoster";
import { getTenant } from "@/lib/payload/getTenant";
import type { MediaImage } from "@/lib/payload/types";
import { BASE_URL } from "@/lib/siteUrl";
import {
  buildCompetitionSlug,
  buildPlayerSlug,
  parseTrailingId,
} from "@/lib/helpers/slug";
import type { JsonLdNode, PersonJsonLd } from "@/types/jsonld";
import { isPresent } from "@/lib/helpers/present";

interface Props {
  params: Promise<{ playerId: string; competitionId: string }>;
}

export const revalidate = 600;

/** Ime razdvojeno na dio ispred prezimena i samo prezime. */
interface SplitName {
  first: string;
  last: string;
}

function splitName(name: string): SplitName {
  const parts = name.trim().split(/\s+/);

  if (parts.length <= 1) return { first: "", last: parts[0] ?? name };
  const last = parts.pop() ?? name;

  return { first: parts.join(" "), last };
}

function getCrestSrc(logo: MediaImage | null | undefined): string {
  return logo?.url ?? "/crest.png";
}

export default async function PlayerStatsPage({ params }: Props) {
  const { playerId, competitionId } = await params;
  const personId = String(parseTrailingId(playerId));
  const cid = parseTrailingId(competitionId);

  const [playerDetails, playerStats, tenant, roster] = await Promise.all([
    fetchPlayerDetails({ personId }),
    fetchPlayerStats({ personId, competitionId: cid }),
    getTenant(),
    fetchRoster(),
  ]);

  if (!playerDetails) notFound();

  // SEO dedup duplikatnih URL oblika rješava canonical <link> u layout.tsx —
  // bez server-side redirecta koji uzrokuje dupli fetch/flicker pri navigaciji.
  const { first, last } = splitName(playerDetails.name ?? "");
  const crestSrc = getCrestSrc(tenant.branding?.logo);

  // Ista slika kao na izlistu igrača: uploadana fotka iz Payloada ima prednost
  // pred HNS ("Comet") portretom.
  const rosterEntry = roster.find(
    (entry) => String(entry.personId) === personId,
  );

  const photoUrl =
    rosterEntry?.photo?.url ??
    (playerDetails.picture ? getCometImageUrl(playerDetails.picture) : null);

  const shirtNumber = playerDetails.shirtNumber;
  const isCaptain = playerDetails.captain ?? false;

  const eyebrowParts = [
    shirtNumber != null ? `#${String(shirtNumber).padStart(2, "0")}` : null,
    playerDetails.position || null,
    isCaptain ? "Kapetan" : null,
  ].filter(isPresent);

  const subParts = [
    playerDetails.age != null ? `Dob ${playerDetails.age}` : null,
    playerStats?.competition?.name || null,
  ].filter(isPresent);

  const canonical = `${BASE_URL}/statistika/${buildPlayerSlug({
    personId: Number(personId),
    name: playerDetails.name,
  })}/${
    playerStats?.competition
      ? buildCompetitionSlug(playerStats.competition)
      : competitionId
  }`;

  const athlete: PersonJsonLd = {
    "@type": "Person",
    name: playerDetails.name,
    memberOf: {
      "@type": "SportsTeam",
      name: tenant.displayName,
      url: `${BASE_URL}/momcad`,
    },
  };

  if (photoUrl) athlete.image = photoUrl;

  if (playerDetails.position) athlete.jobTitle = playerDetails.position;

  const jsonLd: JsonLdNode[] = [
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
          key={schema["@type"]}
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
