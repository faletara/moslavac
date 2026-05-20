import TopScorersTable from "@/components/features/competition/TopScorersTable";
import { fetchAllCompetitionScorers } from "@/lib/hns/standings";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export default async function CompetitionScorersPage({ params }: Props) {
  const { competitionId } = await params;
  const cid = Number(competitionId);
  const scorers = await fetchAllCompetitionScorers({ competitionId: cid });
  return (
    <TopScorersTable
      scorers={scorers}
      isLoading={false}
      competitionId={cid}
    />
  );
}
