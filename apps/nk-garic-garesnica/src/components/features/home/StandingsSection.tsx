import { FadeInView } from "@/components/animations";
import { HnsCrest } from "@/components/HnsCrest";
import type { TeamRanking } from "@/types/hns";

type StandingsSectionProps = {
  rows: TeamRanking[];
  competition: string | null;
};

/** Koliko ekipa s vrha ide na homepage; ostatak poretka ide na svoju stranicu. */
const TOP_COUNT = 5;

/** Širine stupaca. `table-fixed` ih drži, pa zaglavlje i redci ostaju poravnati.
    Ou i +/- se skrivaju ispod `sm` — `table-cell`, ne `block`, da ćelija ostane
    ćelija. */
const COL_POS = "w-11 sm:w-12";

const COL_NUM = "hidden w-18 text-center sm:table-cell";

const COL_PTS = "w-18 text-right sm:w-22";

/** Ista meka, slojevita sjena kao kod ostalih kartica na naslovnici. */
const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_36px_-22px_rgba(15,23,42,0.35)]";

function goalDiff(row: TeamRanking): string {
  const diff = row.goalsFor - row.goalsAgainst;

  return diff > 0 ? `+${diff}` : String(diff);
}

/**
 * Redak poretka. Garićev je zaobljeni royal blok umetnut unutar kartice
 * (isti motiv kao "tile" na karticama rezultata) umjesto pune trake preko
 * cijele širine — ostali redci nemaju rubove, samo razmak i hover.
 */
function StandingsRow({ row, index }: { row: TeamRanking; index: number }) {
  const me = row.highlight;
  // Radijus ide na rubne ćelije — `border-radius` na <tr> ne renda se.
  const cell = `py-4 align-middle sm:py-5 ${me ? "bg-club text-white" : ""}`;

  return (
    <tr className={me ? "" : "transition-colors duration-200 hover:bg-secondary/50"}>
      <td
        className={`${COL_POS} ${cell} rounded-l-[20px] pl-3 sm:rounded-l-2xl font-display text-2xl tabular-nums sm:pl-4 sm:text-3xl ${
          me ? "text-white" : "text-muted-foreground"
        }`}
      >
        {row.position ?? index + 1}
      </td>

      <th scope="row" className={`${cell} w-full pr-2 text-left font-normal`}>
        <span className="flex min-w-0 items-center gap-3 sm:gap-4">
          <HnsCrest
            picture={row.team?.picture}
            name={row.team?.name}
            size={44}
            className={`size-9 shrink-0 rounded-full object-contain sm:size-11 ${
              me ? "bg-white" : "bg-background"
            }`}
          />
          <span
            className={`truncate text-sm sm:text-lg ${
              me ? "font-bold" : "font-medium text-foreground"
            }`}
          >
            {row.team?.name ?? "-"}
          </span>
        </span>
      </th>

      <td
        className={`${COL_NUM} ${cell} font-mono text-base tabular-nums ${
          me ? "text-white/80" : "text-muted-foreground"
        }`}
      >
        {row.played}
      </td>
      <td
        className={`${COL_NUM} ${cell} font-mono text-base tabular-nums ${
          me ? "text-white/80" : "text-muted-foreground"
        }`}
      >
        {goalDiff(row)}
      </td>

      <td
        className={`${COL_PTS} ${cell} rounded-r-[20px] pr-3 sm:rounded-r-2xl font-display text-3xl tabular-nums sm:pr-4 sm:text-4xl ${
          me ? "text-white" : "text-foreground"
        }`}
      >
        {row.points}
      </td>
    </tr>
  );
}

/**
 * Tablica na homepageu — vrh poretka plus redak Garića kad je izvan vrha, u
 * jednoj mekano osjenčanoj kartici kao i ostatak naslovnice (semafor,
 * rezultati, igrači). Pobjede, neriješeno, porazi i forma idu na stranicu
 * tablice.
 */
export default function StandingsSection({
  rows,
  competition,
}: StandingsSectionProps) {
  if (rows.length === 0) return null;

  const top = rows.slice(0, TOP_COUNT);
  const mine = rows.find((r) => r.highlight) ?? null;
  const mineIsInTop = top.some((r) => r.highlight);

  const hasGap =
    mine !== null && !mineIsInTop && (mine.position ?? 0) > TOP_COUNT + 1;

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto w-full max-w-350 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <FadeInView>
            <h2 className="font-display text-6xl uppercase leading-[0.9] tracking-tight text-foreground lg:text-8xl">
              Tablica
            </h2>
          </FadeInView>
          <FadeInView delay={0.08}>
            <p className="text-base leading-relaxed text-muted-foreground sm:pb-2 sm:text-right">
              {competition ?? "Poredak"} · {rows.length} ekipa
            </p>
          </FadeInView>
        </div>

        <FadeInView delay={0.1}>
          <div
            className={`mt-10 overflow-hidden rounded-[28px] bg-background p-2 sm:mt-14 sm:p-3 ${CARD_SHADOW}`}
          >
            <table className="w-full table-fixed border-separate border-spacing-y-0.5">
              <caption className="sr-only">
                {competition ?? "Poredak"} — prvih {TOP_COUNT} ekipa
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className={`${COL_POS} pb-3 pl-3 pt-2 text-left font-mono text-[13px] font-medium uppercase tracking-widest text-muted-foreground sm:pl-4`}
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="w-full pb-3 pt-2 text-left font-mono text-[13px] font-medium uppercase tracking-widest text-muted-foreground"
                  >
                    Klub
                  </th>
                  <th
                    scope="col"
                    className={`${COL_NUM} pb-3 pt-2 font-mono text-[13px] font-medium uppercase tracking-widest text-muted-foreground`}
                  >
                    Ou
                  </th>
                  <th
                    scope="col"
                    className={`${COL_NUM} pb-3 pt-2 font-mono text-[13px] font-medium uppercase tracking-widest text-muted-foreground`}
                  >
                    +/-
                  </th>
                  <th
                    scope="col"
                    className={`${COL_PTS} pb-3 pr-3 pt-2 font-mono text-[13px] font-medium uppercase tracking-widest text-muted-foreground sm:pr-4`}
                  >
                    Bod
                  </th>
                </tr>
              </thead>

              <tbody>
                {top.map((row, i) => (
                  <StandingsRow
                    key={row.team?.id ?? `${row.position}-${i}`}
                    row={row}
                    index={i}
                  />
                ))}

                {hasGap && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-2 font-mono text-base tracking-[0.3em] text-muted-foreground"
                    >
                      ···
                    </td>
                  </tr>
                )}

                {mine && !mineIsInTop && (
                  <StandingsRow row={mine} index={TOP_COUNT} />
                )}
              </tbody>
            </table>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
