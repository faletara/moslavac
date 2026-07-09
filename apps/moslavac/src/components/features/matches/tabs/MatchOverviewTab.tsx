"use client";

import type {
  Lineups,
  Match,
  MatchEvent,
  MatchInfo,
  TeamRanking,
} from "@/types/hns";
import MatchLineupSummary from "../MatchLineupSummary";
import MatchInfoCard from "../shared/MatchInfoCard";
import MatchCountdown from "../upcoming/MatchCountdown";
import MatchFormTab from "./MatchFormTab";
import EventsTimeline from "./EventsTimeline";

interface MatchOverviewTabProps {
  match: Match;
  events: MatchEvent[] | undefined;
  lineups: Lineups | undefined;
  refereeData: MatchInfo | undefined;
  refereesLoading: boolean;
  competitionMatches: Match[];
  standings: TeamRanking[];
}

export default function MatchOverviewTab({
  match,
  events,
  lineups,
  refereeData,
  competitionMatches,
  standings,
}: MatchOverviewTabProps) {
  const hasResult =
    match.homeTeamResult != null && match.awayTeamResult != null;

  if (!hasResult) {
    // Pre-match Match Room — countdown, form/standing/H2H, then facts.
    return (
      <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-20 sm:mt-16 sm:gap-28">
        {match.dateTimeUTC != null && (
          <MatchCountdown dateTimeUTC={match.dateTimeUTC} />
        )}
        <MatchFormTab
          match={match}
          competitionMatches={competitionMatches}
          standings={standings}
        />
        <MatchInfoCard match={match} refereeData={refereeData} />
      </div>
    );
  }

  return (
    <div className="mt-12 sm:mt-16">
      <div className="grid gap-12 lg:grid-cols-[20rem_1fr] lg:gap-16 xl:gap-20">
        {/* Lineups companion — desktop only; full lineups live in Postave tab */}
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-24">
            <MatchLineupSummary
              match={match}
              home={lineups?.home ?? null}
              away={lineups?.away ?? null}
            />
          </div>
        </aside>

        <EventsTimeline match={match} events={events} />
      </div>

      <div className="mt-20 sm:mt-28">
        <MatchInfoCard match={match} refereeData={refereeData} />
      </div>
    </div>
  );
}
