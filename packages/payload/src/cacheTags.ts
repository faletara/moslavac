import { CLUB_FEATURES } from "./clubFeatures";

// Imena Next cache tagova, na jednom mjestu. Frontend ih piše pri svakom fetchu
// (fetchCollection.ts, getTenant.ts), a CMS ih poništava kad urednik nešto spremi.
// Kad bi se ta dva imena razišla, CMS bi poništavao tag koji nitko ne koristi i
// sadržaj bi i dalje čekao istek TTL-a — zato ovdje, a ne prepisano na dva mjesta.
//
// Bez `server-only`: CMS (Node, bez Next request konteksta) ovo uvozi.

/** `tenants` kolekcija se ne tagira množinom — usp. getTenant.ts. */
const TAG_PREFIX_OVERRIDES = new Map([["tenants", "tenant"]]);

/**
 * Cache tag za jednu kolekciju jednog kluba, npr. `news-sloga-mravince`.
 * Prefiks je `feature` ključ kad se razlikuje od slug-a kolekcije
 * (`board-members` → `board`, `gallery-albums` → `gallery`), točno kako to radi
 * `clubFeatureQuery` — usp. `fetchCollection.ts` (`${tagPrefix ?? collection}-${slug}`).
 */
export function collectionCacheTag(
  collectionSlug: string,
  tenantSlug: string,
): string {
  const override = TAG_PREFIX_OVERRIDES.get(collectionSlug);
  const feature = CLUB_FEATURES.find((item) => item.slug === collectionSlug);

  return `${override ?? feature?.feature ?? collectionSlug}-${tenantSlug}`;
}
