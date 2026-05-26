import MatchesList from "@/components/features/competition/MatchesList";
import { fetchCompetitionMatches } from "@/lib/hns/competitions";
import { parseTrailingId } from "@/lib/slug";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export const revalidate = 180;

export default async function CompetitionMatchesPage({ params }: Props) {
  const { competitionId } = await params;
  const matches = await fetchCompetitionMatches({
    competitionId: parseTrailingId(competitionId),
  });
  return <MatchesList matches={matches} />;
}
