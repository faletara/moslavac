import MatchesList from "@/components/features/competition/MatchesList";
import { redirectToCanonical } from "@/lib/helpers/canonical";
import { resolveClubCompetitionOr404 } from "@/lib/app-shell/routes/clubScopeRoute";
import { fetchCompetitionMatches } from "@/lib/hns/competitions";
import { buildCompetitionSlug } from "@/lib/helpers/slug";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export const revalidate = 180;

export default async function CompetitionMatchesPage({ params }: Props) {
  const { competitionId } = await params;
  const competition = await resolveClubCompetitionOr404(competitionId);

  redirectToCanonical(
    `/sezona/${competitionId}`,
    `/sezona/${buildCompetitionSlug(competition)}`,
  );

  const matches = await fetchCompetitionMatches({
    competitionId: competition.id,
  });

  return <MatchesList matches={matches} />;
}
