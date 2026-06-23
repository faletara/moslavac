"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SeasonTabsNavProps {
	competitionSlug: string;
}

export default function SeasonTabsNav({ competitionSlug }: SeasonTabsNavProps) {
	const pathname = usePathname();
	const standingsHref = `/sezona/${competitionSlug}/tablica`;
	const matchesHref = `/sezona/${competitionSlug}`;
	const scorersHref = `/sezona/${competitionSlug}/strijelci`;
	const cardsHref = `/sezona/${competitionSlug}/kartoni`;
	const isStandings = pathname?.endsWith("/tablica") ?? false;
	const isScorers = pathname?.endsWith("/strijelci") ?? false;
	const isCards = pathname?.endsWith("/kartoni") ?? false;
	const isMatches = !isStandings && !isScorers && !isCards;

	const tabs = [
		{ href: matchesHref, label: "Utakmice", active: isMatches },
		{ href: standingsHref, label: "Tablica", active: isStandings },
		{ href: scorersHref, label: "Strijelci", active: isScorers },
		{ href: cardsHref, label: "Kartoni", active: isCards },
	];

	return (
		<div className="mx-auto flex w-full max-w-2xl items-center rounded-full border border-border/60 p-1">
			{tabs.map((tab) => (
				<Link
					key={tab.href}
					href={tab.href}
					prefetch
					className={cn(
						"relative flex flex-1 items-center justify-center rounded-full px-2 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.1em] transition-all sm:px-4 sm:text-xs sm:tracking-[0.3em]",
						tab.active
							? "bg-foreground text-background shadow-sm"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{tab.label}
				</Link>
			))}
		</div>
	);
}
