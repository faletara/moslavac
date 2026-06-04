import { useGetAllMatches } from "./api_hooks/useGetAllMatches";
import { useGetUpcomingMatches } from "./api_hooks/useGetUpcomingMatches";
import { useGetMatchInfo } from "./api_hooks/useGetMatchInfo";
import { useGetMatchEvents } from "./api_hooks/useGetMatchEvents";
import { useGetMatchLineups } from "./api_hooks/useGetMatchLineups";
import { useGetMatchReferees } from "./api_hooks/useGetMatchReferees";

export const matchesApi = {
  useGetAllMatches,
  useGetUpcomingMatches,
  useGetMatchInfo,
  useGetMatchEvents,
  useGetMatchLineups,
  useGetMatchReferees,
};
