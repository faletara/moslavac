"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import MatchesList from "@/components/features/competition/MatchesList";

export default function CompetitionMatchesPage() {
	const params = useParams();
	const competitionId = Number(params.competitionId);

	const { data: matches, isLoading } = api.competitions.useGetCompetitionMatches({
		competitionId,
		enabled: !!competitionId,
	});

	if (isLoading) {
		return <Skeleton className="h-112 w-full" />;
	}

	return <MatchesList matches={matches} />;
}
