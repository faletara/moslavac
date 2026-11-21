import "server-only";
import { fetchCurrentSeasonCompetitions } from "@/lib/hns/competitions";
import { getSeniorCompetitionFilter } from "@/lib/hns/client";
import { competitionPagePaths } from "./competition";

/**
 * Putanje natjecanja tekuće sezone osim zadanog. Rok daje pozivatelj, inače bi
 * kraći rok dohvata skratio i njegovu stranicu.
 */
export async function fetchCompetitionPagePaths({
  revalidate,
}: {
  revalidate: number;
}): Promise<string[]> {
  const [competitions, seniorFilter] = await Promise.all([
    fetchCurrentSeasonCompetitions({ revalidate }),
    getSeniorCompetitionFilter(),
  ]);

  return competitionPagePaths({ competitions, seniorFilter });
}
