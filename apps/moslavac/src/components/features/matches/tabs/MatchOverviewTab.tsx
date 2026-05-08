"use client";

import type { HnsMatch, HnsMatchEvent, HnsMatchInfo } from "@/types/hns";
import RichScorersSection from "../played/RichScorersSection";
import VenueLocationHero from "../played/VenueLocationHero";
import MatchCountdown from "../upcoming/MatchCountdown";
import MatchOfficials from "../upcoming/MatchOfficials";
import VenueLocation from "../upcoming/VenueLocation";
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
        <RichScorersSection match={match} events={events} />
        <EventsTimeline match={match} events={events} />
        <MatchOfficials
          refereeData={refereeData}
          isLoading={refereesLoading}
        />
        <VenueLocationHero facility={match.facility} />
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
