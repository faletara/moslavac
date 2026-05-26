import StandingsTable from "@/components/features/competition/StandingsTable";
import { fetchTeamStandings } from "@/lib/hns/standings";
import { parseTrailingId } from "@/lib/slug";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export default async function CompetitionStandingsPage({ params }: Props) {
  const { competitionId } = await params;
  const standings = await fetchTeamStandings({
    competitionId: parseTrailingId(competitionId),
  });
  return <StandingsTable standings={standings} />;
}
