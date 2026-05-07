"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import StandingsTable from "@/components/features/competition/StandingsTable";

export default function CompetitionStandingsPage() {
	const params = useParams();
	const competitionId = Number(params.competitionId);

	const { data: standings, isLoading } = api.competitions.useGetTeamStandings({
		competitionId,
		enabled: !!competitionId,
	});

	if (isLoading) {
		return <Skeleton className="h-112 w-full" />;
	}

	return <StandingsTable standings={standings} />;
}
