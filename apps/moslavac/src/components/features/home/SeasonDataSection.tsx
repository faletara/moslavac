import { fetchSeniorCompetition } from "@/lib/hns/competitions";
import {
	fetchCompetitionGoalStats,
	fetchTeamStandings,
} from "@/lib/hns/standings";
import { getTenant } from "@/lib/payload/getTenant";
import SeasonDataView from "./SeasonDataView";

const TOP_SCORERS_LIMIT = 5;

/**
 * Sezona — league table and top scorers side by side on the dark scoreboard
 * canvas, replacing the two separate stacked sections.
 */
export default async function SeasonDataSection() {
	const [tenant, senior] = await Promise.all([
		getTenant(),
		fetchSeniorCompetition(),
	]);

	if (!senior?.id) return null;

	// Parallel — no waterfall between standings and scorers.
	const [standings, stats] = await Promise.all([
		fetchTeamStandings({ competitionId: senior.id }),
		fetchCompetitionGoalStats({ competitionId: senior.id }),
	]);

	const topScorers = stats.slice(0, TOP_SCORERS_LIMIT);
	if (standings.length === 0 && topScorers.length === 0) return null;

	const shortName = tenant.branding?.shortName ?? tenant.displayName;
	const rawTeamId = Number(tenant.hns.teamId);
	const ourTeamId = Number.isFinite(rawTeamId) ? rawTeamId : null;

	return (
		<SeasonDataView
			senior={senior}
			standings={standings}
			topScorers={topScorers}
			shortName={shortName}
			ourTeamId={ourTeamId}
		/>
	);
}
