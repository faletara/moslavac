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
  // ne iz `fetchCompetitionInfo`: id natjecanja iz URL-a tako nikad ne
  // postaje HNS putanja.
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

  const title = playerName ? `${playerName}: statistika` : "Statistika igrača";

  const description = playerName
    ? `Profil i statistika igrača ${playerName}${
        competitionName ? ` u natjecanju ${competitionName}` : ""
      }: nastupi, golovi, kartoni i minute.`
    : "Profil i statistika igrača.";

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
    openGraph: {
      type: "profile",
      title,
      description,
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
