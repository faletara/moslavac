"use client";

import { api } from "@/lib/api";
import type { HnsMatch } from "@/types/hns";
import FormAndStanding from "./FormAndStanding";
import HeadToHead from "./HeadToHead";
import MatchCountdown from "./MatchCountdown";
import MatchOfficials from "./MatchOfficials";
import VenueLocation from "./VenueLocation";

interface UpcomingMatchInfoProps {
  match: HnsMatch;
}

export default function UpcomingMatchInfo({ match }: UpcomingMatchInfoProps) {
  const matchId = match.id;
  const competitionId = match.competition?.id ?? null;
  const homeTeamId = match.homeTeam?.id ?? null;
  const awayTeamId = match.awayTeam?.id ?? null;
  const homeTeamName = match.homeTeam?.name ?? "";
  const awayTeamName = match.awayTeam?.name ?? "";
  const homeTeamPicture = match.homeTeam?.picture ?? null;
  const awayTeamPicture = match.awayTeam?.picture ?? null;

  const { data: competitionMatches, isLoading: matchesLoading } =
    api.competitions.useGetAllCompetitionMatches({
      competitionId: competitionId ?? 0,
      enabled: competitionId != null,
    });

  const { data: standings, isLoading: standingsLoading } =
    api.competitions.useGetTeamStandings({
      competitionId: competitionId ?? 0,
      enabled: competitionId != null,
    });

  const { data: refereeData, isLoading: refereesLoading } =
    api.matches.useGetMatchReferees({
      matchId: matchId ?? 0,
      enabled: matchId != null,
    });

  return (
    <>
      {match.dateTimeUTC != null && (
        <MatchCountdown dateTimeUTC={match.dateTimeUTC} />
      )}

      <FormAndStanding
        homeTeamId={homeTeamId}
        awayTeamId={awayTeamId}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
        homeTeamPicture={homeTeamPicture}
        awayTeamPicture={awayTeamPicture}
        competitionMatches={competitionMatches}
        standings={standings}
        isLoading={matchesLoading || standingsLoading}
      />

      {matchId != null && (
        <HeadToHead
          homeTeamId={homeTeamId}
          awayTeamId={awayTeamId}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          competitionMatches={competitionMatches}
          currentMatchId={matchId}
          isLoading={matchesLoading}
        />
      )}

      <MatchOfficials
        refereeData={refereeData}
        isLoading={refereesLoading}
      />

      <VenueLocation facility={match.facility} />
    </>
  );
}
