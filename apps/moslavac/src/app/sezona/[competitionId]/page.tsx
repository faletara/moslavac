import MatchesList from "@/components/features/competition/MatchesList";
import { redirectToCanonical } from "@/lib/helpers/canonical";
import {
  fetchCompetitionInfo,
  fetchCompetitionMatches,
} from "@/lib/hns/competitions";
import { buildCompetitionSlug, parseTrailingId } from "@/lib/helpers/slug";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export const revalidate = 180;

export default async function CompetitionMatchesPage({ params }: Props) {
  const { competitionId } = await params;
  const cid = parseTrailingId(competitionId);
  const [info, matches] = await Promise.all([
    fetchCompetitionInfo({ competitionId: cid }),
    fetchCompetitionMatches({ competitionId: cid }),
  ]);
  if (info) {
    redirectToCanonical(
      `/sezona/${competitionId}`,
      `/sezona/${buildCompetitionSlug(info)}`,
    );
  }
  return <MatchesList matches={matches} />;
}
