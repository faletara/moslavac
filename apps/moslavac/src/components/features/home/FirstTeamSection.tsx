import { getCometImageUrl } from "@/lib/hns/imageUrl";
import { fetchSeniorCompetition } from "@/lib/hns/competitions";
import { fetchPlayerDetails } from "@/lib/hns/players";
import { fetchRoster } from "@/lib/payload/getRoster";
import { buildPlayerSlug } from "@/lib/helpers/slug";
import type { RosterEntry } from "@/types/roster";
import FirstTeamCarousel, {
	type FirstLineupPlayer,
} from "./FirstTeamCarousel";

/** Players first (by club display order), staff last. */
function orderRoster(roster: RosterEntry[]): RosterEntry[] {
	return [...roster].sort((a, b) => {
		const aStaff = a.position === "trener";
		const bStaff = b.position === "trener";
		if (aStaff !== bStaff) return aStaff ? 1 : -1;
		if (a.captain !== b.captain) return a.captain ? -1 : 1;
		return a.displayOrder - b.displayOrder;
	});
}

async function resolveCometPictures(
	entries: RosterEntry[],
): Promise<Map<number, string>> {
	const needed = entries.filter(
		(entry) => !entry.photo?.url && entry.personId != null,
	);
	const results = await Promise.all(
		needed.map(async (entry) => {
			const details = await fetchPlayerDetails({
				personId: String(entry.personId),
			}).catch(() => null);
			return [entry.personId, details?.picture ?? null] as const;
		}),
	);
	const map = new Map<number, string>();
	for (const [personId, picture] of results) {
		if (picture) map.set(personId, picture);
	}
	return map;
}

export default async function FirstTeamSection() {
	const [roster, seniorCompetition] = await Promise.all([
		fetchRoster(),
		fetchSeniorCompetition(),
	]);
	const ordered = orderRoster(roster);
	if (ordered.length === 0) return null;

	const cometPictures = await resolveCometPictures(ordered);
	const competitionId = seniorCompetition?.id ?? null;

	const players: FirstLineupPlayer[] = ordered.map((entry) => {
		const cometUuid = cometPictures.get(entry.personId) ?? null;
		const linkable = competitionId != null && entry.position !== "trener";
		return {
			id: entry.id,
			displayName: entry.displayName,
			position: entry.position,
			jerseyNumber: entry.jerseyNumber,
			captain: entry.captain,
			photoUrl:
				entry.photo?.url ?? (cometUuid ? getCometImageUrl(cometUuid) : null),
			href: linkable
				? `/statistika/${buildPlayerSlug({
						personId: entry.personId,
						name: entry.displayName,
					})}/${competitionId}`
				: null,
		};
	});

	const totalPlayers = ordered.filter((e) => e.position !== "trener").length;

	return <FirstTeamCarousel players={players} totalPlayers={totalPlayers} />;
}
