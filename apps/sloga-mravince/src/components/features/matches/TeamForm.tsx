import { HnsCrest } from "@/components/HnsCrest";
import { pluralForm } from "@/lib/helpers/plural";
import { cn } from "@/lib/utils";
import type { Match, MatchOutcome, TeamRanking } from "@/types/hns";

const OUTCOME: Record<MatchOutcome, { label: string; className: string }> = {
  W: { label: "P", className: "bg-emerald-700 text-white" },
  D: { label: "N", className: "bg-foreground/25 text-white" },
  L: { label: "I", className: "bg-club-red text-white" },
};

function FormChips({ form }: { form: MatchOutcome[] }) {
  if (form.length === 0) {
    return (
      <span className="text-[0.62rem] font-bold uppercase text-muted-foreground">
        Nema podataka
      </span>
    );
  }

  return (
    <div className="flex gap-1.5">
      {form.map((outcome, i) => (
        <span
          key={`${outcome}-${i}`}
          className={cn(
            "flex size-7 items-center justify-center font-display text-sm leading-none",
            OUTCOME[outcome].className,
          )}
        >
          {OUTCOME[outcome].label}
        </span>
      ))}
    </div>
  );
}

function TeamRow({ row }: { row: TeamRanking }) {
  const name = row.team?.name ?? "—";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-foreground/10 py-5 first:border-t">
      <HnsCrest
        picture={row.team?.picture}
        name={name}
        size={36}
        className="size-9 rounded-full bg-white p-0.5 ring-1 ring-black/5"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg uppercase leading-tight tracking-wide sm:text-xl">
          {name}
        </p>
        <p className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {row.position != null ? `${row.position}. mjesto` : "—"} ·{" "}
          <span className="tabular-nums">{row.points}</span>{" "}
          {pluralForm(row.points, {
            one: "bod",
            few: "boda",
            many: "bodova",
          })}
        </p>
      </div>

      <FormChips form={row.form} />
    </div>
  );
}

/**
 * Forma obiju momčadi — zadnjih pet ishoda, pozicija i bodovi.
 *
 * Podaci dolaze ravno iz ljestvice (`TeamRanking.form`), koju stranica ionako
 * dohvaća za tab Tablica — pa forma ne košta nijedan dodatni zahtjev.
 * Renderira se samo ako je bar jedna momčad pronađena u ljestvici (utakmica
 * kupa nema ljestvicu).
 */
export default function TeamForm({
  match,
  standings,
}: {
  match: Match;
  standings: TeamRanking[];
}) {
  const find = (teamId: number | null | undefined) =>
    teamId == null
      ? undefined
      : standings.find((row) => row.team?.id === teamId);

  const rows = [find(match.homeTeam?.id), find(match.awayTeam?.id)].filter(
    (row): row is TeamRanking => row != null,
  );

  if (rows.length === 0) return null;

  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Forma · zadnjih 5
      </h3>
      <div className="mt-6">
        {rows.map((row) => (
          <TeamRow key={row.team?.id ?? row.position} row={row} />
        ))}
      </div>
    </section>
  );
}
