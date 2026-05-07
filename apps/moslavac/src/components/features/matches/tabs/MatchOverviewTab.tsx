"use client";

import type { HnsMatch, HnsMatchEvent, HnsMatchInfo } from "@/types/hns";
import MatchCountdown from "../upcoming/MatchCountdown";
import MatchOfficials from "../upcoming/MatchOfficials";
import VenueLocation from "../upcoming/VenueLocation";
import PlayedMatchSummary from "../played/PlayedMatchSummary";
import EventsTimeline from "./EventsTimeline";

interface MatchOverviewTabProps {
  match: HnsMatch;
  events: HnsMatchEvent[] | undefined;
  refereeData: HnsMatchInfo | undefined;
  refereesLoading: boolean;
}

export default function MatchOverviewTab({
  match,
  events,
  refereeData,
  refereesLoading,
}: MatchOverviewTabProps) {
  const hasResult =
    match.homeTeamResult != null && match.awayTeamResult != null;

  if (hasResult) {
    return (
      <>
        <PlayedMatchSummary
          events={events}
          homeTeamName={match.homeTeam?.name ?? "Domaći"}
          awayTeamName={match.awayTeam?.name ?? "Gosti"}
        />
        <EventsTimeline
          events={events}
          competitionId={match.competition?.id ?? null}
        />
        <MatchOfficials
          refereeData={refereeData}
          isLoading={refereesLoading}
        />
        <VenueLocation facility={match.facility} />
      </>
    );
  }

  return (
    <UpcomingOverview
      match={match}
      refereeData={refereeData}
      refereesLoading={refereesLoading}
    />
  );
}

function UpcomingOverview({
  match,
  refereeData,
  refereesLoading,
}: {
  match: HnsMatch;
  refereeData: HnsMatchInfo | undefined;
  refereesLoading: boolean;
}) {
  return (
    <>
      {match.dateTimeUTC != null && (
        <MatchCountdown dateTimeUTC={match.dateTimeUTC} />
      )}
      <MatchOfficials refereeData={refereeData} isLoading={refereesLoading} />
      <VenueLocation facility={match.facility} />
    </>
  );
}

