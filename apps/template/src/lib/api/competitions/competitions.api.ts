import { useGetAllCompetitionMatches } from "./api_hooks/useGetAllCompetitionMatches";
import { useGetAllCompetitionRedCards } from "./api_hooks/useGetAllCompetitionRedCards";
import { useGetAllCompetitionScorers } from "./api_hooks/useGetAllCompetitionScorers";
import { useGetAllCompetitionYellowCards } from "./api_hooks/useGetAllCompetitionYellowCards";
import { useGetCompetitionGoalStats } from "./api_hooks/useGetCompetitionGoalStats";
import { useGetCompetitionInfo } from "./api_hooks/useGetCompetitionInfo";
import { useGetCompetitionMatches } from "./api_hooks/useGetCompetitionMatches";
import { useGetCurrentSeasonCompetitions } from "./api_hooks/useGetCurrentSeasonCompetitions";
import { useGetNextMatch } from "./api_hooks/useGetNextMatch";
import { useGetPreviousMatch } from "./api_hooks/useGetPreviousMatch";
import { useGetSeniorCompetition } from "./api_hooks/useGetSeniorCompetition";
import { useGetTeamStandings } from "./api_hooks/useGetTeamStandings";

export const competitionsApi = {
  useGetAllCompetitionMatches,
  useGetAllCompetitionRedCards,
  useGetAllCompetitionScorers,
  useGetAllCompetitionYellowCards,
  useGetCompetitionGoalStats,
  useGetCompetitionInfo,
  useGetCompetitionMatches,
  useGetCurrentSeasonCompetitions,
  useGetNextMatch,
  useGetPreviousMatch,
  useGetSeniorCompetition,
  useGetTeamStandings,
};
