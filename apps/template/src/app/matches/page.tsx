"use client";

import MatchesCalendar from "@/components/features/matches/MatchesCalendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

function PageTitle() {
	return (
		<h1 className="text-center text-3xl font-black uppercase leading-none tracking-tighter md:text-4xl">
			Raspored utakmica
		</h1>
	);
}

export default function MatchesPage() {
	const { data: matches, isLoading, error } = api.matches.useGetAllMatches();

	if (isLoading) {
		return (
			<section className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12">
				<PageTitle />
				<Skeleton className="h-[600px]" />
			</section>
		);
	}

	if (error) {
		return (
			<section className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12">
				<PageTitle />
				<Alert variant="destructive">
					<AlertDescription>Greška pri učitavanju utakmica.</AlertDescription>
				</Alert>
			</section>
		);
	}

	return (
		<section className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12">
			<PageTitle />
			<MatchesCalendar matches={matches ?? []} />
		</section>
	);
}
