import { HnsCrest } from "@/components/HnsCrest";
import Countdown from "@/components/features/home/Countdown";
import { formatDateParts } from "@/lib/helpers/date";
import { calledOffLabel, isLive, liveMinute } from "@/lib/hns/matchStatus";
import { cn } from "@/lib/utils";
import type { Match } from "@/types/hns";

/** Jedan tim: veliki grb + Anton naziv. Poražena strana blijedi. */
function TeamBlock({
  picture,
  name,
  dimmed,
}: {
  picture: string | null | undefined;
  name: string | null | undefined;
  dimmed: boolean;
}) {
  return (
    <div className="grid grid-rows-[5.5rem_minmax(3rem,auto)] justify-items-center gap-5 text-center sm:grid-rows-[8rem_minmax(4rem,auto)]">
      <div className="row-start-1 flex size-[5.5rem] items-center justify-center sm:size-32">
        <HnsCrest
          picture={picture}
          name={name}
          size={96}
          className="size-16! sm:size-24!"
        />
      </div>
      <span
        className={cn(
          "row-start-2 max-w-36 self-start font-display text-lg uppercase leading-[1.05] tracking-wide sm:max-w-52 sm:text-2xl",
          dimmed ? "text-white/60" : "text-white",
        )}
      >
        {name ?? "—"}
      </span>
    </div>
  );
}

/** Pulsirajuća oznaka da je utakmica u tijeku. */
function LiveBadge({ minute }: { minute: string | null }) {
  return (
    <span className="inline-flex items-center gap-2.5 bg-club-red px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.24em] text-white">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-white" />
      </span>
      Uživo
      {minute && <span className="tabular-nums">· {minute}</span>}
    </span>
  );
}

/** Meta stavka u donjoj traci, odvojena crvenim rombom. */
function MetaItem({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span aria-hidden className="size-1.5 rotate-45 bg-club-red" />
      <span>{children}</span>
    </>
  );
}

/**
 * Ink pozornica na vrhu match stranice — posuđuje matchday jezik s naslovnice
 * (outlined VS watermark, crveni sjaj, zrno, Anton scoreboard), ali u match
 * kontekstu: kolo i natjecanje kao eyebrow, poluvrijeme i gledatelji u meta
 * traci, i tri stanja rezultata — odigrano, u tijeku, ili odbrojavanje.
 *
 * Odgođena/otkazana utakmica NIKAD ne pokazuje odbrojavanje: termin do kojeg bi
 * odbrojavalo više ne vrijedi.
 */
export default function MatchHero({ match }: { match: Match }) {
  const kickoff = match.kickoffAtUtcMs;
  const live = isLive(match);
  const calledOff = calledOffLabel(match);

  const home = match.score.home?.current;
  const away = match.score.away?.current;
  const hasScore = home != null && away != null;

  const halfHome = match.score.home?.half;
  const halfAway = match.score.away?.half;
  const showHalfTime = hasScore && halfHome != null && halfAway != null;

  const attendance = match.attendance;
  const venue = match.facility?.name ?? match.facility?.place ?? null;

  const eyebrow =
    [
      match.roundOrder != null ? `Kolo ${match.roundOrder}` : match.round,
      match.competition?.name?.trim(),
    ]
      .filter(Boolean)
      .join(" · ") || "Utakmica";

  const parts = kickoff != null ? formatDateParts(kickoff) : null;

  return (
    <section className="relative isolate overflow-hidden bg-ink-deep py-20 text-white md:py-28">
      {/* Atmosfera: crveni sjaj + dijagonalni raster + zrno */}
      <div
        aria-hidden
        // Na uskim ekranima isti sjaj proguta cijelu sekciju i pretvori ink u
        // bordo — pa je ispod `md` bitno manji i tiši.
        className="pointer-events-none absolute -left-24 top-1/2 -z-10 size-80 -translate-y-1/2 rounded-full bg-club-red/10 blur-2xl md:-left-40 md:size-168 md:bg-club-red/20 md:blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent,transparent_44px,rgba(255,255,255,0.025)_44px,rgba(255,255,255,0.025)_88px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.06] mix-blend-overlay"
      />
      <span
        aria-hidden
        className="[--text-stroke-color:rgba(255,255,255,0.07)] pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[38vw] uppercase leading-none text-stroke-thick md:text-[24rem]"
      >
        VS
      </span>

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-white/70">
            {eyebrow}
          </span>
          {live && <LiveBadge minute={liveMinute(match)} />}
          {calledOff && (
            <span className="bg-white/10 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.24em] text-white ring-1 ring-white/20">
              {calledOff}
            </span>
          )}
        </div>

        <div className="mt-14 md:mt-20">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-10">
            <TeamBlock
              picture={match.homeTeam?.picture}
              name={match.homeTeam?.name}
              dimmed={hasScore && home < away}
            />

            <div className="flex flex-col items-center gap-5">
              {hasScore ? (
                <div className="flex items-baseline gap-3 font-display text-7xl leading-none tabular-nums sm:gap-5 sm:text-9xl">
                  <span className={home > away ? "text-white" : "text-white/35"}>
                    {home}
                  </span>
                  <span className="text-4xl text-club-red sm:text-6xl">:</span>
                  <span className={away > home ? "text-white" : "text-white/35"}>
                    {away}
                  </span>
                </div>
              ) : calledOff ? (
                <span className="font-display text-5xl uppercase leading-none text-white/45 sm:text-7xl">
                  {calledOff}
                </span>
              ) : kickoff != null ? (
                <Countdown target={kickoff} />
              ) : (
                <span className="font-display text-6xl leading-none text-white/35 sm:text-8xl">
                  –
                </span>
              )}
            </div>

            <TeamBlock
              picture={match.awayTeam?.picture}
              name={match.awayTeam?.name}
              dimmed={hasScore && away < home}
            />
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 border-t border-white/10 pt-8 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/55 md:mt-16">
            {parts && (
              <span className="tabular-nums text-white">
                {parts.weekdayShort} {parts.day}. {parts.monthShort} ·{" "}
                {parts.time}
              </span>
            )}
            {venue && <MetaItem>{venue}</MetaItem>}
            {showHalfTime && (
              <MetaItem>
                <span className="tabular-nums">
                  Poluvrijeme {halfHome}:{halfAway}
                </span>
              </MetaItem>
            )}
            {attendance != null && attendance > 0 && (
              <MetaItem>
                <span className="tabular-nums">{attendance} gledatelja</span>
              </MetaItem>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
