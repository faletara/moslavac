import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPlayerDetails, fetchPlayerStats } from "@/lib/hns/players";
import { BASE_URL } from "@/lib/siteUrl";
import {
  buildCompetitionSlug,
  buildPlayerSlug,
  parseTrailingId,
} from "@/lib/helpers/slug";

interface Params {
  playerId: string;
  competitionId: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { playerId, competitionId } = await params;
  const personId = parseTrailingId(playerId);
  const cid = parseTrailingId(competitionId);

  if (personId == null || cid == null) notFound();

  // Natjecanje se čita iz igračeve statistike (isti HNS URL kao na stranici),
  // pa id natjecanja iz URL-a nikad ne postaje HNS putanja.
  const [playerResult, statsResult] = await Promise.allSettled([
    fetchPlayerDetails({ personId: String(personId) }),
    fetchPlayerStats({ personId: String(personId), competitionId: cid }),
  ]);

  const player =
    playerResult.status === "fulfilled" ? playerResult.value : null;

  const competition =
    statsResult.status === "fulfilled"
      ? (statsResult.value?.competition ?? null)
      : null;

  const playerName = player?.name ?? null;
  const competitionName = competition?.name ?? null;

  const title = playerName ? `${playerName} - Statistike` : "Statistike igrača";
  const description = [playerName, competitionName].filter(Boolean).join(", ");

  const playerSlug = player
    ? buildPlayerSlug({ personId, name: player.name })
    : playerId;

  const competitionSlug = competition
    ? buildCompetitionSlug(competition)
    : competitionId;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/statistika/${playerSlug}/${competitionSlug}`,
    },
  };
}

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
