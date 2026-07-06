"use client";

import type { HnsMatch, TeamRanking } from "@/types/hns";
import FormAndStanding from "../upcoming/FormAndStanding";
import HeadToHead from "../upcoming/HeadToHead";

interface MatchFormTabProps {
  match: HnsMatch;
  competitionMatches: HnsMatch[];
  standings: TeamRanking[];
}

export default function MatchFormTab({
  match,
  competitionMatches,
  standings,
}: MatchFormTabProps) {
  const matchId = match.id;
  const homeTeamId = match.homeTeam?.id ?? null;
  const awayTeamId = match.awayTeam?.id ?? null;
  const homeTeamName = match.homeTeam?.name ?? "";
  const awayTeamName = match.awayTeam?.name ?? "";
  const homeTeamPicture = match.homeTeam?.picture ?? null;
  const awayTeamPicture = match.awayTeam?.picture ?? null;

  return (
    <>
      <FormAndStanding
        homeTeamId={homeTeamId}
        awayTeamId={awayTeamId}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
        homeTeamPicture={homeTeamPicture}
        awayTeamPicture={awayTeamPicture}
        competitionMatches={competitionMatches}
        standings={standings}
        isLoading={false}
      />

      {matchId != null && (
        <HeadToHead
          homeTeamId={homeTeamId}
          awayTeamId={awayTeamId}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          competitionMatches={competitionMatches}
          currentMatchId={matchId}
          isLoading={false}
        />
      )}
    </>
  );
}
