import Image from "next/image";
import { FadeInView } from "@/components/animations";
import type { TeamRanking } from "@/types/hns";

interface StandingsTableProps {
  rows: TeamRanking[];
}

function goalDiff(row: TeamRanking): number {
  return (row.goalsFor ?? 0) - (row.goalsAgainst ?? 0);
}

function teamLogo(row: TeamRanking): string | null {
  const pic = row.team?.picture;
  return pic ? `/api/images/${pic}` : null;
}

/**
 * Tablica seniorske lige (HNS). Tamna premium kartica — redak našeg kluba je
 * žuto istaknut. Renderira se samo ako ima redaka.
 */
export function StandingsTable({ rows }: StandingsTableProps) {
  if (rows.length === 0) return null;

  return (
    <section className="relative isolate mx-auto w-full max-w-6xl px-6 sm:px-10">
      {/* Editorial header */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div className="flex flex-col gap-3">
          <FadeInView delay={0.1}>
            <h2 className="flex items-center gap-3 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tight text-ink sm:text-5xl">
              <span className="h-9 w-1 rounded-full bg-brand-yellow sm:h-12" />
              Tablica
            </h2>
          </FadeInView>
        </div>
      </div>

      <FadeInView delay={0.1} className="mt-8">
        <div className="overflow-hidden border border-white/10 bg-brand-navy shadow-[0_40px_100px_-50px_rgba(10,28,51,0.8)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-black/30 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">
                <th className="w-12 py-4 pl-4 pr-1 text-center sm:w-14 sm:pl-6">
                  #
                </th>
                <th className="py-4 pl-1 pr-2 text-left">Klub</th>
                <th className="hidden w-12 px-2 py-4 text-center sm:table-cell">
                  OU
                </th>
                <th className="hidden w-10 px-2 py-4 text-center md:table-cell">
                  P
                </th>
                <th className="hidden w-10 px-2 py-4 text-center md:table-cell">
                  N
                </th>
                <th className="hidden w-10 px-2 py-4 text-center md:table-cell">
                  I
                </th>
                <th className="hidden w-16 px-2 py-4 text-center md:table-cell">
                  Golovi
                </th>
                <th className="hidden w-12 px-2 py-4 text-center sm:table-cell">
                  GR
                </th>
                <th className="w-16 py-4 pl-2 pr-4 text-center text-brand-yellow sm:pr-6">
                  Bod
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const logo = teamLogo(row);
                const name = row.team?.name ?? "—";
                const gd = goalDiff(row);
                const mine = Boolean(row.highlight);
                return (
                  <tr
                    key={row.team?.id ?? row.position ?? name}
                    className={`group border-t border-white/5 transition-colors ${
                      mine
                        ? "bg-brand-yellow/15"
                        : "odd:bg-white/3 hover:bg-white/7"
                    }`}
                  >
                    <td
                      className={`relative border-l-[3px] py-3.5 pl-4 pr-1 text-center sm:pl-6 ${
                        mine ? "border-brand-yellow" : "border-transparent"
                      }`}
                    >
                      <span
                        className={`inline-flex size-6.5 items-center justify-center text-xs font-extrabold tabular-nums ${
                          mine
                            ? "bg-brand-yellow text-brand-navy shadow-sm"
                            : "text-white/45"
                        }`}
                      >
                        {row.position ?? "–"}
                      </span>
                    </td>
                    <td className="py-3.5 pl-1 pr-2">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span
                          className={`relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ${
                            mine ? "ring-brand-yellow/60" : "ring-white/15"
                          }`}
                        >
                          {logo ? (
                            <Image
                              src={logo}
                              alt=""
                              width={32}
                              height={32}
                              className="size-8 object-contain p-0.5"
                            />
                          ) : (
                            <span className="text-[0.7rem] font-bold text-brand-navy">
                              {name.charAt(0)}
                            </span>
                          )}
                        </span>
                        <span
                          className={`min-w-0 truncate font-display text-[0.95rem] uppercase tracking-tight sm:text-base ${
                            mine
                              ? "font-extrabold text-brand-yellow"
                              : "font-bold text-white"
                          }`}
                        >
                          {name}
                        </span>
                        </div>
                    </td>
                    <td className="hidden px-2 py-3.5 text-center tabular-nums text-white/55 sm:table-cell">
                      {row.played ?? "–"}
                    </td>
                    <td className="hidden px-2 py-3.5 text-center tabular-nums text-white/55 md:table-cell">
                      {row.wins ?? "–"}
                    </td>
                    <td className="hidden px-2 py-3.5 text-center tabular-nums text-white/55 md:table-cell">
                      {row.draws ?? "–"}
                    </td>
                    <td className="hidden px-2 py-3.5 text-center tabular-nums text-white/55 md:table-cell">
                      {row.losses ?? "–"}
                    </td>
                    <td className="hidden px-2 py-3.5 text-center tabular-nums text-white/55 md:table-cell">
                      {row.goalsFor ?? 0}:{row.goalsAgainst ?? 0}
                    </td>
                    <td
                      className={`hidden px-2 py-3.5 text-center font-semibold tabular-nums sm:table-cell ${
                        gd > 0
                          ? "text-emerald-400"
                          : gd < 0
                            ? "text-rose-400"
                            : "text-white/55"
                      }`}
                    >
                      {gd > 0 ? `+${gd}` : gd}
                    </td>
                    <td className="py-3.5 pl-2 pr-4 text-center sm:pr-6">
                      <span
                        className={`inline-flex min-w-9 items-center justify-center font-display text-lg font-extrabold tabular-nums ${
                          mine ? "text-brand-yellow" : "text-white"
                        }`}
                      >
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
