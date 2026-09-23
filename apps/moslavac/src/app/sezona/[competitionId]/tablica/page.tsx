import type { Metadata } from "next";
import StandingsTable from "@/components/features/competition/StandingsTable";
import { redirectToCanonical } from "@/lib/helpers/canonical";
import { resolveClubCompetitionOr404 } from "@/lib/app-shell/routes/clubScopeRoute";
import { fetchTeamStandings } from "@/lib/hns/standings";
import { BASE_URL } from "@/lib/siteUrl";
import { buildCompetitionSlug } from "@/lib/helpers/slug";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitionId } = await params;
  const competition = await resolveClubCompetitionOr404(competitionId);
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
  const competition = await resolveClubCompetitionOr404(competitionId);

  redirectToCanonical(
    `/sezona/${competitionId}/tablica`,
    `/sezona/${buildCompetitionSlug(competition)}/tablica`,
  );

  const standings = await fetchTeamStandings({
    competitionId: competition.id,
  });

  return <StandingsTable standings={standings} />;
}
