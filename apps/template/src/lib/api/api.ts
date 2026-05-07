import { newsApi } from "./news/news.api";
import { matchesApi } from "./matches/matches.api";
import { competitionsApi } from "./competitions/competitions.api";
import { playersApi } from "./players/players.api";
import { teamsApi } from "./teams/teams.api";
import { equipmentApi } from "./equipment/equipment.api";

export const api = {
  news: newsApi,
  matches: matchesApi,
  competitions: competitionsApi,
  players: playersApi,
  teams: teamsApi,
  equipment: equipmentApi,
};
