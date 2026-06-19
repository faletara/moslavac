"use client";

import type { HnsMatch, HnsMatchEvent, HnsMatchInfo } from "@/types/hns";
import RichScorersSection from "../played/RichScorersSection";
import MatchInfoCard from "../shared/MatchInfoCard";
import MatchCountdown from "../upcoming/MatchCountdown";
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
}: MatchOverviewTabProps) {
  const hasResult =
    match.homeTeamResult != null && match.awayTeamResult != null;

  return (
    <div className="mt-16 flex flex-col gap-20 sm:mt-20 sm:gap-28">
      {hasResult ? (
        <>
          <RichScorersSection match={match} events={events} />
          <EventsTimeline match={match} events={events} />
        </>
      ) : (
        match.dateTimeUTC != null && (
          <MatchCountdown dateTimeUTC={match.dateTimeUTC} />
        )
      )}
      <MatchInfoCard match={match} refereeData={refereeData} />
    </div>
  );
}
