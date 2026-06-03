"use client";

import { HnsCrest } from "@/components/HnsCrest";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { TeamRanking } from "@/types/hns";

const STAT_COLUMNS = [
	{ key: "ut", label: "UT" },
	{ key: "p", label: "P" },
	{ key: "n", label: "N" },
	{ key: "i", label: "I" },
	{ key: "g", label: "G" },
] as const;

export default function StandingsTable({
	standings,
}: {
	standings: TeamRanking[] | undefined;
}) {
	if (!standings || standings.length === 0) {
		return (
			<Alert>
				<AlertDescription>Tablica nije dostupna.</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full">
				<thead>
					<tr>
						<th className="w-8 py-4 pl-1 text-left">#</th>
						<th className="py-4 text-left">Klub</th>
						{STAT_COLUMNS.map(({ key, label }) => (
							<th
								key={key}
								className="hidden w-10 py-4 text-center sm:table-cell"
							>
								{label}
							</th>
						))}
						<th className="w-16 py-4 text-center sm:hidden">
							G
						</th>
						<th className="w-12 py-4 pr-1 text-center">B</th>
					</tr>
				</thead>
				<tbody>
					{standings.map((row, i) => {
						const teamName = row.team?.name ?? "";
						const picture = row.team?.picture ?? "";
						return (
							<tr
								key={`${row.team?.id ?? teamName}-${i}`}
							>
								<td className="py-3 pl-1 text-left">
									{row.position ?? i + 1}
								</td>
								<td className="py-3 pr-2">
									<div className="flex items-center gap-3">
										<HnsCrest
											picture={picture}
											name={teamName}
											size={28}
											className="size-7 shrink-0"
										/>
										<span className="line-clamp-1">
											{teamName}
										</span>
									</div>
								</td>
								<td className="hidden py-3 text-center sm:table-cell">
									{row.played ?? 0}
								</td>
								<td className="hidden py-3 text-center sm:table-cell">
									{row.wins ?? 0}
								</td>
								<td className="hidden py-3 text-center sm:table-cell">
									{row.draws ?? 0}
								</td>
								<td className="hidden py-3 text-center sm:table-cell">
									{row.losses ?? 0}
								</td>
								<td className="py-3 text-center">
									{row.goalsFor ?? 0}:{row.goalsAgainst ?? 0}
								</td>
								<td className="py-3 pr-1 text-center">
									{row.points ?? 0}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
