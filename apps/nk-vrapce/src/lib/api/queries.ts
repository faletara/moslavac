import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { newsQueries } from "./news/news.queries";
import { matchesQueries } from "./matches/matches.queries";
import { competitionsQueries } from "./competitions/competitions.queries";
import { playersQueries } from "./players/players.queries";
import { teamsQueries } from "./teams/teams.queries";
import { equipmentQueries } from "./equipment/equipment.queries";

export const queries = mergeQueryKeys(
  newsQueries,
  matchesQueries,
  competitionsQueries,
  playersQueries,
  teamsQueries,
  equipmentQueries,
);
