"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedLine, FadeInView } from "@/components/animations";
import { useTenant } from "@/components/providers/TenantProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api, getCometImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { PlayerStats } from "@/types/hns";

const TOP_LIMIT = 5;
const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5"];

const rowVariants = {
	hidden: { opacity: 0, x: -16 },
	show: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
	},
};

function SectionHeader({ subtitle }: { subtitle?: string }) {
	return (
		<div className="flex flex-col items-center gap-6 text-center">
			<AnimatedLine className="mx-auto" />
			<FadeInView delay={0.05}>
				<p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
					Najbolji
				</p>
			</FadeInView>
			<FadeInView delay={0.1}>
				<h2 className="select-none text-balance font-black uppercase leading-[0.85] tracking-tighter">
					<span className="block text-[14vw] sm:text-6xl md:text-7xl lg:text-8xl">
						Strijelci
					</span>
				</h2>
			</FadeInView>
			{subtitle && (
				<FadeInView delay={0.15}>
					<p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
						{subtitle}
					</p>
				</FadeInView>
			)}
		</div>
	);
}

function ScorerRow({
	row,
	index,
	isClub,
	competitionId,
}: {
	row: PlayerStats;
	index: number;
	isClub: boolean;
	competitionId: number;
}) {
	const playerName = row.player?.name ?? "";
	const playerPicture = row.player?.picture ?? "";
	const personId = row.player?.personId ?? null;
	const teamName = row.team?.name ?? "";
	const goals = row.value ?? 0;
	const rankStr = String(index + 1).padStart(2, "0");

	const initials = playerName
		.split(/\s+/)
		.map((p) => p[0] ?? "")
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const inner = (
		<motion.div
			variants={rowVariants}
			className={cn(
				"relative grid items-center gap-4 py-5 transition-colors sm:gap-8 sm:py-6",
				"grid-cols-[3rem_1fr_auto] sm:grid-cols-[4rem_1fr_5rem]",
				isClub && "border-y-2 border-foreground",
			)}
		>
			{isClub && (
				<span
					aria-hidden
					className="pointer-events-none absolute -left-2 top-1/2 hidden h-10 w-[2px] -translate-y-1/2 bg-foreground sm:block"
				/>
			)}

			<span
				className={cn(
					"font-black tabular-nums leading-none tracking-tighter",
					isClub
						? "text-3xl text-foreground sm:text-5xl"
						: "text-2xl text-muted-foreground sm:text-4xl",
				)}
			>
				{rankStr}
			</span>

			<div className="flex min-w-0 items-center gap-4">
				<Avatar className="size-10 shrink-0 sm:size-12">
					{playerPicture && (
						<AvatarImage
							src={getCometImageUrl(playerPicture)}
							alt={playerName}
						/>
					)}
					<AvatarFallback className="bg-transparent text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
						{initials || playerName.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="flex min-w-0 flex-col gap-1">
					<span
						className={cn(
							"line-clamp-1 uppercase leading-none tracking-tight",
							isClub
								? "text-base font-black sm:text-lg"
								: "text-sm font-bold sm:text-base",
						)}
					>
						{playerName}
					</span>
					{teamName && (
						<span className="line-clamp-1 text-[0.55rem] font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.65rem]">
							{teamName}
						</span>
					)}
				</div>
			</div>

			<span
				className={cn(
					"text-right tabular-nums sm:text-center",
					isClub
						? "text-2xl font-black sm:text-3xl"
						: "text-lg font-bold sm:text-2xl",
				)}
			>
				{goals}
			</span>
		</motion.div>
	);

	if (personId) {
		return (
			<Link
				href={`/stats/${personId}/${competitionId}`}
				className="block hover:opacity-80"
			>
				{inner}
			</Link>
		);
	}

	return inner;
}

export default function TopScorersSection() {
	const tenant = useTenant();
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
				<div className="divide-y divide-border/40">
					{SKELETON_KEYS.map((k) => (
						<div
							key={k}
							className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[4rem_1fr_5rem] sm:gap-8 sm:py-6"
						>
							<Skeleton className="h-10 w-12" />
							<div className="flex items-center gap-4">
								<Skeleton className="size-10 rounded-full sm:size-12" />
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
				<div className="hidden grid-cols-[4rem_1fr_5rem] items-center gap-8 border-b border-border/60 pb-4 text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:grid">
					<span>#</span>
					<span>Igrač</span>
					<span className="text-center">Golovi</span>
				</div>

				<div className="flex items-center justify-between border-b border-border/60 pb-4 text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:hidden">
					<span>Igrač</span>
					<span>Golovi</span>
				</div>

				<motion.div
					className="divide-y divide-border/40"
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "-80px" }}
					variants={{
						hidden: {},
						show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
					}}
				>
					{top.map((row, i) => {
						const teamName = row.team?.name ?? "";
						const isClub = !!shortName && teamName.includes(shortName);
						const key = `${row.player?.personId ?? row.player?.name ?? i}-${i}`;
						return (
							<ScorerRow
								key={key}
								row={row}
								index={i}
								isClub={isClub}
								competitionId={senior.id ?? 0}
							/>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
