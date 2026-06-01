import type { Metadata } from "next";
import StandingsTable from "@/components/features/competition/StandingsTable";
import { fetchCompetitionInfo } from "@/lib/hns/competitions";
import { fetchTeamStandings } from "@/lib/hns/standings";
import { BASE_URL } from "@/lib/siteUrl";
import { buildCompetitionSlug, parseTrailingId } from "@/lib/slug";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitionId } = await params;
  const info = await fetchCompetitionInfo({
    competitionId: parseTrailingId(competitionId),
  });
  const slug = info ? buildCompetitionSlug(info) : competitionId;
  const name = info?.name ?? "Sezona";
  return {
    title: `Ljestvica – ${name}`,
    description: `Ljestvica i poredak za natjecanje ${name}.`,
    alternates: { canonical: `${BASE_URL}/sezona/${slug}/tablica` },
  };
}

export default async function CompetitionStandingsPage({ params }: Props) {
  const { competitionId } = await params;
  const standings = await fetchTeamStandings({
    competitionId: parseTrailingId(competitionId),
  });
  return <StandingsTable standings={standings} />;
}
