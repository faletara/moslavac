import type { Metadata } from "next";
import { fetchCompetitionInfo } from "@/lib/hns/competitions";
import { fetchPlayerDetails } from "@/lib/hns/players";
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

  const [playerResult, competitionResult] = await Promise.allSettled([
    fetchPlayerDetails({ personId: String(personId) }),
    fetchCompetitionInfo({ competitionId: cid }),
  ]);

  const player =
    playerResult.status === "fulfilled" ? playerResult.value : null;
  const competition =
    competitionResult.status === "fulfilled" ? competitionResult.value : null;

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
