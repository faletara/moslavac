import Image from "next/image";
import { FadeInView } from "@/components/animations";
import { HnsCrest } from "@/components/HnsCrest";
import { formatDateParts } from "@/lib/helpers/date";
import type { Match, Team } from "@/types/hns";
import { Countdown } from "./Countdown";

// HNS vraća kolo kao goli broj ("30") ili već s tekstom ("30. kolo"). Ako je
// samo broj, dodamo "kolo" da korisniku bude jasno o čemu se radi.
function formatRound(round: string): string {
  const trimmed = round.trim();

  return /^\d+$/.test(trimmed) ? `${trimmed}. kolo` : trimmed;
}

// Odrezani donji-desni kut — signature oblik kartice (isti kao Rezultati).
const CLIP =
  "[clip-path:polygon(0_0,100%_0,100%_calc(100%-1.5rem),calc(100%-1.5rem)_100%,0_100%)]";

function Badge({
  tone = "outline",
  children,
}: {
  tone?: "outline" | "solid";
  children: React.ReactNode;
}) {
  return (
    <span
      className={`px-2.5 py-1 text-[0.5rem] font-bold uppercase tracking-[0.15em] ${
        tone === "solid"
          ? "bg-brand-yellow text-brand-navy"
          : "border border-brand-navy/15 text-brand-navy/70"
      }`}
    >
      {children}
    </span>
  );
}

function TeamBlock({
  team,
  label,
  isOurs,
  align,
}: {
  team: Team | null | undefined;
  label: string;
  isOurs: boolean;
  align: "start" | "end";
}) {
  const toStart = align === "start";

  return (
    <div
      className={`flex flex-col items-center gap-5 text-center sm:gap-6 ${
        toStart ? "sm:items-start sm:text-left" : "sm:items-end sm:text-right"
      }`}
    >
      {/* Grb sjedi u svijetlom kvadratu — oštri kutovi kao ostatak stranice */}
      <span className="flex size-20 items-center justify-center bg-brand-navy/3 ring-1 ring-brand-navy/8 sm:size-28">
        <HnsCrest
          picture={team?.picture}
          name={team?.name}
          size={112}
          className="size-14 sm:size-20"
        />
      </span>
      <div
        className={`flex flex-col gap-2 ${toStart ? "sm:items-start" : "sm:items-end"} items-center`}
      >
        <span className="text-balance font-display text-xl font-extrabold uppercase leading-[0.95] tracking-tight text-brand-navy sm:text-3xl lg:text-4xl">
          {team?.name ?? "—"}
        </span>
        <span className="flex items-center gap-2 text-[0.5rem] font-bold uppercase tracking-[0.22em] text-brand-navy/40">
          {isOurs && (
            <span aria-hidden className="h-0.75 w-4 bg-brand-yellow" />
          )}
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * Sljedeća utakmica — matchday ulaznica: bijela kartica s odrezanim kutom i
 * navy podnožjem u kojem otkucava odbrojavanje. Isti jezik kao Rezultati
 * (žuti akcent, grb-watermark, verzal), samo krupnije.
 */
export function NextMatch({
  match,
  ourTeamId,
}: {
  match: Match;
  ourTeamId?: number | null;
}) {
  const kickoff = match.kickoffAtUtcMs;
  const parts = kickoff ? formatDateParts(kickoff) : null;
  const venue = match.facility?.name ?? match.facility?.place ?? null;
  const isHomeOurs = ourTeamId != null && match.homeTeam?.id === ourTeamId;
  const isAwayOurs = ourTeamId != null && match.awayTeam?.id === ourTeamId;

  return (
    <section className="relative isolate overflow-hidden bg-brand-navy">
      {/* Dijagonalni raster — tiha tekstura da navy ne bude prazna ploha */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent,transparent_42px,rgba(255,255,255,0.02)_42px,rgba(255,255,255,0.02)_84px)]"
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
        <FadeInView>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-white/15 pb-6">
            <h2 className="flex items-center gap-3 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tight text-white sm:text-5xl">
              <span className="h-9 w-1 rounded-full bg-brand-yellow sm:h-12" />
              Sljedeća utakmica
            </h2>
            {match.competition?.name && (
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/40">
                {match.competition.name}
              </span>
            )}
          </div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <article
            className={`relative overflow-hidden bg-white shadow-[0_34px_70px_-34px_rgba(0,0,0,0.75)] ${CLIP}`}
          >
            {/* Žuta ivica — isti akcent kao crtica uz naslov sekcije */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-1.5 bg-brand-yellow"
            />
            {/* Grb kao suptilni watermark — brand-tekstura */}
            <Image
              aria-hidden
              src="/grb-vrapce.png"
              alt=""
              width={420}
              height={420}
              className="pointer-events-none absolute -right-16 -top-16 size-72 opacity-[0.05] sm:size-96"
            />

            <div className="relative flex flex-col gap-10 px-6 py-8 sm:gap-14 sm:px-12 sm:py-12">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="solid">Uskoro</Badge>
                {match.round && <Badge>{formatRound(match.round)}</Badge>}
                {venue && <Badge>{venue}</Badge>}
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-10">
                <TeamBlock
                  team={match.homeTeam}
                  label="Domaćin"
                  isOurs={isHomeOurs}
                  align="start"
                />
                {/* Žuti blok s "VS" — brand-beat u optičkom centru kartice */}
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 items-center justify-center bg-brand-yellow font-display text-lg font-extrabold uppercase leading-none tracking-tight text-brand-navy sm:size-14 sm:text-2xl"
                >
                  VS
                </span>
                <TeamBlock
                  team={match.awayTeam}
                  label="Gost"
                  isOurs={isAwayOurs}
                  align="end"
                />
              </div>
            </div>

            {/* Podnožje ulaznice: odbrojavanje lijevo, termin desno */}
            <div className="relative flex flex-col items-center gap-8 bg-brand-navy px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:pr-20">
              {kickoff && <Countdown target={kickoff} />}
              {parts && (
                <div className="flex flex-col items-center gap-1.5 sm:items-end">
                  <span className="font-display text-2xl font-extrabold uppercase leading-none tabular-nums tracking-tight text-white sm:text-3xl">
                    {parts.weekdayShort} {parts.day}. {parts.monthShort}
                  </span>
                  <span className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-white/45">
                    <span className="tabular-nums text-brand-yellow">
                      {parts.time}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </article>
        </FadeInView>
      </div>
    </section>
  );
}
