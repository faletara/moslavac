"use client";

import { useParams } from "next/navigation";
import SeasonTabsNav from "@/components/features/competition/SeasonTabsNav";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export default function SeasonLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const params = useParams();
	const competitionId = Number(params.competitionId);

	const { data: info } = api.competitions.useGetCompetitionInfo({
		competitionId,
		enabled: !!competitionId,
	});

	return (
		<div className="container mx-auto mt-12 max-w-5xl px-4 pb-24 sm:mt-16 sm:px-6 lg:px-8">
			<header className="flex flex-col items-center gap-5">
				<p className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
					Sezona
				</p>
				{info?.name ? (
					<h1 className="text-balance text-center font-black uppercase leading-[0.9] tracking-tighter text-4xl sm:text-5xl md:text-6xl">
						{info.name}
					</h1>
				) : (
					<Skeleton className="h-12 w-72 sm:h-16 sm:w-96" />
				)}
			</header>

			<div className="mt-10 sm:mt-14">
				<SeasonTabsNav competitionId={competitionId} />
			</div>

			<div className="mt-10 sm:mt-12">{children}</div>
		</div>
	);
}
