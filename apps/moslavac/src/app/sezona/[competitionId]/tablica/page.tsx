import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StandingsTable from "@/components/features/competition/StandingsTable";
import { redirectToCanonical } from "@/lib/helpers/canonical";
import { fetchClubCompetition } from "@/lib/hns/clubScope";
import { fetchTeamStandings } from "@/lib/hns/standings";
import { BASE_URL } from "@/lib/siteUrl";
import { buildCompetitionSlug, parseTrailingId } from "@/lib/helpers/slug";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitionId } = await params;
  const cid = parseTrailingId(competitionId);
  const competition = cid == null ? null : await fetchClubCompetition(cid);

  if (!competition) notFound();
  const slug = buildCompetitionSlug(competition);
  const name = competition.name;

  return {
    title: `Ljestvica - ${name}`,
    description: `Ljestvica i poredak za natjecanje ${name}.`,
    alternates: { canonical: `${BASE_URL}/sezona/${slug}/tablica` },
  };
}

export default async function CompetitionStandingsPage({ params }: Props) {
  const { competitionId } = await params;
  const cid = parseTrailingId(competitionId);
  const competition = cid == null ? null : await fetchClubCompetition(cid);

  if (!competition) notFound();

  redirectToCanonical(
    `/sezona/${competitionId}/tablica`,
    `/sezona/${buildCompetitionSlug(competition)}/tablica`,
  );

  const standings = await fetchTeamStandings({
    competitionId: competition.id,
  });

  return <StandingsTable standings={standings} />;
}
