"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
	AnimatedCounter,
	FadeInView,
	RevealHeading,
} from "@/components/animations";
import { HnsCrest } from "@/components/HnsCrest";
import {
	useMoslavacTeamId,
	useTenant,
} from "@/components/providers/TenantProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { buildCompetitionSlug, buildPlayerSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { PlayerStats, TeamRanking } from "@/types/hns";

const TOP_SCORERS_LIMIT = 5;
const STANDINGS_SKELETONS = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];
const SCORER_SKELETONS = ["s1", "s2", "s3", "s4", "s5"];

const rowVariants = {
	hidden: { opacity: 0, x: -16 },
	show: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.4,
			ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
		},
	},
};

const listVariants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

function ColumnTitle({ children }: { children: string }) {
	return (
		<RevealHeading
			lines={[children]}
			className="select-none font-display font-black uppercase leading-none"
			lineClassName="text-4xl sm:text-5xl"
		/>
	);
}

function StandingsRow({
	row,
	index,
	isClub,
}: {
	row: TeamRanking;
	index: number;
	isClub: boolean;
}) {
	const teamName = row.team?.name ?? "";
	const picture = row.team?.picture ?? "";
	const position = row.position ?? index + 1;

	return (
		<motion.div
			variants={rowVariants}
			className={cn(
				"grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-3 py-4 sm:grid-cols-[3rem_1fr_3.5rem_4.5rem_3.5rem] sm:gap-5",
				isClub
					? "border-l-2 border-primary bg-primary/10"
					: "border-l-2 border-transparent",
			)}
		>
			<span
				className={cn(
					"font-display font-black tabular-nums leading-none",
					isClub
						? "text-2xl text-primary sm:text-4xl"
						: "text-xl text-muted-foreground sm:text-3xl",
				)}
			>
				{String(position).padStart(2, "0")}
			</span>

			<div className="flex min-w-0 items-center gap-3">
				<HnsCrest
					picture={picture}
					name={teamName}
					size={40}
					className="size-8 shrink-0 sm:size-10"
				/>
				<span
					className={cn(
						"line-clamp-1 uppercase leading-tight tracking-tight",
						isClub
							? "text-sm font-black sm:text-base"
							: "text-xs font-bold text-foreground/80 sm:text-sm",
					)}
				>
					{teamName}
				</span>
			</div>

			<span
				className={cn(
					"hidden text-center tabular-nums sm:block",
					isClub
						? "text-sm font-bold"
						: "text-xs font-medium text-muted-foreground",
				)}
			>
				{row.played ?? 0}
			</span>

			<span
				className={cn(
					"hidden text-center tabular-nums sm:block",
					isClub
						? "text-sm font-bold"
						: "text-xs font-medium text-muted-foreground",
				)}
			>
				{row.goalsFor ?? 0}
				<span className="px-1 text-muted-foreground">:</span>
				{row.goalsAgainst ?? 0}
			</span>

			<AnimatedCounter
				value={row.points ?? 0}
				className={cn(
					"text-right font-display tabular-nums sm:text-center",
					isClub
						? "text-2xl font-black text-primary sm:text-3xl"
						: "text-lg font-bold sm:text-2xl",
				)}
			/>
		</motion.div>
	);
}

function ScorerRow({
	row,
	index,
	isClub,
	isMoslavac,
	competitionId,
}: {
	row: PlayerStats;
	index: number;
	isClub: boolean;
	isMoslavac: boolean;
	competitionId: number;
}) {
	const playerName = row.player?.name ?? "";
	const playerPicture = row.player?.picture ?? "";
	const personId = row.player?.personId ?? null;
	const teamName = row.team?.name ?? "";
	const goals = row.value ?? 0;

	const inner = (
		<motion.div
			variants={rowVariants}
			className={cn(
				"grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-3 py-4 sm:gap-5",
				isClub
					? "border-l-2 border-primary bg-primary/10"
					: "border-l-2 border-transparent",
			)}
		>
			<span
				className={cn(
					"font-display font-black tabular-nums leading-none",
					isClub
						? "text-2xl text-primary sm:text-4xl"
						: "text-xl text-muted-foreground sm:text-3xl",
				)}
			>
				{String(index + 1).padStart(2, "0")}
			</span>

			<div className="flex min-w-0 items-center gap-3">
				<HnsCrest
					picture={playerPicture}
					name={playerName}
					size={44}
					className="size-9 shrink-0 sm:size-11"
				/>
				<div className="flex min-w-0 flex-col gap-1">
					<span
						className={cn(
							"line-clamp-1 uppercase leading-none tracking-tight",
							isClub
								? "text-sm font-black sm:text-base"
								: "text-xs font-bold text-foreground/80 sm:text-sm",
						)}
					>
						{playerName}
					</span>
					{teamName && (
						<span className="line-clamp-1 text-[0.55rem] font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.6rem]">
							{teamName}
						</span>
					)}
				</div>
			</div>

			<AnimatedCounter
				value={goals}
				className={cn(
					"text-right font-display tabular-nums",
					isClub
						? "text-2xl font-black text-primary sm:text-3xl"
						: "text-lg font-bold sm:text-2xl",
				)}
			/>
		</motion.div>
	);

	if (personId && isMoslavac) {
		return (
			<Link
				href={`/statistika/${buildPlayerSlug({ personId, name: playerName })}/${competitionId}`}
				className="block transition-colors duration-300 hover:bg-foreground/5"
			>
				{inner}
			</Link>
		);
	}

	return inner;
}

function LoadingSkeleton() {
	return (
		<section className="dark bg-navy-deep text-foreground">
			<div className="mx-auto w-full max-w-7xl space-y-14 px-4 py-20 sm:py-28">
				<Skeleton className="h-16 w-72" />
				<div className="grid gap-16 xl:grid-cols-[7fr_5fr]">
					<div className="space-y-2">
						{STANDINGS_SKELETONS.map((k) => (
							<Skeleton key={k} className="h-14 w-full" />
						))}
					</div>
					<div className="space-y-2">
						{SCORER_SKELETONS.map((k) => (
							<Skeleton key={k} className="h-16 w-full" />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

/**
 * Sezona — league table and top scorers side by side on the dark scoreboard
 * canvas, replacing the two separate stacked sections.
 */
export default function SeasonDataSection() {
	const tenant = useTenant();
	const moslavacTeamId = useMoslavacTeamId();
	const shortName = tenant.branding?.shortName ?? tenant.displayName;

	const { data: senior, isLoading: seniorLoading } =
		api.competitions.useGetSeniorCompetition();
	const competitionId = senior?.id ?? 0;

	const { data: standings, isLoading: standingsLoading } =
		api.competitions.useGetTeamStandings({
			competitionId,
			enabled: !!competitionId,
		});

	const { data: stats, isLoading: statsLoading } =
		api.competitions.useGetCompetitionGoalStats({
			competitionId,
			enabled: !!competitionId,
		});

	const isLoading =
		seniorLoading || (!!competitionId && (standingsLoading || statsLoading));

	if (isLoading) return <LoadingSkeleton />;

	const hasStandings = !!standings && standings.length > 0;
	const topScorers = (stats ?? []).slice(0, TOP_SCORERS_LIMIT);
	const hasScorers = topScorers.length > 0;

	if (!senior?.id || (!hasStandings && !hasScorers)) return null;

	return (
		<section className="dark relative overflow-hidden bg-navy-deep text-foreground">
			{/* Hollow watermark anchors the section */}
			<span
				aria-hidden
				className="pointer-events-none absolute -right-[2vw] -top-[4vw] select-none font-display font-black uppercase leading-none text-stroke-thin [--text-stroke-color:color-mix(in_oklab,var(--chalk)_10%,transparent)] text-[22vw]"
			>
				Sezona
			</span>

			<div className="relative mx-auto w-full max-w-7xl space-y-14 px-4 py-20 sm:py-28">
				<div className="flex flex-wrap items-end justify-between gap-6 border-b border-foreground/10 pb-8">
					<div className="flex flex-col gap-3">
						<FadeInView delay={0.05}>
							<p className="flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
								<span aria-hidden className="h-px w-8 bg-primary" />
								{senior.name ?? "Prvenstvo"}
							</p>
						</FadeInView>
						<RevealHeading
							lines={["Sezona"]}
							delay={0.1}
							className="select-none font-display font-black uppercase leading-[0.85]"
							lineClassName="text-[16vw] sm:text-7xl md:text-8xl lg:text-9xl"
						/>
					</div>
					<FadeInView delay={0.2}>
						<Link
							href={`/sezona/${buildCompetitionSlug(senior)}`}
							className="group inline-flex items-center gap-3 pb-2 text-xs font-bold uppercase tracking-[0.3em] text-foreground transition-colors hover:text-primary"
						>
							Cijela sezona
							<ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
						</Link>
					</FadeInView>
				</div>

				<div className="grid gap-16 xl:grid-cols-[7fr_5fr] xl:gap-20">
					{hasStandings && (
						<div className="space-y-8">
							<ColumnTitle>Tablica</ColumnTitle>
							<div>
								<div className="grid grid-cols-[2.5rem_1fr_auto] gap-3 border-b border-foreground/10 px-3 pb-3 text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:grid-cols-[3rem_1fr_3.5rem_4.5rem_3.5rem] sm:gap-5">
									<span>#</span>
									<span>Klub</span>
									<span className="hidden text-center sm:block">Ut</span>
									<span className="hidden text-center sm:block">Golovi</span>
									<span className="text-right sm:text-center">Bod</span>
								</div>
								<motion.div
									className="divide-y divide-foreground/[0.06]"
									initial="hidden"
									whileInView="show"
									viewport={{ once: true, margin: "-80px" }}
									variants={listVariants}
								>
									{(standings ?? []).map((row, i) => {
										const teamName = row.team?.name ?? "";
										const isClub =
											!!shortName && teamName.includes(shortName);
										return (
											<StandingsRow
												key={`${row.team?.id ?? teamName}-${i}`}
												row={row}
												index={i}
												isClub={isClub}
											/>
										);
									})}
								</motion.div>
							</div>
						</div>
					)}

					{hasScorers && (
						<div className="space-y-8">
							<ColumnTitle>Strijelci</ColumnTitle>
							<div>
								<div className="grid grid-cols-[2.5rem_1fr_auto] gap-3 border-b border-foreground/10 px-3 pb-3 text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:gap-5">
									<span>#</span>
									<span>Igrač</span>
									<span className="text-right">Golovi</span>
								</div>
								<motion.div
									className="divide-y divide-foreground/[0.06]"
									initial="hidden"
									whileInView="show"
									viewport={{ once: true, margin: "-80px" }}
									variants={listVariants}
								>
									{topScorers.map((row, i) => {
										const teamName = row.team?.name ?? "";
										const isClub =
											!!shortName && teamName.includes(shortName);
										const isMoslavac =
											moslavacTeamId != null &&
											row.team?.id === moslavacTeamId;
										const key = `${row.player?.personId ?? row.player?.name ?? i}-${i}`;
										return (
											<ScorerRow
												key={key}
												row={row}
												index={i}
												isClub={isClub}
												isMoslavac={isMoslavac}
												competitionId={senior.id ?? 0}
											/>
										);
									})}
								</motion.div>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
