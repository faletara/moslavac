"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SeasonTabsNavProps {
	competitionId: number;
}

export default function SeasonTabsNav({ competitionId }: SeasonTabsNavProps) {
	const pathname = usePathname();
	const standingsHref = `/season/${competitionId}`;
	const matchesHref = `/season/${competitionId}/utakmice`;
	const scorersHref = `/season/${competitionId}/strijelci`;
	const cardsHref = `/season/${competitionId}/kartoni`;
	const isMatches = pathname?.endsWith("/utakmice") ?? false;
	const isScorers = pathname?.endsWith("/strijelci") ?? false;
	const isCards = pathname?.endsWith("/kartoni") ?? false;
	const isStandings = !isMatches && !isScorers && !isCards;

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
						"relative flex flex-1 items-center justify-center rounded-full px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] transition-all sm:text-xs sm:tracking-[0.3em]",
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
