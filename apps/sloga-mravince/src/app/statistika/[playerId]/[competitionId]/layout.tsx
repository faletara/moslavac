import type { Metadata } from "next";
import { fetchCompetitionInfo } from "@/lib/hns/competitions";
import { fetchPlayerDetails } from "@/lib/hns/players";
import { BASE_URL } from "@/lib/siteUrl";
import {
  buildCompetitionSlug,
  buildPlayerSlug,
  parseTrailingId,
} from "@/lib/slug";

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

  const title = playerName ? `${playerName} — Statistika` : "Statistika igrača";
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
