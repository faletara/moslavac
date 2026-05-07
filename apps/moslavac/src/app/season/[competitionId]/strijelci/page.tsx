"use client";

import { useParams } from "next/navigation";
import TopScorersTable from "@/components/features/competition/TopScorersTable";
import { api } from "@/lib/api";

export default function CompetitionScorersPage() {
  const params = useParams();
  const competitionId = Number(params.competitionId);

  const { data: scorers, isLoading } =
    api.competitions.useGetAllCompetitionScorers({
      competitionId,
      enabled: !!competitionId,
    });

  return (
    <TopScorersTable
      scorers={scorers}
      isLoading={isLoading}
      competitionId={competitionId}
    />
  );
}
