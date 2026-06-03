"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import { useTenant } from "@/components/providers/TenantProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { buildCompetitionSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { TeamRanking } from "@/types/hns";

const SKELETON_KEYS = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];

function SectionHeader({ subtitle }: { subtitle?: string }) {
	return (
		<div className="flex flex-col items-center gap-6">
			<p>Prvenstvo</p>
			<h2>Tablica</h2>
			{subtitle && <p>{subtitle}</p>}
		</div>
	);
}

function StandingsRow({
	row,
	index,
}: {
	row: TeamRanking;
	index: number;
	isClub: boolean;
}) {
	const teamName = row.team?.name ?? "";
	const picture = row.team?.picture ?? "";
	const position = row.position ?? index + 1;
	const positionStr = String(position).padStart(2, "0");

	return (
		<div
			className={cn(
				"relative grid items-center gap-4 py-5 sm:gap-8 sm:py-6",
				"grid-cols-[3rem_1fr_auto] sm:grid-cols-[4rem_1fr_5rem_5rem_5rem]",
			)}
		>
			<span>{positionStr}</span>

			<div className="flex min-w-0 items-center gap-4">
				<HnsCrest
					picture={picture}
					name={teamName}
					size={44}
					className="size-9 shrink-0 sm:size-11"
				/>
				<span className="line-clamp-1">{teamName}</span>
			</div>

			<span className="hidden sm:block">{row.played ?? 0}</span>

			<span className="hidden sm:block">
				<span>{row.goalsFor ?? 0}</span>
				<span className="px-1">:</span>
				<span>{row.goalsAgainst ?? 0}</span>
			</span>

			<span className="justify-self-end sm:justify-self-center">
				{row.points ?? 0}
			</span>
		</div>
	);
}

export default function LeagueStandingsSection() {
	const tenant = useTenant();
	const shortName = tenant.branding?.shortName ?? tenant.displayName;

	const { data: senior, isLoading: seniorLoading } =
		api.competitions.useGetSeniorCompetition();
	const competitionId = senior?.id ?? 0;

	const { data: standings, isLoading: standingsLoading } =
		api.competitions.useGetTeamStandings({
			competitionId,
			enabled: !!competitionId,
		});

	const isLoading = seniorLoading || (!!competitionId && standingsLoading);

	if (isLoading) {
		return (
			<section className="mx-auto w-full max-w-5xl space-y-16 px-4 py-8 sm:py-12">
				<SectionHeader />
				<div>
					{SKELETON_KEYS.map((k) => (
						<div
							key={k}
							className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[4rem_1fr_5rem_5rem_5rem] sm:gap-8 sm:py-6"
						>
							<Skeleton className="h-10 w-12" />
							<div className="flex items-center gap-4">
								<Skeleton className="size-9 sm:size-11" />
								<Skeleton className="h-4 w-40" />
							</div>
							<Skeleton className="hidden h-4 w-8 justify-self-center sm:block" />
							<Skeleton className="hidden h-4 w-12 justify-self-center sm:block" />
							<Skeleton className="h-7 w-10 justify-self-end sm:justify-self-center" />
						</div>
					))}
				</div>
			</section>
		);
	}

	if (!senior?.id || !standings || standings.length === 0) return null;

	return (
		<section className="mx-auto w-full max-w-5xl space-y-12 px-4 py-8 sm:space-y-16 sm:py-12">
			<SectionHeader subtitle={senior.name ?? undefined} />

			<div>
				<div className="hidden grid-cols-[4rem_1fr_5rem_5rem_5rem] items-center gap-8 pb-4 sm:grid">
					<span>#</span>
					<span>Klub</span>
					<span className="text-center">Ut</span>
					<span className="text-center">Golovi</span>
					<span className="text-center">Bod</span>
				</div>

				<div className="flex items-center justify-between pb-4 sm:hidden">
					<span>Klub</span>
					<span>Bod</span>
				</div>

				<div>
					{standings.map((row, i) => {
						const teamName = row.team?.name ?? "";
						const isClub = !!shortName && teamName.includes(shortName);
						return (
							<StandingsRow
								key={`${row.team?.id ?? teamName}-${i}`}
								row={row}
								index={i}
								isClub={isClub}
							/>
						);
					})}
				</div>
			</div>

			<div className="flex justify-center pt-4">
				<Link
					href={`/sezona/${buildCompetitionSlug(senior)}`}
					className="inline-flex items-center gap-3"
				>
					Cijela sezona
					<ArrowRight className="size-3" />
				</Link>
			</div>
		</section>
	);
}
