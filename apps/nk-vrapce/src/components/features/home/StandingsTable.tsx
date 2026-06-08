import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
 * Tablica seniorske lige (HNS). Redak našeg kluba je istaknut.
 * Renderira se samo ako ima redaka.
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
        <FadeInView delay={0.15}>
          <Link
            href="/seniori"
            className="group hidden items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-brand-blue sm:inline-flex"
          >
            Momčad
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </FadeInView>
      </div>

      <FadeInView delay={0.1} className="mt-8">
        <div className="overflow-hidden border border-line bg-canvas shadow-[0_40px_100px_-60px_rgba(10,28,51,0.5)] ring-1 ring-brand-navy/5">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-brand-navy text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/55">
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
                    className={`group border-t border-line/70 transition-colors ${
                      mine
                        ? "bg-brand-yellow/13"
                        : "odd:bg-surface/40 hover:bg-surface-2"
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
                            : "text-muted-ink"
                        }`}
                      >
                        {row.position ?? "–"}
                      </span>
                    </td>
                    <td className="py-3.5 pl-1 pr-2">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span
                          className={`relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ${
                            mine ? "ring-brand-yellow/60" : "ring-line"
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
                            <span className="text-[0.7rem] font-bold text-muted-ink">
                              {name.charAt(0)}
                            </span>
                          )}
                        </span>
                        <span
                          className={`min-w-0 truncate font-display text-[0.95rem] uppercase tracking-tight sm:text-base ${
                            mine
                              ? "font-extrabold text-brand-navy"
                              : "font-bold text-ink"
                          }`}
                        >
                          {name}
                        </span>
                        {mine && (
                          <span className="ml-auto hidden shrink-0 bg-brand-yellow px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.15em] text-brand-navy sm:inline-block">
                            Naš klub
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden px-2 py-3.5 text-center tabular-nums text-muted-ink sm:table-cell">
                      {row.played ?? "–"}
                    </td>
                    <td className="hidden px-2 py-3.5 text-center tabular-nums text-muted-ink md:table-cell">
                      {row.wins ?? "–"}
                    </td>
                    <td className="hidden px-2 py-3.5 text-center tabular-nums text-muted-ink md:table-cell">
                      {row.draws ?? "–"}
                    </td>
                    <td className="hidden px-2 py-3.5 text-center tabular-nums text-muted-ink md:table-cell">
                      {row.losses ?? "–"}
                    </td>
                    <td className="hidden px-2 py-3.5 text-center tabular-nums text-muted-ink md:table-cell">
                      {row.goalsFor ?? 0}:{row.goalsAgainst ?? 0}
                    </td>
                    <td
                      className={`hidden px-2 py-3.5 text-center font-semibold tabular-nums sm:table-cell ${
                        gd > 0
                          ? "text-emerald-600"
                          : gd < 0
                            ? "text-rose-500"
                            : "text-muted-ink"
                      }`}
                    >
                      {gd > 0 ? `+${gd}` : gd}
                    </td>
                    <td className="py-3.5 pl-2 pr-4 text-center sm:pr-6">
                      <span
                        className={`inline-flex min-w-9 items-center justify-center font-display text-lg font-extrabold tabular-nums ${
                          mine ? "text-brand-navy" : "text-ink"
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

      {/* Mobilni "Momčad" */}
      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          href="/seniori"
          className="group inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-brand-blue"
        >
          Momčad
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
