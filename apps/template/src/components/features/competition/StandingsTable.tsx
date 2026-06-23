"use client";

import { HnsCrest } from "@/components/HnsCrest";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTenant } from "@/components/providers/TenantProvider";
import { cn } from "@/lib/utils";
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
	const tenant = useTenant();
	const shortName = tenant.branding?.shortName ?? tenant.displayName;

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
					<tr className="border-b border-border/60 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
						<th className="w-8 py-4 pl-1 text-left font-semibold">#</th>
						<th className="py-4 text-left font-semibold">Klub</th>
						{STAT_COLUMNS.map(({ key, label }) => (
							<th
								key={key}
								className="hidden w-10 py-4 text-center font-semibold sm:table-cell"
							>
								{label}
							</th>
						))}
						<th className="w-16 py-4 text-center font-semibold sm:hidden">
							G
						</th>
						<th className="w-12 py-4 pr-1 text-center font-semibold">B</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-border/40">
					{standings.map((row, i) => {
						const teamName = row.team?.name ?? "";
						const isClub = teamName.includes(shortName);
						const picture = row.team?.picture ?? "";
						return (
							<tr
								key={`${row.team?.id ?? teamName}-${i}`}
								className={cn(
									"text-sm transition-colors",
									isClub ? "bg-muted/40" : "hover:bg-muted/20",
								)}
							>
								<td
									className={cn(
										"py-3 pl-1 text-left tabular-nums",
										isClub
											? "font-semibold"
											: "font-medium text-muted-foreground",
									)}
								>
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
										<span
											className={cn(
												"line-clamp-1",
												isClub ? "font-semibold" : "font-medium",
											)}
										>
											{teamName}
										</span>
									</div>
								</td>
								<td className="hidden py-3 text-center tabular-nums text-muted-foreground sm:table-cell">
									{row.played ?? 0}
								</td>
								<td className="hidden py-3 text-center tabular-nums text-muted-foreground sm:table-cell">
									{row.wins ?? 0}
								</td>
								<td className="hidden py-3 text-center tabular-nums text-muted-foreground sm:table-cell">
									{row.draws ?? 0}
								</td>
								<td className="hidden py-3 text-center tabular-nums text-muted-foreground sm:table-cell">
									{row.losses ?? 0}
								</td>
								<td className="py-3 text-center tabular-nums text-muted-foreground">
									{row.goalsFor ?? 0}:{row.goalsAgainst ?? 0}
								</td>
								<td
									className={cn(
										"py-3 pr-1 text-center tabular-nums",
										isClub ? "font-bold" : "font-semibold",
									)}
								>
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
