"use client";

import type { PlayerStats } from "@/types/hns";
import TopScorersTable from "../../competition/TopScorersTable";
import { MatchTabHeading } from "../shared/MatchTabHeading";

interface MatchTopScorersTabProps {
  competitionId: number | null;
  homeTeamId: number | null;
  awayTeamId: number | null;
  scorers: PlayerStats[];
}

export default function MatchTopScorersTab({
  competitionId,
  homeTeamId,
  awayTeamId,
  scorers,
}: MatchTopScorersTabProps) {
  const highlightTeamIds = [homeTeamId, awayTeamId].filter(
    (id): id is number => id != null,
  );

  return (
    <section className="mt-12 sm:mt-16">
      <MatchTabHeading eyebrow="Najbolji" title="Strijelci" />
      <div className="mt-12">
        <TopScorersTable
          scorers={scorers}
          isLoading={false}
          competitionId={competitionId}
          highlightTeamIds={highlightTeamIds}
        />
      </div>
    </section>
  );
}
