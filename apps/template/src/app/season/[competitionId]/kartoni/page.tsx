"use client";

import { useParams } from "next/navigation";
import CardsTable from "@/components/features/competition/CardsTable";
import { api } from "@/lib/api";

export default function CompetitionCardsPage() {
  const params = useParams();
  const competitionId = Number(params.competitionId);

  const { data: yellowCards, isLoading: yellowLoading } =
    api.competitions.useGetAllCompetitionYellowCards({
      competitionId,
      enabled: !!competitionId,
    });

  const { data: redCards, isLoading: redLoading } =
    api.competitions.useGetAllCompetitionRedCards({
      competitionId,
      enabled: !!competitionId,
    });

  return (
    <CardsTable
      yellowCards={yellowCards}
      redCards={redCards}
      isLoading={yellowLoading || redLoading}
      competitionId={competitionId}
    />
  );
}
