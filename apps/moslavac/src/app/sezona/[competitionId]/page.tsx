import MatchesList from "@/components/features/competition/MatchesList";
import { fetchCompetitionMatches } from "@/lib/hns/competitions";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export default async function CompetitionMatchesPage({ params }: Props) {
  const { competitionId } = await params;
  const matches = await fetchCompetitionMatches({
    competitionId: Number(competitionId),
  });
  return <MatchesList matches={matches} />;
}
