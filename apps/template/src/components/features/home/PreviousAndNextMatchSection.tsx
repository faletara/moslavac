"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api, getCometImageUrl } from "@/lib/api";
import { formatDateTime } from "@/lib/helpers/date";
import type { HnsMatch } from "@/types/hns";

function TeamColumn({ name, picture }: { name: string; picture: string }) {
	return (
		<div className="flex w-2/5 flex-col items-center gap-3">
			<Avatar className="size-20">
				{picture && <AvatarImage src={getCometImageUrl(picture)} alt={name} />}
				<AvatarFallback className="bg-transparent text-xs font-medium text-muted-foreground">
					{name.slice(0, 2).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<span className="line-clamp-2 text-center text-xs font-semibold uppercase tracking-[0.15em]">
				{name}
			</span>
		</div>
	);
}

function MatchBlock({
	label,
	match,
	isToday,
}: {
	label: string;
	match: HnsMatch;
	isToday?: boolean;
}) {
	const { date, time } = formatDateTime(match.dateTimeUTC ?? 0);
	const score =
		match.homeTeamResult && match.awayTeamResult
			? `${match.homeTeamResult.current}  ${match.awayTeamResult.current}`
			: null;

	const meta = [date, time, match.facility?.place].filter(Boolean).join(" · ");

	return (
		<article className="group flex flex-col items-center gap-8 text-center">
			<div className="flex flex-col items-center gap-3">
				<span className="h-px w-12 bg-foreground transition-all duration-300 group-hover:w-24" />
				<p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
					{isToday && (
						<span className="size-1.5 animate-pulse rounded-full bg-foreground" />
					)}
					{label}
				</p>
			</div>

			<div className="flex w-full items-center justify-between gap-4">
				<TeamColumn
					name={match.homeTeam?.name ?? "N/A"}
					picture={match.homeTeam?.picture ?? ""}
				/>
				<span className="text-4xl font-black uppercase leading-none tracking-tighter tabular-nums md:text-6xl">
					{score ?? time}
				</span>
				<TeamColumn
					name={match.awayTeam?.name ?? "N/A"}
					picture={match.awayTeam?.picture ?? ""}
				/>
			</div>

			<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
				{meta}
			</p>
		</article>
	);
}

export default function PreviousAndNextMatchSection() {
	const { data: nextMatch, isLoading: nextLoading } =
		api.competitions.useGetNextMatch();
	const { data: previousMatch, isLoading: prevLoading } =
		api.competitions.useGetPreviousMatch();

	if (nextLoading || prevLoading) {
		return (
			<div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-16">
				{[0, 1].map((i) => (
					<div key={i} className="flex flex-col items-center gap-8">
						<Skeleton className="h-px w-12" />
						<Skeleton className="h-3 w-32" />
						<Skeleton className="h-16 w-3/4" />
						<Skeleton className="h-3 w-48" />
					</div>
				))}
			</div>
		);
	}

	const isNextValid = nextMatch != null && Object.keys(nextMatch).length > 0;
	const isPrevValid =
		previousMatch != null && Object.keys(previousMatch).length > 0;

	if (!isNextValid && !isPrevValid) return null;

	const isToday =
		isPrevValid &&
		previousMatch?.dateTimeUTC != null &&
		new Date(previousMatch.dateTimeUTC).toDateString() ===
			new Date().toDateString();

	return (
		<section className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-16">
			{isPrevValid && previousMatch != null && (
				<Link href={`/matches/${previousMatch.id}`}>
					<MatchBlock
						label={isToday ? "Danas" : "Prethodna utakmica"}
						match={previousMatch}
						isToday={isToday}
					/>
				</Link>
			)}
			{isNextValid && nextMatch != null && (
				<Link href={`/matches/${nextMatch.id}`}>
					<MatchBlock label="Sljedeća utakmica" match={nextMatch} />
				</Link>
			)}
		</section>
	);
}
