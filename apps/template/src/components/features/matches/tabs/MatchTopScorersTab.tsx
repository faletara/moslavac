"use client";

import { api } from "@/lib/api";
import TopScorersTable from "../../competition/TopScorersTable";

interface MatchTopScorersTabProps {
  competitionId: number | null;
  homeTeamId: number | null;
  awayTeamId: number | null;
}

export default function MatchTopScorersTab({
  competitionId,
  homeTeamId,
  awayTeamId,
}: MatchTopScorersTabProps) {
  const { data: scorers, isLoading } =
    api.competitions.useGetAllCompetitionScorers({
      competitionId: competitionId ?? 0,
      enabled: competitionId != null,
    });

  const highlightTeamIds = [homeTeamId, awayTeamId].filter(
    (id): id is number => id != null,
  );

  return (
    <section className="mt-16 pt-12 sm:mt-20">
      <h2 className="text-center">Strijelci</h2>
      <div className="mt-8">
        <TopScorersTable
          scorers={scorers}
          isLoading={isLoading}
          competitionId={competitionId}
          highlightTeamIds={highlightTeamIds}
        />
      </div>
    </section>
  );
}
