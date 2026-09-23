import { notFound } from "next/navigation";
import MatchesList from "@/components/features/competition/MatchesList";
import { redirectToCanonical } from "@/lib/helpers/canonical";
import { fetchClubCompetition } from "@/lib/hns/clubScope";
import { fetchCompetitionMatches } from "@/lib/hns/competitions";
import { buildCompetitionSlug, parseTrailingId } from "@/lib/helpers/slug";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export const revalidate = 180;

export default async function CompetitionMatchesPage({ params }: Props) {
  const { competitionId } = await params;
  const cid = parseTrailingId(competitionId);
  const competition = cid == null ? null : await fetchClubCompetition(cid);

  if (!competition) notFound();

  redirectToCanonical(
    `/sezona/${competitionId}`,
    `/sezona/${buildCompetitionSlug(competition)}`,
  );

  const matches = await fetchCompetitionMatches({
    competitionId: competition.id,
  });

  return <MatchesList matches={matches} />;
}
