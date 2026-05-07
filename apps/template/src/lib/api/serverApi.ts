import { newsServerApi } from "./news/news.serverApi";
import { matchesServerApi } from "./matches/matches.serverApi";
import { competitionsServerApi } from "./competitions/competitions.serverApi";
import { playersServerApi } from "./players/players.serverApi";
import { teamsServerApi } from "./teams/teams.serverApi";
import { equipmentServerApi } from "./equipment/equipment.serverApi";

export const serverApi = {
  news: newsServerApi,
  matches: matchesServerApi,
  competitions: competitionsServerApi,
  players: playersServerApi,
  teams: teamsServerApi,
  equipment: equipmentServerApi,
};
