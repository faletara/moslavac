import "server-only";
import { fetchCurrentSeasonCompetitions } from "@/lib/hns/competitions";
import { getSeniorCompetitionFilter } from "@/lib/hns/client";
import { competitionPageIds } from "./competitionRoute";

/**
 * Id-evi natjecanja tekuće sezone osim zadanog. Rok daje pozivatelj, inače bi
 * kraći rok dohvata skratio i njegovu stranicu.
 */
export async function fetchCompetitionPageIds({
  revalidate,
}: {
  revalidate: number;
}): Promise<number[]> {
  const [competitions, seniorFilter] = await Promise.all([
    fetchCurrentSeasonCompetitions({ revalidate }),
    getSeniorCompetitionFilter(),
  ]);

  return competitionPageIds({ competitions, seniorFilter });
}
