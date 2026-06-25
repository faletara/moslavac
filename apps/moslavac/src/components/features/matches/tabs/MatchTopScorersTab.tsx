"use client";

import { api } from "@/lib/api";
import TopScorersTable from "../../competition/TopScorersTable";
import { MatchTabHeading } from "../shared/MatchTabHeading";

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
    <section className="mt-12 sm:mt-16">
      <MatchTabHeading eyebrow="Najbolji" title="Strijelci" />
      <div className="mt-12">
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
