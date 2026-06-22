import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { newsQueries } from "./news.client";
import { matchesQueries } from "./matches.client";
import { competitionsQueries } from "./competitions.client";
import { playersQueries } from "./players.client";
import { teamsQueries } from "./teams.client";
import { equipmentQueries } from "./equipment.client";

export const queries = mergeQueryKeys(
  newsQueries,
  matchesQueries,
  competitionsQueries,
  playersQueries,
  teamsQueries,
  equipmentQueries,
);
