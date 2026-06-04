import { useGetPlayers } from "./api_hooks/useGetPlayers";
import { useGetPlayerDetails } from "./api_hooks/useGetPlayerDetails";
import { useGetPlayerStats } from "./api_hooks/useGetPlayerStats";

export const playersApi = {
  useGetPlayers,
  useGetPlayerDetails,
  useGetPlayerStats,
};
