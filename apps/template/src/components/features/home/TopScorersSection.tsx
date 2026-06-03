"use client";

import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import {
	useOurTeamId,
	useTenant,
} from "@/components/providers/TenantProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { buildPlayerSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { PlayerStats } from "@/types/hns";

const TOP_LIMIT = 5;
const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5"];

function SectionHeader({ subtitle }: { subtitle?: string }) {
	return (
		<div className="flex flex-col items-center gap-6">
			<p>Najbolji</p>
			<h2>Strijelci</h2>
			{subtitle && <p>{subtitle}</p>}
		</div>
	);
}

function ScorerRow({
	row,
	index,
	isClub,
	isOurTeam,
	competitionId,
}: {
	row: PlayerStats;
	index: number;
	isClub: boolean;
	isOurTeam: boolean;
	competitionId: number;
}) {
	const playerName = row.player?.name ?? "";
	const playerPicture = row.player?.picture ?? "";
	const personId = row.player?.personId ?? null;
	const teamName = row.team?.name ?? "";
	const goals = row.value ?? 0;
	const rankStr = String(index + 1).padStart(2, "0");

	const inner = (
		<div
			className={cn(
				"relative grid items-center gap-4 py-5 sm:gap-8 sm:py-6",
				"grid-cols-[3rem_1fr_auto] sm:grid-cols-[4rem_1fr_5rem]",
			)}
		>
			{isClub && (
				<span
					aria-hidden
					className="pointer-events-none absolute -left-2 top-1/2 hidden h-10 w-[2px] -translate-y-1/2 sm:block"
				/>
			)}

			<span>{rankStr}</span>

			<div className="flex min-w-0 items-center gap-4">
				<HnsCrest
					picture={playerPicture}
					name={playerName}
					size={48}
					className="size-10 shrink-0 sm:size-12"
				/>
				<div className="flex min-w-0 flex-col gap-1">
					<span className="line-clamp-1">{playerName}</span>
					{teamName && (
						<span className="line-clamp-1">{teamName}</span>
					)}
				</div>
			</div>

			<span className="text-right sm:text-center">{goals}</span>
		</div>
	);

	if (personId && isOurTeam) {
		return (
			<Link
				href={`/statistika/${buildPlayerSlug({ personId, name: playerName })}/${competitionId}`}
				className="-mx-3 block px-3"
			>
				{inner}
			</Link>
		);
	}

	return inner;
}

export default function TopScorersSection() {
	const tenant = useTenant();
	const ourTeamId = useOurTeamId();
	const shortName = tenant.branding?.shortName ?? tenant.displayName;

	const { data: senior, isLoading: seniorLoading } =
		api.competitions.useGetSeniorCompetition();
	const competitionId = senior?.id ?? 0;

	const { data: stats, isLoading: statsLoading } =
		api.competitions.useGetCompetitionGoalStats({
			competitionId,
			enabled: !!competitionId,
		});

	const isLoading = seniorLoading || (!!competitionId && statsLoading);

	if (isLoading) {
		return (
			<section className="mx-auto w-full max-w-5xl space-y-16 px-4 py-8 sm:py-12">
				<SectionHeader />
				<div>
					{SKELETON_KEYS.map((k) => (
						<div
							key={k}
							className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[4rem_1fr_5rem] sm:gap-8 sm:py-6"
						>
							<Skeleton className="h-10 w-12" />
							<div className="flex items-center gap-4">
								<Skeleton className="size-10 sm:size-12" />
								<div className="flex flex-1 flex-col gap-2">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-3 w-24" />
								</div>
							</div>
							<Skeleton className="h-7 w-10 justify-self-end sm:justify-self-center" />
						</div>
					))}
				</div>
			</section>
		);
	}

	if (!senior?.id || !stats || stats.length === 0) return null;

	const top = stats.slice(0, TOP_LIMIT);

	return (
		<section className="mx-auto w-full max-w-5xl space-y-12 px-4 py-8 sm:space-y-16 sm:py-12">
			<SectionHeader subtitle={senior.name ?? undefined} />

			<div>
				<div className="hidden grid-cols-[4rem_1fr_5rem] items-center gap-8 pb-4 sm:grid">
					<span>#</span>
					<span>Igrač</span>
					<span className="text-center">Golovi</span>
				</div>

				<div className="flex items-center justify-between pb-4 sm:hidden">
					<span>Igrač</span>
					<span>Golovi</span>
				</div>

				<div>
					{top.map((row, i) => {
						const teamName = row.team?.name ?? "";
						const isClub = !!shortName && teamName.includes(shortName);
						const isOurTeam =
							ourTeamId != null && row.team?.id === ourTeamId;
						const key = `${row.player?.personId ?? row.player?.name ?? i}-${i}`;
						return (
							<ScorerRow
								key={key}
								row={row}
								index={i}
								isClub={isClub}
								isOurTeam={isOurTeam}
								competitionId={senior.id ?? 0}
							/>
						);
					})}
				</div>
			</div>
		</section>
	);
}
