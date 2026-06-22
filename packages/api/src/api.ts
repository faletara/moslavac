import { newsApi } from "./news.client";
import { matchesApi } from "./matches.client";
import { competitionsApi } from "./competitions.client";
import { playersApi } from "./players.client";
import { teamsApi } from "./teams.client";
import { equipmentApi } from "./equipment.client";

export const api = {
  news: newsApi,
  matches: matchesApi,
  competitions: competitionsApi,
  players: playersApi,
  teams: teamsApi,
  equipment: equipmentApi,
};
