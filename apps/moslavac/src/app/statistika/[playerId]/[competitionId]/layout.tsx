import type { Metadata } from "next";
import { fetchCompetitionInfo } from "@/lib/hns/competitions";
import { fetchPlayerDetails } from "@/lib/hns/players";

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

  const [playerResult, competitionResult] = await Promise.allSettled([
    fetchPlayerDetails({ personId: playerId }),
    fetchCompetitionInfo({ competitionId: Number(competitionId) }),
  ]);

  const playerName =
    playerResult.status === "fulfilled" ? playerResult.value?.name : null;
  const competitionName =
    competitionResult.status === "fulfilled"
      ? competitionResult.value?.name
      : null;

  const title = playerName ? `${playerName} – Statistike` : "Statistike igrača";
  const description = [playerName, competitionName].filter(Boolean).join(" · ");

  return { title, description };
}

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
