"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedLine, FadeInView } from "@/components/animations";
import { useTenant } from "@/components/providers/TenantProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api, getCometImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { TeamRanking } from "@/types/hns";

const SKELETON_KEYS = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];

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
					Prvenstvo
				</p>
			</FadeInView>
			<FadeInView delay={0.1}>
				<h2 className="select-none text-balance font-black uppercase leading-[0.85] tracking-tighter">
					<span className="block text-[14vw] sm:text-6xl md:text-7xl lg:text-8xl">
						Tablica
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
	const initials = teamName
		.split(/\s+/)
		.map((p) => p[0] ?? "")
		.join("")
		.slice(0, 3)
		.toUpperCase();
	const position = row.position ?? index + 1;
	const positionStr = String(position).padStart(2, "0");

	return (
		<motion.div
			variants={rowVariants}
			className={cn(
				"relative grid items-center gap-4 py-5 transition-colors sm:gap-8 sm:py-6",
				"grid-cols-[3rem_1fr_auto] sm:grid-cols-[4rem_1fr_5rem_5rem_5rem]",
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
				{positionStr}
			</span>

			<div className="flex min-w-0 items-center gap-4">
				<Avatar className="size-9 shrink-0 sm:size-11">
					{picture && (
						<AvatarImage src={getCometImageUrl(picture)} alt={teamName} />
					)}
					<AvatarFallback className="bg-transparent text-[0.55rem] font-semibold uppercase tracking-wider text-muted-foreground">
						{initials || teamName.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<span
					className={cn(
						"line-clamp-1 uppercase leading-tight tracking-tight",
						isClub
							? "text-base font-black sm:text-lg"
							: "text-sm font-bold sm:text-base",
					)}
				>
					{teamName}
				</span>
			</div>

			<span
				className={cn(
					"hidden text-center tabular-nums sm:block",
					isClub
						? "text-base font-bold"
						: "text-sm font-medium text-muted-foreground",
				)}
			>
				{row.played ?? 0}
			</span>

			<span
				className={cn(
					"hidden text-center tabular-nums sm:block",
					isClub
						? "text-base font-bold"
						: "text-sm font-medium text-muted-foreground",
				)}
			>
				<span>{row.goalsFor ?? 0}</span>
				<span className="px-1 text-muted-foreground">:</span>
				<span>{row.goalsAgainst ?? 0}</span>
			</span>

			<span
				className={cn(
					"text-right tabular-nums sm:text-center",
					isClub
						? "text-2xl font-black sm:text-3xl"
						: "text-lg font-bold sm:text-2xl",
				)}
			>
				{row.points ?? 0}
			</span>
		</motion.div>
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
				<div className="divide-y divide-border/40">
					{SKELETON_KEYS.map((k) => (
						<div
							key={k}
							className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[4rem_1fr_5rem_5rem_5rem] sm:gap-8 sm:py-6"
						>
							<Skeleton className="h-10 w-12" />
							<div className="flex items-center gap-4">
								<Skeleton className="size-9 rounded-full sm:size-11" />
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
				<div className="hidden grid-cols-[4rem_1fr_5rem_5rem_5rem] items-center gap-8 border-b border-border/60 pb-4 text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:grid">
					<span>#</span>
					<span>Klub</span>
					<span className="text-center">Ut</span>
					<span className="text-center">Golovi</span>
					<span className="text-center">Bod</span>
				</div>

				<div className="flex items-center justify-between border-b border-border/60 pb-4 text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:hidden">
					<span>Klub</span>
					<span>Bod</span>
				</div>

				<motion.div
					className="divide-y divide-border/40"
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "-80px" }}
					variants={{
						hidden: {},
						show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
					}}
				>
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
				</motion.div>
			</div>

			<FadeInView>
				<div className="flex justify-center pt-4">
					<Link
						href={`/season/${senior.id}`}
						className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground transition-colors hover:text-muted-foreground"
					>
						Cijela sezona
						<ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
				</div>
			</FadeInView>
		</section>
	);
}
