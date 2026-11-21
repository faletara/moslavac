import type { Competition } from "@/types/hns";

export const SCHEDULE_PATH = "/raspored-i-rezultati";

/** Vlastita putanja natjecanja koje nije zadano. */
export function competitionPagePath(competitionId: number): string {
  return `${SCHEDULE_PATH}/natjecanje/${competitionId}`;
}

/**
 * Zadano natjecanje nema vlastitu putanju: ono je sam popis, pa ista stranica
 * ne postoji pod dvije adrese.
 */
export function competitionPath(
  competitionId: number,
  defaultId: number | null,
): string {
  return competitionId === defaultId
    ? SCHEDULE_PATH
    : competitionPagePath(competitionId);
}

type CompetitionWithId = Competition & { id: number };

export type CompetitionRoute =
  | {
      kind: "render";
      selected: CompetitionWithId | null;
      defaultId: number | null;
    }
  | { kind: "redirect"; to: string };

function withId(competitions: Competition[]): CompetitionWithId[] {
  return competitions.filter(
    (competition): competition is CompetitionWithId => competition.id != null,
  );
}

/** Seniorsko natjecanje, inače prvo s id-om. */
function defaultCompetition(
  competitions: CompetitionWithId[],
  seniorFilter: string | null,
): CompetitionWithId | null {
  const senior = seniorFilter
    ? competitions.find((competition) => competition.name?.includes(seniorFilter))
    : undefined;

  return senior ?? competitions[0] ?? null;
}

/** Natjecanja s vlastitom putanjom (sva osim zadanog), za prerender i sitemap. */
export function competitionPageIds({
  competitions,
  seniorFilter,
}: {
  competitions: Competition[];
  seniorFilter: string | null;
}): number[] {
  const valid = withId(competitions);
  const defaultId = defaultCompetition(valid, seniorFilter)?.id ?? null;

  return valid
    .map((competition) => competition.id)
    .filter((id) => id !== defaultId);
}

/**
 * Što prikazati za popis (`requestedId: null`) ili putanju natjecanja. Zadano
 * je seniorsko natjecanje, inače prvo s id-om. Nepoznato natjecanje vraća na
 * popis, kao što je nekad nepoznat `?competitionId=` prikazao zadano, a zadano
 * se ne udvostručuje pod vlastitom putanjom. Kad HNS zakaže, nema po čemu
 * odlučiti, pa stranica javlja nedostupnost umjesto da preusmjeri.
 */
export function resolveCompetitionRoute({
  competitions,
  competitionsOk,
  seniorFilter,
  requestedId,
}: {
  competitions: Competition[];
  competitionsOk: boolean;
  seniorFilter: string | null;
  requestedId: number | null;
}): CompetitionRoute {
  const valid = withId(competitions);
  const fallback = defaultCompetition(valid, seniorFilter);
  const defaultId = fallback?.id ?? null;

  if (requestedId == null || !competitionsOk) {
    return { kind: "render", selected: fallback, defaultId };
  }

  const requested = valid.find((competition) => competition.id === requestedId);

  if (!requested || requested.id === defaultId) {
    return { kind: "redirect", to: SCHEDULE_PATH };
  }

  return { kind: "render", selected: requested, defaultId };
}
