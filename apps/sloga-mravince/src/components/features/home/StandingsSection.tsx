import { FadeInView } from "@/components/animations";
import { HnsCrest } from "@/components/HnsCrest";
import { cn } from "@/lib/utils";
import type { TeamRanking } from "@/types/hns";

function goalDiff(row: TeamRanking): number {
  return (row.goalsFor ?? 0) - (row.goalsAgainst ?? 0);
}

const STAT_HEAD = "px-3 py-4 text-center font-semibold sm:px-5";
const STAT_CELL = "px-3 py-5 text-center text-base tabular-nums sm:px-5";

/**
 * Tablica seniorskog natjecanja (HNS) na naslovnici. Čist, premium izgled —
 * redak našeg kluba je pun crveni s bijelim tekstom i zelenom trakom lijevo.
 * Renderira se samo ako ima redaka.
 */
export default function StandingsSection({ rows }: { rows: TeamRanking[] }) {
  if (rows.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <h2 className="flex items-center gap-4 text-3xl font-extrabold uppercase tracking-tight md:text-5xl">
        <span className="h-9 w-1.5 rounded-full bg-club-red md:h-12" />
        Tablica
      </h2>

      <FadeInView className="mt-10 md:mt-12">
        <div className="-mx-2 overflow-x-auto sm:mx-0">
          <table className="w-full min-w-160 border-separate border-spacing-y-1">
            <thead>
              <tr className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                <th className="w-16 py-3 pl-6 text-left font-semibold">#</th>
                <th className="py-3 text-left font-semibold">Klub</th>
                <th className={cn(STAT_HEAD, "w-14")}>OU</th>
                <th className={cn(STAT_HEAD, "hidden w-12 sm:table-cell")}>P</th>
                <th className={cn(STAT_HEAD, "hidden w-12 sm:table-cell")}>N</th>
                <th className={cn(STAT_HEAD, "hidden w-12 sm:table-cell")}>I</th>
                <th className={cn(STAT_HEAD, "hidden w-20 md:table-cell")}>
                  Golovi
                </th>
                <th className={cn(STAT_HEAD, "w-16")}>GR</th>
                <th className={cn(STAT_HEAD, "w-16 pr-6 text-club-red")}>Bod</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const name = row.team?.name ?? "—";
                const gd = goalDiff(row);
                const mine = Boolean(row.highlight);
                const muted = mine ? "text-white/85" : "text-muted-foreground";
                return (
                  <tr
                    key={row.team?.id ?? row.position ?? name}
                    className={cn(
                      "group transition-colors",
                      mine
                        ? "bg-club-red text-white shadow-[0_18px_40px_-24px_rgba(222,32,37,0.9)]"
                        : "hover:bg-muted/50",
                    )}
                  >
                    {/* # + lijeva traka */}
                    <td
                      className={cn(
                        "relative py-5 pl-6 pr-1 text-left",
                        mine
                          ? "rounded-l-2xl"
                          : "rounded-l-xl border-b border-border/70",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-full",
                          mine ? "bg-emerald-400" : "bg-border",
                        )}
                      />
                      <span
                        className={cn(
                          "text-base font-extrabold tabular-nums",
                          mine ? "text-white" : "text-muted-foreground",
                        )}
                      >
                        {row.position ?? "–"}
                      </span>
                    </td>

                    {/* Klub */}
                    <td
                      className={cn(
                        "py-4 pr-4",
                        !mine && "border-b border-border/70",
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <HnsCrest
                          picture={row.team?.picture}
                          name={name}
                          size={34}
                          className="size-8 rounded-full bg-white p-0.5 ring-1 ring-black/5 sm:size-8.5"
                        />
                        <span className="min-w-0 truncate text-base font-bold uppercase tracking-tight sm:text-lg">
                          {name}
                        </span>
                      </div>
                    </td>

                    {/* Statistika */}
                    <td
                      className={cn(STAT_CELL, muted, !mine && "border-b border-border/70")}
                    >
                      {row.played ?? "–"}
                    </td>
                    <td
                      className={cn(STAT_CELL, muted, "hidden sm:table-cell", !mine && "border-b border-border/70")}
                    >
                      {row.wins ?? "–"}
                    </td>
                    <td
                      className={cn(STAT_CELL, muted, "hidden sm:table-cell", !mine && "border-b border-border/70")}
                    >
                      {row.draws ?? "–"}
                    </td>
                    <td
                      className={cn(STAT_CELL, muted, "hidden sm:table-cell", !mine && "border-b border-border/70")}
                    >
                      {row.losses ?? "–"}
                    </td>
                    <td
                      className={cn(STAT_CELL, muted, "hidden md:table-cell", !mine && "border-b border-border/70")}
                    >
                      {row.goalsFor ?? 0}:{row.goalsAgainst ?? 0}
                    </td>
                    <td
                      className={cn(
                        STAT_CELL,
                        "font-semibold",
                        !mine && "border-b border-border/70",
                        mine
                          ? "text-white"
                          : gd > 0
                            ? "text-emerald-600"
                            : gd < 0
                              ? "text-rose-600"
                              : "text-muted-foreground",
                      )}
                    >
                      {gd > 0 ? `+${gd}` : gd}
                    </td>
                    <td
                      className={cn(
                        "py-5 pr-6 text-center",
                        mine
                          ? "rounded-r-2xl"
                          : "rounded-r-xl border-b border-border/70",
                      )}
                    >
                      <span className="text-xl font-extrabold tabular-nums">
                        {row.points ?? 0}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FadeInView>
    </section>
  );
}
