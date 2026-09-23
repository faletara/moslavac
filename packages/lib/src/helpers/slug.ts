import type { Match } from "@/types/hns";

/**
 * SEO-friendly URL slugs.
 *
 * The HNS API resolves matches, competitions and players ONLY by numeric id,
 * so those slugs carry the id as the trailing segment (e.g.
 * `nas-klub-dinamo-zagreb-15-11-2024-101087009`) and `parseTrailingId` reads it
 * back out. Bare numeric ids keep working, so old URLs never break.
 */

const CRO = new Map([
  ["č", "c"],
  ["ć", "c"],
  ["đ", "d"],
  ["š", "s"],
  ["ž", "z"],
]);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[čćđšž]/g, (c) => CRO.get(c) ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// HNS ids are 9-10 digits today. 15 digits stays below
// Number.MAX_SAFE_INTEGER, so every accepted id round-trips exactly.
const MAX_ID_DIGITS = 15;

const TRAILING_ID_RE = new RegExp(`(?:^|\\D)(\\d{1,${MAX_ID_DIGITS}})$`);

/**
 * Extracts the trailing run of digits as the entity id, or null when there is
 * no usable id: no trailing digits, a run too long to be an HNS id, or zero.
 * Routes call `notFound()` on null, so a junk slug never reaches HNS.
 */
export function parseTrailingId(slug: string): number | null {
  const m = slug.match(TRAILING_ID_RE);
  const id = m ? Number(m[1]) : 0;

  return id > 0 ? id : null;
}

export function buildMatchSlug(m: Match): string {
  const home = slugify(m.homeTeam?.name ?? "domacin");
  const away = slugify(m.awayTeam?.name ?? "gost");
  let date = "";

  if (m.kickoffAtUtcMs) {
    const d = new Date(m.kickoffAtUtcMs);
    date = `${d.getUTCDate()}-${d.getUTCMonth() + 1}-${d.getUTCFullYear()}`;
  }

  return [home, away, date, m.id].filter(Boolean).join("-");
}

export function buildCompetitionSlug(c: {
  id: number | null;
  name: string | null;
}): string {
  return c.id == null ? "" : `${slugify(c.name ?? "sezona")}-${c.id}`;
}

export function buildPlayerSlug(p: {
  personId: number | null;
  name: string | null;
}): string {
  return p.personId == null ? "" : `${slugify(p.name ?? "igrac")}-${p.personId}`;
}
