import type { Metadata } from "next";
import TopScorersTable from "@/components/features/competition/TopScorersTable";
import { redirectToCanonical } from "@/lib/helpers/canonical";
import { resolveClubCompetitionOr404 } from "@/lib/app-shell/routes/clubScopeRoute";
import { fetchAllCompetitionScorers } from "@/lib/hns/standings";
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
    title: `Strijelci - ${name}`,
    description: `Lista strijelaca za natjecanje ${name}.`,
    alternates: { canonical: `${BASE_URL}/sezona/${slug}/strijelci` },
  };
}

export default async function CompetitionScorersPage({ params }: Props) {
  const { competitionId } = await params;
  const competition = await resolveClubCompetitionOr404(competitionId);

  redirectToCanonical(
    `/sezona/${competitionId}/strijelci`,
    `/sezona/${buildCompetitionSlug(competition)}/strijelci`,
  );

  const scorers = await fetchAllCompetitionScorers({
    competitionId: competition.id,
  });

  return (
    <TopScorersTable
      scorers={scorers}
      isLoading={false}
      competitionId={competition.id}
    />
  );
}
