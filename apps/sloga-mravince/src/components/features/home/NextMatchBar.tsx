import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import { formatDateParts } from "@/lib/helpers/date";
import { cn } from "@/lib/utils";
import type { HnsMatch, MatchSlots } from "@/types/hns";

function isRealMatch(match: HnsMatch | null | undefined): match is HnsMatch {
  return match != null && Object.keys(match).length > 0 && match.dateTimeUTC != null;
}

/** Jedan tim: grb na bijeloj pločici + naziv. Pobjednik ima puni bijeli naziv. */
function TeamBlock({
  picture,
  name,
  winner,
}: {
  picture: string | null | undefined;
  name: string | null | undefined;
  winner: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <HnsCrest
        picture={picture}
        name={name}
        size={88}
        className="size-16! bg-white p-2 shadow-[0_12px_28px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/50 sm:size-20!"
      />
      <span
        className={cn(
          "max-w-36 font-display text-sm font-bold uppercase leading-tight tracking-wide sm:max-w-48 sm:text-base",
          winner ? "text-white" : "text-white/70",
        )}
      >
        {name ?? "—"}
      </span>
    </div>
  );
}

/**
 * Matchday rezultat u jeziku sekcije igrača: lijevo-poravnat heading + crvena
 * gradient kartica s dijagonalnom teksturom i mekim krugovima. Sljedeća
 * utakmica, a van sezone — posljednji rezultat. Ne renderira se bez utakmice.
 */
export default function NextMatchBar({ slots }: { slots: MatchSlots }) {
  const isNext = isRealMatch(slots.next);
  const match = isNext ? slots.next : slots.previous;
  if (!isRealMatch(match)) return null;

  const { weekdayShort, day, monthShort, time } = formatDateParts(
    match.dateTimeUTC as number,
  );
  const heading = isNext ? "Sljedeća utakmica" : "Posljednji rezultat";
  const meta = [match.competition?.name, match.round].filter(Boolean).join(" · ");
  const venue = match.facility?.name ?? match.facility?.place ?? null;

  const home = match.homeTeamResult?.current;
  const away = match.awayTeamResult?.current;
  const hasScore = home != null && away != null;

  const detailsHref = match.id != null ? `/utakmice/${match.id}` : null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <h2 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
        {heading}
      </h2>

      <div className="mt-8 md:mt-10">
        {/* Crvena gradient kartica (jezik player-kartica) */}
        <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#e5292f_0%,#a51419_100%)] px-6 py-10 text-white shadow-[0_30px_70px_-32px_rgba(165,20,25,0.7)] sm:px-12 sm:py-14">
          {/* Dijagonalni raster */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent,transparent_38px,rgba(255,255,255,0.045)_38px,rgba(255,255,255,0.045)_76px)]"
          />
          {/* Meki krugovi */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-black/10 blur-3xl"
          />
          {/* Zlatni hairline gore */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-club-gold/70 to-transparent"
          />

          {/* Meta: natjecanje */}
          {meta && (
            <div className="relative mb-8 flex items-center gap-2.5 sm:mb-10">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-club-gold" />
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/80 sm:text-xs">
                {meta}
              </span>
            </div>
          )}

          {/* Scoreboard */}
          <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-8">
            <TeamBlock
              picture={match.homeTeam?.picture}
              name={match.homeTeam?.name}
              winner={hasScore && home! > away!}
            />

            <div className="flex flex-col items-center">
              {hasScore ? (
                <div className="flex items-baseline gap-2.5 font-display text-6xl font-black leading-none tabular-nums sm:gap-4 sm:text-7xl">
                  <span className={home! > away! ? "text-white" : "text-white/40"}>
                    {home}
                  </span>
                  <span className="text-4xl font-light text-white/25 sm:text-5xl">:</span>
                  <span className={away! > home! ? "text-white" : "text-white/40"}>
                    {away}
                  </span>
                </div>
              ) : isNext ? (
                <div className="flex flex-col items-center gap-2.5">
                  <span className="font-display text-4xl font-black uppercase tracking-tight text-white/90 sm:text-5xl">
                    vs
                  </span>
                  <span className="rounded-md bg-white px-2.5 py-1 text-sm font-black tabular-nums text-club-red shadow-sm">
                    {time}
                  </span>
                </div>
              ) : (
                <span className="font-display text-4xl font-black sm:text-5xl">
                  {match.result ?? "–"}
                </span>
              )}
            </div>

            <TeamBlock
              picture={match.awayTeam?.picture}
              name={match.awayTeam?.name}
              winner={hasScore && away! > home!}
            />
          </div>

          {/* Footer: datum + lokacija + CTA */}
          <div className="relative mt-10 flex flex-col items-center gap-5 border-t border-white/15 pt-6">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/70">
              <span className="tabular-nums text-white/90">
                {weekdayShort} {day} {monthShort}
                {isNext ? ` · ${time}` : ""}
              </span>
              {venue && (
                <>
                  <span className="h-1 w-1 rounded-full bg-club-gold" />
                  <span>{venue}</span>
                </>
              )}
            </div>

            {detailsHref && (
              <Link
                href={detailsHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-club-red transition-transform hover:scale-105"
              >
                Vidi detalje
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
