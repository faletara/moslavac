import { HnsCrest } from "@/components/HnsCrest";
import { cn } from "@/lib/utils";
import type { TeamRanking } from "@/types/hns";

function goalDiff(row: TeamRanking): number {
  return (row.goalsFor ?? 0) - (row.goalsAgainst ?? 0);
}

const STAT_HEAD = "px-3 py-4 text-center font-semibold sm:px-4";
const STAT_CELL = "px-3 py-4.5 text-center text-base tabular-nums sm:px-4";

interface StandingsTableProps {
  rows: TeamRanking[];
  /**
   * Teams to ring — the two sides of the match being viewed. Our own club keeps
   * the solid red row (driven by `row.highlight`), so on a match page where we
   * are playing, one side reads red and the other reads ringed.
   *
   * This is deliberately separate from `highlight`: that flag is set upstream by
   * comparing against the tenant's *senior* team id, so on a youth competition's
   * table no row is highlighted at all. Passing the match's own team ids means
   * the table always marks the two teams you came to look at.
   */
  ringTeamIds?: (number | null | undefined)[];
}

/**
 * Tablica natjecanja (HNS) — flat editorial redci s hairline linijama, Anton
 * pozicije, redak našeg kluba je puni crveni blok. Čista tablica bez sekcije:
 * naslovnica je omata u `StandingsSection`, match stranica je koristi izravno.
 */
export default function StandingsTable({
  rows,
  ringTeamIds,
}: StandingsTableProps) {
  const ringed = new Set(
    (ringTeamIds ?? []).filter((id): id is number => id != null),
  );

  return (
    <div className="-mx-2 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-160 border-separate border-spacing-y-0.5">
        <thead>
          <tr className="text-[0.64rem] uppercase tracking-[0.22em] text-muted-foreground">
            <th className="w-16 py-3 pl-5 text-left font-semibold">Poz</th>
            <th className="py-3 text-left font-semibold">Klub</th>
            <th className={cn(STAT_HEAD, "w-14")}>OU</th>
            <th className={cn(STAT_HEAD, "hidden w-12 sm:table-cell")}>P</th>
            <th className={cn(STAT_HEAD, "hidden w-12 sm:table-cell")}>N</th>
            <th className={cn(STAT_HEAD, "hidden w-12 sm:table-cell")}>I</th>
            <th className={cn(STAT_HEAD, "hidden w-20 md:table-cell")}>
              Golovi
            </th>
            <th className={cn(STAT_HEAD, "w-16")}>GR</th>
            <th className={cn(STAT_HEAD, "w-16 pr-5 text-club-red")}>Bod</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const name = row.team?.name ?? "—";
            const gd = goalDiff(row);
            const mine = Boolean(row.highlight);
            const ring = !mine && row.team?.id != null && ringed.has(row.team.id);
            const muted = mine ? "text-white/85" : "text-muted-foreground";
            const rowBorder = !mine && "border-b border-foreground/10";
            return (
              <tr
                key={row.team?.id ?? row.position ?? name}
                className={cn(
                  "group transition-colors",
                  mine
                    ? "bg-club-red text-white shadow-[0_18px_44px_-20px_rgba(222,32,37,0.85)]"
                    : "hover:bg-foreground/4",
                  ring && "bg-foreground/5",
                )}
              >
                {/* Pozicija — Anton */}
                <td className={cn("py-4.5 pl-5 pr-1 text-left", rowBorder)}>
                  <span
                    className={cn(
                      "font-display text-xl tabular-nums",
                      mine ? "text-white" : "text-foreground/35",
                    )}
                  >
                    {row.position != null
                      ? String(row.position).padStart(2, "0")
                      : "–"}
                  </span>
                </td>

                {/* Klub */}
                <td className={cn("py-4 pr-4", rowBorder)}>
                  <div className="flex items-center gap-3.5">
                    <HnsCrest
                      picture={row.team?.picture}
                      name={name}
                      size={34}
                      className="size-8 rounded-full bg-white p-0.5 ring-1 ring-black/5 sm:size-8.5"
                    />
                    <span
                      className={cn(
                        "min-w-0 truncate font-display text-lg uppercase tracking-wide sm:text-xl",
                        ring && "text-club-red",
                      )}
                    >
                      {name}
                    </span>
                  </div>
                </td>

                {/* Statistika */}
                <td className={cn(STAT_CELL, muted, rowBorder)}>
                  {row.played ?? "–"}
                </td>
                <td
                  className={cn(STAT_CELL, muted, "hidden sm:table-cell", rowBorder)}
                >
                  {row.wins ?? "–"}
                </td>
                <td
                  className={cn(STAT_CELL, muted, "hidden sm:table-cell", rowBorder)}
                >
                  {row.draws ?? "–"}
                </td>
                <td
                  className={cn(STAT_CELL, muted, "hidden sm:table-cell", rowBorder)}
                >
                  {row.losses ?? "–"}
                </td>
                <td
                  className={cn(STAT_CELL, muted, "hidden md:table-cell", rowBorder)}
                >
                  {row.goalsFor ?? 0}:{row.goalsAgainst ?? 0}
                </td>
                <td
                  className={cn(
                    STAT_CELL,
                    "font-semibold",
                    rowBorder,
                    mine
                      ? "text-white"
                      : gd > 0
                        ? "text-emerald-700"
                        : gd < 0
                          ? "text-club-red"
                          : "text-muted-foreground",
                  )}
                >
                  {gd > 0 ? `+${gd}` : gd}
                </td>
                <td className={cn("py-4.5 pr-5 text-center", rowBorder)}>
                  <span className="font-display text-2xl tabular-nums">
                    {row.points ?? 0}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
