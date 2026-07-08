import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeInView } from "@/components/animations";
import { HnsCrest } from "@/components/HnsCrest";
import { formatDateParts } from "@/lib/helpers/date";
import { cn } from "@/lib/utils";
import type { HnsMatch, MatchSlots } from "@/types/hns";
import Countdown from "./Countdown";

function isRealMatch(match: HnsMatch | null | undefined): match is HnsMatch {
  return (
    match != null && Object.keys(match).length > 0 && match.dateTimeUTC != null
  );
}

/** Jedan tim: veliki grb + Anton naziv. */
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
          winner ? "text-white" : "text-white/60",
        )}
      >
        {name ?? "—"}
      </span>
    </div>
  );
}

/**
 * Matchday sekcija — fullwidth ink pozornica sa živim odbrojavanjem do
 * sljedeće utakmice (van sezone: posljednji rezultat). Ogroman outlined "VS"
 * watermark, veliki grbovi, meta linija s datumom i stadionom.
 * Ne renderira se bez utakmice.
 */
export default function NextMatchBar({ slots }: { slots: MatchSlots }) {
  const isNext = isRealMatch(slots.next);
  const match = isNext ? slots.next : slots.previous;
  if (!isRealMatch(match)) return null;

  const kickoff = match.dateTimeUTC as number;
  const { weekdayShort, day, monthShort, time } = formatDateParts(kickoff);
  const meta = [match.competition?.name, match.round]
    .filter(Boolean)
    .join(" · ");
  const venue = match.facility?.name ?? match.facility?.place ?? null;

  const home = match.homeTeamResult?.current;
  const away = match.awayTeamResult?.current;
  const hasScore = home != null && away != null;

  const detailsHref = match.id != null ? `/utakmice/${match.id}` : null;

  return (
    <section
      id="utakmice"
      className="relative isolate overflow-hidden bg-ink-deep py-20 text-white md:py-28"
    >
      {/* Atmosfera: crveni sjaj + dijagonalni raster + zrno */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 -z-10 size-[42rem] -translate-y-1/2 rounded-full bg-club-red/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent,transparent_44px,rgba(255,255,255,0.025)_44px,rgba(255,255,255,0.025)_88px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.06] mix-blend-overlay"
      />
      {/* Ogroman outlined VS watermark */}
      <span
        aria-hidden
        className="[--text-stroke-color:rgba(255,255,255,0.07)] pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[38vw] uppercase leading-none text-stroke-thick md:text-[24rem]"
      >
        VS
      </span>

      <div className="mx-auto max-w-6xl px-6">
        <SectionRow
          eyebrow={isNext ? "Matchday" : "Posljednji rezultat"}
          meta={meta}
        />

        <FadeInView className="mt-14 md:mt-20">
          {/* Scoreboard */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-10">
            <TeamBlock
              picture={match.homeTeam?.picture}
              name={match.homeTeam?.name}
              winner={!hasScore || home! >= away!}
            />

            <div className="flex flex-col items-center gap-5">
              {hasScore ? (
                <div className="flex items-baseline gap-3 font-display text-7xl leading-none tabular-nums sm:gap-5 sm:text-9xl">
                  <span
                    className={home! > away! ? "text-white" : "text-white/35"}
                  >
                    {home}
                  </span>
                  <span className="text-4xl text-club-red sm:text-6xl">:</span>
                  <span
                    className={away! > home! ? "text-white" : "text-white/35"}
                  >
                    {away}
                  </span>
                </div>
              ) : isNext ? (
                <Countdown target={kickoff} />
              ) : (
                <span className="font-display text-6xl sm:text-8xl">
                  {match.result ?? "–"}
                </span>
              )}
            </div>

            <TeamBlock
              picture={match.awayTeam?.picture}
              name={match.awayTeam?.name}
              winner={!hasScore || away! >= home!}
            />
          </div>

          {/* Meta + CTA */}
          <div className="mt-14 flex flex-col items-center gap-6 border-t border-white/10 pt-8 md:mt-16">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/55">
              <span className="tabular-nums text-white">
                {weekdayShort} {day}. {monthShort}
                {isNext ? ` · ${time}` : ""}
              </span>
              {venue && (
                <>
                  <span
                    aria-hidden
                    className="size-1.5 rotate-45 bg-club-red"
                  />
                  <span>{venue}</span>
                </>
              )}
            </div>

            {detailsHref && (
              <Link
                href={detailsHref}
                className="group inline-flex items-center gap-3 bg-club-red px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-white hover:text-ink-deep"
              >
                Detalji utakmice
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

/** Gornji editorial red sekcije na tamnoj podlozi. */
function SectionRow({
  eyebrow,
  meta,
}: {
  eyebrow: string;
  meta: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-white">
        {eyebrow}
      </span>
      {meta && (
        <span className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/40 sm:inline">
          · {meta}
        </span>
      )}
    </div>
  );
}
