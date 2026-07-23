import { HnsCrest } from "@/components/HnsCrest";
import type { LineupPlayer, Lineups, Match, Team, TeamLineup } from "@/types/hns";
import { EventIcon } from "./EventIcon";

/** Znakovi golova/kartona/zamjena koje je igrač skupio, uz njegovo ime. */
function PlayerEvents({ player }: { player: LineupPlayer }) {
  const kinds = player.events
    .map((event) => event.kind)
    .filter((kind) => kind !== "other");

  if (kinds.length === 0) return null;

  return (
    <span className="flex shrink-0 items-center gap-1.5">
      {kinds.map((kind, i) => (
        <EventIcon key={`${kind}-${i}`} kind={kind} className="size-3" />
      ))}
    </span>
  );
}

function PlayerRow({ player }: { player: LineupPlayer }) {
  return (
    <li className="flex items-center gap-3.5 border-b border-foreground/10 py-3">
      <span className="w-6 shrink-0 text-right font-display text-base leading-none tabular-nums text-foreground/35">
        {player.shirtNumber ?? "–"}
      </span>

      <span className="min-w-0 flex-1 truncate text-sm font-semibold uppercase">
        {player.name}
        {player.captain && (
          <span
            title="Kapetan"
            className="ml-2 inline-block bg-foreground/10 px-1.5 py-0.5 align-middle text-[0.55rem] font-black tracking-wider text-muted-foreground"
          >
            K
          </span>
        )}
      </span>

      <PlayerEvents player={player} />
    </li>
  );
}

/**
 * HNS's `officials` is the club's whole matchday delegation — physio, doctor,
 * club representative, safety officer, and every rank of coach down to the
 * fitness one. Next to a lineup only the head coach carries meaning; listing the
 * rest turns the lineup into a staff directory.
 */
function isHeadCoach(role: string | null): boolean {
  const r = (role ?? "").toLowerCase();
  return r.includes("trener") && (r.includes("glavni") || r.trim() === "trener");
}

function SideLineup({
  team,
  lineup,
}: {
  team: Team | null;
  lineup: TeamLineup | null;
}) {
  const players = lineup?.players ?? [];
  const starters = players.filter((player) => player.starting);
  const substitutes = players.filter((player) => !player.starting);
  const coaches = (lineup?.officials ?? []).filter((official) =>
    isHeadCoach(official.role),
  );

  return (
    <section>
      <div className="flex items-center gap-3.5 border-b-2 border-foreground pb-4">
        <HnsCrest
          picture={team?.picture}
          name={team?.name}
          size={36}
          className="size-9 rounded-full bg-white p-0.5 ring-1 ring-black/5"
        />
        <h3 className="min-w-0 flex-1 truncate font-display text-xl uppercase leading-tight tracking-wide sm:text-2xl">
          {team?.name ?? "—"}
        </h3>
        {lineup?.formation && (
          <span className="shrink-0 bg-ink-deep px-2.5 py-1.5 font-display text-sm leading-none tabular-nums text-chalk">
            {lineup.formation}
          </span>
        )}
      </div>

      {starters.length > 0 && (
        <>
          <h4 className="mt-7 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-club-red">
            Početnih {starters.length}
          </h4>
          <ul className="mt-3">
            {starters.map((player) => (
              <PlayerRow key={player.personId ?? player.name} player={player} />
            ))}
          </ul>
        </>
      )}

      {substitutes.length > 0 && (
        <>
          <h4 className="mt-8 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Klupa
          </h4>
          <ul className="mt-3">
            {substitutes.map((player) => (
              <PlayerRow key={player.personId ?? player.name} player={player} />
            ))}
          </ul>
        </>
      )}

      {coaches.length > 0 && (
        <>
          <h4 className="mt-8 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Trener
          </h4>
          <ul className="mt-3">
            {coaches.map((coach) => (
              <li
                key={`${coach.personId ?? coach.name}-${coach.role ?? ""}`}
                className="flex items-baseline justify-between gap-4 border-b border-foreground/10 py-3"
              >
                <span className="min-w-0 truncate text-sm font-semibold uppercase">
                  {coach.name}
                </span>
                {coach.role && (
                  <span className="shrink-0 text-[0.62rem] font-bold uppercase tracking-wide text-muted-foreground">
                    {coach.role}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/**
 * Postave — dvije kolone lista (početnih 11 / klupa / stožer), s oznakom
 * formacije kad je HNS pošalje.
 *
 * Namjerno bez grafičkog terena: niže lige često ne popune pozicije igrača, pa
 * bi teren ostajao prazan ili nakrivo posložen. Tab se ionako ne prikazuje bez
 * postava (vidi `hasLineups`).
 */
export default function LineupsTab({
  match,
  lineups,
}: {
  match: Match;
  lineups: Lineups;
}) {
  return (
    <div className="grid gap-14 md:grid-cols-2 md:gap-12">
      <SideLineup team={match.homeTeam} lineup={lineups.home} />
      <SideLineup team={match.awayTeam} lineup={lineups.away} />
    </div>
  );
}
