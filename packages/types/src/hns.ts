// Raw HNS wire types. Generated from the live HNS OpenAPI spec — see
// scripts/generate-hns-types.mjs (run `pnpm generate:hns-types` to refresh; a
// `git diff` on hns.openapi.ts is our HNS change alarm). Re-exported here so
// consumers keep importing spec-faithful names from `@/types/hns`.
export * from "./hns.openapi";

import type { Match } from "./hns.openapi";

// Not part of the HNS spec: our own next/previous pairing built in fetchMatchSlots.
export interface MatchSlots {
  next: Match | null;
  previous: Match | null;
}
