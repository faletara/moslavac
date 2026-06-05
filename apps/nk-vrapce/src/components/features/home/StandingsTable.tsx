import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeInView } from "@/components/animations";
import { BrandGlow } from "@/components/ui/BrandGlow";
import type { TeamRanking } from "@/types/hns";

interface StandingsTableProps {
  rows: TeamRanking[];
  competitionName?: string | null;
}

function goalDiff(row: TeamRanking): number {
  return (row.goalsFor ?? 0) - (row.goalsAgainst ?? 0);
}

function teamLogo(row: TeamRanking): string | null {
  const pic = row.team?.picture;
  return pic ? `/api/images/${pic}` : null;
}

/**
 * Tablica seniorske lige (HNS) u svijetlom editorial stilu.
 * Redak našeg kluba je istaknut. Renderira se samo ako ima redaka.
 */
export function StandingsTable({ rows, competitionName }: StandingsTableProps) {
  if (rows.length === 0) return null;

  return (
    <section className="relative isolate mx-auto w-full max-w-6xl px-6 sm:px-10">
      <BrandGlow
        color="yellow"
        intensity={0.12}
        className="-left-[6%] -top-[26%] h-[32vmax] w-[32vmax]"
      />

      {/* Editorial header */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div className="flex flex-col gap-3">
          <FadeInView delay={0.05}>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-blue sm:text-xs">
              {competitionName ?? "Seniori"}
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h2 className="flex items-center gap-3 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-4xl">
              <span className="h-7 w-[3px] rounded-full bg-brand-yellow sm:h-9" />
              Tablica
            </h2>
          </FadeInView>
        </div>
        <FadeInView delay={0.15}>
          <Link
            href="/seniori"
            className="group hidden items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-navy transition-colors hover:text-brand-blue sm:inline-flex"
          >
            Momčad
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </FadeInView>
      </div>

      <FadeInView delay={0.1} className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <th className="w-8 px-2 py-3 text-center font-semibold">#</th>
              <th className="px-2 py-3 text-left font-semibold">Klub</th>
              <th className="w-10 px-2 py-3 text-center font-semibold">OU</th>
              <th className="hidden w-10 px-2 py-3 text-center font-semibold sm:table-cell">
                P
              </th>
              <th className="hidden w-10 px-2 py-3 text-center font-semibold sm:table-cell">
                N
              </th>
              <th className="hidden w-10 px-2 py-3 text-center font-semibold sm:table-cell">
                I
              </th>
              <th className="hidden w-16 px-2 py-3 text-center font-semibold md:table-cell">
                Golovi
              </th>
              <th className="w-12 px-2 py-3 text-center font-semibold">GR</th>
              <th className="w-12 px-2 py-3 text-center font-semibold">Bod</th>
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
                  className={`border-t border-line transition-colors ${
                    mine
                      ? "bg-brand-yellow/12"
                      : "hover:bg-surface-2"
                  }`}
                >
                  <td className="px-2 py-3 text-center">
                    <span
                      className={`inline-flex min-w-6 justify-center font-bold tabular-nums ${
                        mine ? "text-brand-navy" : "text-muted-foreground"
                      }`}
                    >
                      {row.position ?? "–"}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2 ring-1 ring-line">
                        {logo ? (
                          <Image
                            src={logo}
                            alt=""
                            width={28}
                            height={28}
                            className="size-7 object-contain"
                          />
                        ) : (
                          <span className="text-[0.65rem] font-bold text-muted-foreground">
                            {name.charAt(0)}
                          </span>
                        )}
                      </span>
                      <span
                        className={`line-clamp-1 uppercase tracking-tight ${
                          mine
                            ? "font-extrabold text-brand-navy"
                            : "font-semibold text-ink"
                        }`}
                      >
                        {name}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center tabular-nums text-muted-foreground">
                    {row.played ?? "–"}
                  </td>
                  <td className="hidden px-2 py-3 text-center tabular-nums text-muted-foreground sm:table-cell">
                    {row.wins ?? "–"}
                  </td>
                  <td className="hidden px-2 py-3 text-center tabular-nums text-muted-foreground sm:table-cell">
                    {row.draws ?? "–"}
                  </td>
                  <td className="hidden px-2 py-3 text-center tabular-nums text-muted-foreground sm:table-cell">
                    {row.losses ?? "–"}
                  </td>
                  <td className="hidden px-2 py-3 text-center tabular-nums text-muted-foreground md:table-cell">
                    {row.goalsFor ?? 0}:{row.goalsAgainst ?? 0}
                  </td>
                  <td className="px-2 py-3 text-center tabular-nums text-muted-foreground">
                    {gd > 0 ? `+${gd}` : gd}
                  </td>
                  <td className="px-2 py-3 text-center">
                    <span
                      className={`font-display font-extrabold tabular-nums ${
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
      </FadeInView>

      {/* Mobilni "Momčad" */}
      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          href="/seniori"
          className="group inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-navy transition-colors hover:text-brand-blue"
        >
          Momčad
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
