import CardsTable from "@/components/features/competition/CardsTable";
import {
  fetchAllCompetitionRedCards,
  fetchAllCompetitionYellowCards,
} from "@/lib/hns/standings";
import { parseTrailingId } from "@/lib/slug";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export default async function CompetitionCardsPage({ params }: Props) {
  const { competitionId } = await params;
  const cid = parseTrailingId(competitionId);
  const [yellowCards, redCards] = await Promise.all([
    fetchAllCompetitionYellowCards({ competitionId: cid }),
    fetchAllCompetitionRedCards({ competitionId: cid }),
  ]);
  return (
    <CardsTable
      yellowCards={yellowCards}
      redCards={redCards}
      isLoading={false}
      competitionId={cid}
    />
  );
}
