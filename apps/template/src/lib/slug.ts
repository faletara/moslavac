import type { HnsMatch } from "@/types/hns";

/**
 * SEO-friendly URL slugs.
 *
 * The HNS API resolves matches, competitions and players ONLY by numeric id,
 * so those slugs carry the id as the trailing segment (e.g.
 * `nk-primjer-dinamo-zagreb-15-11-2024-101087009`) and `parseTrailingId` reads it
 * back out. Bare numeric ids keep working, so old URLs never break.
 */

const CRO: Record<string, string> = {
  č: "c",
  ć: "c",
  đ: "d",
  š: "s",
  ž: "z",
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[čćđšž]/g, (c) => CRO[c])
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Extracts the trailing run of digits as the entity id. */
export function parseTrailingId(slug: string): number {
  const m = slug.match(/(\d+)$/);
  return m ? Number(m[1]) : NaN;
}

export function buildMatchSlug(m: HnsMatch): string {
  const home = slugify(m.homeTeam?.name ?? "domacin");
  const away = slugify(m.awayTeam?.name ?? "gost");
  let date = "";
  if (m.dateTimeUTC) {
    const d = new Date(m.dateTimeUTC);
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
