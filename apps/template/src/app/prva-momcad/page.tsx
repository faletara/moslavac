import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
	const tenant = await getTenant();
	return {
		title: "Prva momčad",
		description: `Igrači i stručni stožer prve momčadi ${tenant.displayName}.`,
		alternates: { canonical: "/prva-momcad" },
	};
}
import { FirstTeamHero } from "@/components/features/first-team/FirstTeamHero";
import {
	PlayerGrid,
	PlayerGridItem,
} from "@/components/features/first-team/PlayerGrid";
import { getCometImageUrl } from "@/lib/api";
import { fetchSeniorCompetition } from "@/lib/hns/competitions";
import { fetchPlayerDetails } from "@/lib/hns/players";
import { fetchRoster } from "@/lib/payload/getRoster";
import { getTenant } from "@/lib/payload/getTenant";
import type { RosterEntry, RosterPosition } from "@/types/roster";

const positionOrder: RosterPosition[] = [
	"vratar",
	"obrambeni",
	"vezni",
	"napadac",
	"trener",
];

const positionLabels: Record<RosterPosition, string> = {
	vratar: "Vratari",
	obrambeni: "Obrambeni",
	vezni: "Vezni igrači",
	napadac: "Napadači",
	trener: "Stručni stožer",
};

const positionSingular: Record<RosterPosition, string> = {
	vratar: "Vratar",
	obrambeni: "Obrambeni",
	vezni: "Vezni",
	napadac: "Napadač",
	trener: "Trener",
};

export default async function FirstTeamPage() {
	const [roster, seniorCompetition, tenant] = await Promise.all([
		fetchRoster(),
		fetchSeniorCompetition(),
		getTenant(),
	]);

	const competitionId = seniorCompetition?.id ?? null;

	const grouped = positionOrder.reduce<Record<RosterPosition, RosterEntry[]>>(
		(acc, pos) => {
			acc[pos] = roster
				.filter((entry) => entry.position === pos)
				.sort((a, b) => a.displayOrder - b.displayOrder);
			return acc;
		},
		{
			vratar: [],
			obrambeni: [],
			vezni: [],
			napadac: [],
			trener: [],
		},
	);

	const populatedGroups = positionOrder.filter(
		(pos) => grouped[pos].length > 0,
	);
	const totalPlayers = roster.filter((e) => e.position !== "trener").length;

	const cometNeeded = roster.filter(
		(entry) => !entry.photo?.url && entry.personId != null,
	);
	const cometResults = await Promise.all(
		cometNeeded.map(async (entry) => {
			const details = await fetchPlayerDetails({
				personId: String(entry.personId),
			}).catch(() => null);
			return [entry.personId, details?.picture ?? null] as const;
		}),
	);
	const cometPictureByPersonId = new Map<number, string>();
	for (const [personId, picture] of cometResults) {
		if (picture) cometPictureByPersonId.set(personId, picture);
	}

	return (
		<div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
			<FirstTeamHero
				totalPlayers={totalPlayers}
				clubName={tenant.displayName}
				founded={tenant.branding?.founded ?? null}
			/>

			{populatedGroups.map((pos) => {
				const group = grouped[pos];
				return (
					<section key={pos} className="space-y-12 sm:space-y-16">
						<SectionHeader title={positionLabels[pos]} count={group.length} />
						<PlayerGrid>
							{group.map((entry) => (
								<PlayerGridItem key={entry.id}>
									<PlayerCard
										entry={entry}
										competitionId={competitionId}
										cometPictureUuid={
											cometPictureByPersonId.get(entry.personId) ?? null
										}
									/>
								</PlayerGridItem>
							))}
						</PlayerGrid>
					</section>
				);
			})}
		</div>
	);
}

function SectionHeader({ title, count }: { title: string; count: number }) {
	return (
		<div className="flex items-baseline justify-between gap-6 pb-6">
			<h2>{title}</h2>
		</div>
	);
}

function PlayerCard({
	entry,
	competitionId,
	cometPictureUuid,
}: {
	entry: RosterEntry;
	competitionId: number | null;
	cometPictureUuid: string | null;
}) {
	const photoUrl =
		entry.photo?.url ??
		(cometPictureUuid ? getCometImageUrl(cometPictureUuid) : null);
	const initials = entry.displayName
		.split(/\s+/)
		.map((p) => p[0] ?? "")
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const linkable = competitionId != null && entry.position !== "trener";

	const inner = (
		<article className="flex flex-col gap-5">
			<div className="relative aspect-3/4 w-full overflow-hidden">
				{photoUrl ? (
					<Image
						src={photoUrl}
						alt={entry.displayName}
						fill
						sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 50vw"
						className="object-cover"
					/>
				) : (
					<div className="flex size-full items-center justify-center">
						<span className="select-none">
							{initials}
						</span>
					</div>
				)}

				{entry.captain && (
					<span className="absolute left-3 top-3 inline-flex items-center px-2 py-1">
						Kapetan
					</span>
				)}
			</div>

			<div className="flex items-start gap-4 sm:gap-5">
				{entry.jerseyNumber != null && (
					<span aria-hidden className="select-none">
						{String(entry.jerseyNumber).padStart(2, "0")}
					</span>
				)}
				<div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
					<div className="flex items-center gap-3">
						<span className="h-px w-6" />
						<span>{positionSingular[entry.position]}</span>
					</div>
					<h3 className="line-clamp-2">{entry.displayName}</h3>
				</div>
			</div>
		</article>
	);

	if (linkable && competitionId != null) {
		return (
			<Link
				href={`/statistika/${entry.personId}/${competitionId}`}
				aria-label={`Statistike igrača ${entry.displayName}`}
			>
				{inner}
			</Link>
		);
	}

	return inner;
}
