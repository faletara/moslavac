"use client";

import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCometImageUrl } from "@/lib/api";
import { formatDateTime } from "@/lib/helpers/date";
import { cn } from "@/lib/utils";
import type { HnsMatch } from "@/types/hns";

function teamInitials(name: string) {
	return (
		name
			.split(/\s+/)
			.map((p) => p[0] ?? "")
			.join("")
			.slice(0, 3)
			.toUpperCase() || name.slice(0, 2).toUpperCase()
	);
}

function TeamCrest({ name, picture }: { name: string; picture: string }) {
	return (
		<Avatar className="size-9 shrink-0 sm:size-11">
			{picture && (
				<AvatarImage src={getCometImageUrl(picture)} alt={name} />
			)}
			<AvatarFallback className="bg-transparent text-[0.55rem] font-semibold uppercase tracking-wider text-muted-foreground">
				{teamInitials(name)}
			</AvatarFallback>
		</Avatar>
	);
}

function TeamSide({
	name,
	picture,
	align,
}: {
	name: string;
	picture: string;
	align: "left" | "right";
}) {
	const isRight = align === "right";
	const text = (
		<span
			className={cn(
				"line-clamp-2 text-xs font-semibold uppercase leading-tight tracking-[0.12em] sm:text-sm sm:tracking-[0.15em]",
				isRight ? "text-right" : "text-left",
			)}
		>
			{name}
		</span>
	);
	const crest = <TeamCrest name={name} picture={picture} />;

	return (
		<div
			className={cn(
				"flex min-w-0 flex-1 items-center gap-3 sm:gap-4",
				isRight && "justify-end",
			)}
		>
			{isRight ? (
				<>
					{text}
					{crest}
				</>
			) : (
				<>
					{crest}
					{text}
				</>
			)}
		</div>
	);
}

function isPlayed(match: HnsMatch) {
	return match.homeTeamResult != null && match.awayTeamResult != null;
}

function MatchRow({ match }: { match: HnsMatch }) {
	const { date, time } = formatDateTime(match.dateTimeUTC ?? 0);
	const hasResult = isPlayed(match);

	return (
		<li>
			<Link
				href={`/utakmice/${match.id}`}
				className="group grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-1 py-5 transition-colors hover:bg-muted/30 sm:gap-8 sm:py-6"
			>
				<TeamSide
					name={match.homeTeam?.name ?? "N/A"}
					picture={match.homeTeam?.picture ?? ""}
					align="right"
				/>

				<div className="flex min-w-20 flex-col items-center gap-1.5 sm:min-w-28">
					{hasResult ? (
						<span className="text-2xl font-black uppercase leading-none tracking-tighter tabular-nums sm:text-3xl">
							{match.homeTeamResult?.current ?? 0}
							<span className="px-1.5 text-muted-foreground/60">-</span>
							{match.awayTeamResult?.current ?? 0}
						</span>
					) : (
						<span className="text-xl font-black uppercase leading-none tracking-tighter tabular-nums sm:text-2xl">
							{time}
						</span>
					)}
					<span className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
						{date}
					</span>
				</div>

				<TeamSide
					name={match.awayTeam?.name ?? "N/A"}
					picture={match.awayTeam?.picture ?? ""}
					align="left"
				/>
			</Link>
		</li>
	);
}

function MatchSection({
	label,
	matches,
}: {
	label: string;
	matches: HnsMatch[];
}) {
	if (matches.length === 0) return null;
	return (
		<section>
			<h2 className="border-b border-border/60 pb-3 text-center text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
				{label}
			</h2>
			<ul className="divide-y divide-border/60">
				{matches.map((match, i) => (
					<MatchRow key={match.id ?? `${label}-${i}`} match={match} />
				))}
			</ul>
		</section>
	);
}

export default function MatchesList({
	matches,
}: {
	matches: HnsMatch[] | undefined;
}) {
	if (!matches || matches.length === 0) {
		return (
			<Alert>
				<AlertDescription>Nema utakmica.</AlertDescription>
			</Alert>
		);
	}

	const played = matches
		.filter(isPlayed)
		.sort((a, b) => (b.dateTimeUTC ?? 0) - (a.dateTimeUTC ?? 0));
	const upcoming = matches
		.filter((m) => !isPlayed(m))
		.sort((a, b) => (a.dateTimeUTC ?? 0) - (b.dateTimeUTC ?? 0));

	return (
		<div className="space-y-12 sm:space-y-16">
			<MatchSection label="Odigrane" matches={played} />
			<MatchSection label="Sljedeće" matches={upcoming} />
		</div>
	);
}
