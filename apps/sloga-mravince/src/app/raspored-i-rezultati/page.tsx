import { ArrowRight, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import { InkPageHero } from "@/components/layout/InkPageHero";
import { toReadableCompetitionName } from "@/lib/helpers/competition";
import { formatDateParts } from "@/lib/helpers/date";
import { pluralForm } from "@/lib/helpers/plural";
import {
  fetchAllCompetitionMatches,
  fetchCurrentSeasonCompetitionsResult,
} from "@/lib/hns/competitions";
import { getSeniorCompetitionFilter } from "@/lib/hns/client";
import { isFinished } from "@/lib/hns/matchStatus";
import { getTenant } from "@/lib/payload/getTenant";
import { buildMatchSlug } from "@/lib/helpers/slug";
import type { Competition, Match } from "@/types/hns";

export const revalidate = 300;

const MATCH_FORMS = {
  one: "utakmica",
  few: "utakmice",
  many: "utakmica",
};

type MatchWithDate = Match & { kickoffAtUtcMs: number };

interface Props {
  searchParams: Promise<{ competitionId?: string }>;
}

function hasDate(match: Match): match is MatchWithDate {
  return match.kickoffAtUtcMs != null;
}

function parseCompetitionId(value: string | undefined): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function competitionLabel(competition: Competition): string {
  return toReadableCompetitionName(competition.name) || "Natjecanje";
}

function selectCompetition({
  competitions,
  seniorFilter,
  competitionId,
}: {
  competitions: Competition[];
  seniorFilter: string | null;
  competitionId: number | null;
}): Competition | null {
  const valid = competitions.filter((competition) => competition.id != null);
  const fromUrl = valid.find((competition) => competition.id === competitionId);
  if (fromUrl) return fromUrl;

  const senior = seniorFilter
    ? valid.find((competition) => competition.name?.includes(seniorFilter))
    : null;
  return senior ?? valid[0] ?? null;
}

function splitMatches(matches: Match[]) {
  const dated = matches.filter(hasDate);
  const upcoming = dated
    .filter((match) => !isFinished(match))
    .sort((a, b) => a.kickoffAtUtcMs - b.kickoffAtUtcMs);
  const results = dated
    .filter(isFinished)
    .sort((a, b) => b.kickoffAtUtcMs - a.kickoffAtUtcMs);

  return { upcoming, results };
}

function scoreOf(match: Match): string | null {
  const home = match.score.home?.current;
  const away = match.score.away?.current;
  if (home != null && away != null) return `${home}:${away}`;
  return match.teamResult || null;
}

function matchMeta(match: Match): string {
  return [match.competition?.name, match.round].filter(Boolean).join(" · ");
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-36 items-center justify-center border border-foreground/10 px-6 py-10 text-center clip-corner">
      <p className="text-xs font-bold uppercase text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

function CompetitionSelector({
  competitions,
  selectedId,
}: {
  competitions: Competition[];
  selectedId: number | null;
}) {
  const items = competitions.filter(
    (competition): competition is Competition & { id: number } =>
      competition.id != null,
  );
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Odabir natjecanja"
      className="mb-14 flex flex-wrap gap-2.5 border-b border-foreground/10 pb-8"
    >
      {items.map((competition) => {
        const selected = competition.id === selectedId;

        return (
          <Link
            key={competition.id}
            href={`/raspored-i-rezultati?competitionId=${competition.id}`}
            aria-current={selected ? "page" : undefined}
            className={`clip-corner px-4 py-3 text-[0.66rem] font-black uppercase transition-colors ${
              selected
                ? "bg-ink-deep text-chalk"
                : "bg-white text-foreground ring-1 ring-foreground/10 hover:text-club-red"
            }`}
          >
            {competitionLabel(competition)}
          </Link>
        );
      })}
    </nav>
  );
}

function TeamName({ name }: { name: string | null | undefined }) {
  return (
    <span className="min-w-0 text-balance font-display text-xl uppercase leading-tight text-foreground sm:text-2xl">
      {name ?? "—"}
    </span>
  );
}

/**
 * Redak momčadi na mobitelu: grb, naziv, pa golovi te momčadi. Simetrični
 * raspored „domaćin — rezultat — gost” radi tek od `lg` naviše; na uskom
 * ekranu imena se lome u tri retka, a grbovi ispadaju ispod teksta.
 */
function TeamLine({
  team,
  goals,
}: {
  team: Match["homeTeam"];
  goals: number | null;
}) {
  return (
    <div className="flex items-center gap-3">
      <HnsCrest
        picture={team?.picture}
        name={team?.name}
        size={40}
        className="size-9 shrink-0 rounded-full bg-white p-1 ring-1 ring-black/5"
      />
      <span className="min-w-0 flex-1 font-display text-lg uppercase leading-tight text-foreground">
        {team?.name ?? "—"}
      </span>
      {goals != null && (
        <span className="font-display text-2xl uppercase leading-none tabular-nums text-ink-deep">
          {goals}
        </span>
      )}
    </div>
  );
}

/** HNS can withhold a match detail; without an id there is nothing to link to. */
function detailHref(match: Match): string | null {
  if (match.id == null || !match.allowDetail) return null;
  return `/raspored-i-rezultati/${buildMatchSlug(match)}`;
}

function MatchCard({
  match,
  variant,
}: {
  match: MatchWithDate;
  variant: "upcoming" | "result";
}) {
  const { weekdayShort, day, monthShort, time } = formatDateParts(
    match.kickoffAtUtcMs,
  );
  const score = scoreOf(match);
  const venue = match.facility?.name ?? match.facility?.place;
  const meta = matchMeta(match);
  const isUpcoming = variant === "upcoming";
  const href = detailHref(match);

  const card = (
    // Bez `first:pt-0`: kartica s detaljima omotana je u <Link>, pa je uvijek
    // prvo dijete svog omotača — pravilo bi ugasilo gornji padding svakoj
    // kartici i broj dana bi sjeo na crtu iznad.
    <article className="group border-b border-foreground/10 py-8 lg:grid lg:grid-cols-[8rem_1fr_8rem] lg:items-center lg:gap-5 lg:py-7">
      {/* Datum: u retku na mobitelu, u stupcu na širokom ekranu */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 lg:block">
        <p className="font-display text-4xl uppercase leading-none text-club-red tabular-nums">
          {day}
        </p>
        <p className="text-xs font-black uppercase text-muted-foreground lg:mt-1">
          {weekdayShort} · {monthShort}
        </p>
        <p className="ml-auto text-xs font-bold uppercase text-foreground/70 lg:ml-0 lg:mt-3">
          {time}
        </p>
      </div>

      {/* Momčadi — mobilna lista */}
      <div className="mt-5 flex flex-col gap-3 lg:hidden">
        <TeamLine team={match.homeTeam} goals={match.score.home?.current ?? null} />
        <TeamLine team={match.awayTeam} goals={match.score.away?.current ?? null} />
      </div>

      {/* Momčadi — simetrični raspored od lg naviše */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
        <div className="flex min-w-0 flex-col items-end gap-3 text-right sm:flex-row sm:items-center sm:justify-end">
          <TeamName name={match.homeTeam?.name} />
          <HnsCrest
            picture={match.homeTeam?.picture}
            name={match.homeTeam?.name}
            size={48}
            className="size-11 rounded-full bg-white p-1 ring-1 ring-black/5"
          />
        </div>

        <div className="flex min-w-18 flex-col items-center">
          {score ? (
            <span className="font-display text-4xl uppercase leading-none text-ink-deep tabular-nums sm:text-5xl">
              {score}
            </span>
          ) : (
            <span className="bg-ink-deep px-3 py-2 font-display text-xl uppercase leading-none text-chalk">
              {isUpcoming ? time : "–"}
            </span>
          )}
          <span className="mt-2 text-[0.56rem] font-black uppercase text-muted-foreground">
            {isUpcoming ? "Raspored" : "Rezultat"}
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <HnsCrest
            picture={match.awayTeam?.picture}
            name={match.awayTeam?.name}
            size={48}
            className="size-11 rounded-full bg-white p-1 ring-1 ring-black/5"
          />
          <TeamName name={match.awayTeam?.name} />
        </div>
      </div>

      <div className="mt-5 space-y-2 text-left lg:mt-0 lg:text-right">
        {meta && (
          <p className="text-[0.6rem] font-black uppercase text-muted-foreground">
            {meta}
          </p>
        )}
        {/* Na mobitelu mjesto i „Detalji” dijele redak umjesto da rastu u vis. */}
        <div className="flex items-center justify-between gap-3 lg:block lg:space-y-2">
          {venue && (
            <p className="min-w-0 text-xs font-semibold uppercase text-foreground/65">
              {venue}
            </p>
          )}
          {href && (
            <span className="inline-flex shrink-0 items-center gap-2 text-[0.6rem] font-black uppercase tracking-[0.16em] text-foreground/70 transition-colors group-hover:text-club-red lg:pt-1">
              Detalji
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (!href) return card;

  return (
    <Link
      href={href}
      aria-label={`${match.homeTeam?.name ?? "Domaćin"} – ${match.awayTeam?.name ?? "Gost"}, detalji utakmice`}
      // Crvena traka koja izraste uz lijevi rub retka — poster jezik. Namjerno
      // bez podloge u sivom: puna siva ploha preko cijele širine izgledala je
      // kao greška, a ne kao hover.
      className="group relative block before:absolute before:inset-y-0 before:-left-4 before:w-1 before:scale-y-0 before:bg-club-red before:transition-transform before:duration-300 hover:before:scale-y-100"
    >
      {card}
    </Link>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const description = `Raspored utakmica i rezultati kluba ${tenant.displayName}.`;

  return {
    title: "Raspored i rezultati",
    description,
    alternates: { canonical: "/raspored-i-rezultati" },
    openGraph: {
      title: `Raspored i rezultati | ${tenant.displayName}`,
      description,
    },
    twitter: {
      title: `Raspored i rezultati | ${tenant.displayName}`,
      description,
    },
  };
}

export default async function ScheduleResultsPage({ searchParams }: Props) {
  const { competitionId: competitionIdParam } = await searchParams;
  const competitionId = parseCompetitionId(competitionIdParam);

  const [{ competitions, ok: competitionsOk }, seniorFilter] =
    await Promise.all([
      fetchCurrentSeasonCompetitionsResult(),
      getSeniorCompetitionFilter(),
    ]);
  const selectedCompetition = selectCompetition({
    competitions,
    seniorFilter,
    competitionId,
  });

  const matches = selectedCompetition?.id
    ? await fetchAllCompetitionMatches({ competitionId: selectedCompetition.id })
    : [];
  const { upcoming, results } = splitMatches(matches);
  const selectedName = selectedCompetition
    ? competitionLabel(selectedCompetition)
    : null;

  return (
    <div className="bg-background">
      <InkPageHero title={["Raspored", "Rezultati"]} watermark="Raspored" />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        {!selectedCompetition?.id ? (
          <div className="flex flex-col items-center justify-center border border-foreground/10 px-6 py-20 text-center clip-corner">
            <CalendarDays className="size-10 text-club-red" />
            <h2 className="mt-5 font-display text-4xl uppercase leading-none text-foreground">
              {competitionsOk ? "Raspored uskoro" : "Podaci nisu dostupni"}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {competitionsOk
                ? "Trenutno nema aktivnih natjecanja. Novi raspored objavljujemo pred početak sezone."
                : "Raspored i rezultate trenutno ne možemo dohvatiti. Pokušajte ponovno kasnije."}
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            <CompetitionSelector
              competitions={competitions}
              selectedId={selectedCompetition.id}
            />

            {upcoming.length > 0 && (
              <section>
                <div className="border-b border-foreground/10 pb-6">
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    {selectedName ?? "Natjecanje"} ·{" "}
                    {String(upcoming.length).padStart(2, "0")}{" "}
                    {pluralForm(upcoming.length, MATCH_FORMS)}
                  </p>
                  <h2 className="mt-3 font-display text-5xl uppercase leading-none text-foreground sm:text-6xl">
                    Nadolazeće utakmice
                  </h2>
                </div>

                <div className="mt-2">
                  {upcoming.map((match) => (
                    <MatchCard
                      key={match.id ?? match.kickoffAtUtcMs}
                      match={match}
                      variant="upcoming"
                    />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="border-b border-foreground/10 pb-6">
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  {String(results.length).padStart(2, "0")}{" "}
                  {pluralForm(results.length, MATCH_FORMS)}
                </p>
                <h2 className="mt-3 font-display text-5xl uppercase leading-none text-foreground sm:text-6xl">
                  Rezultati
                </h2>
              </div>

              <div className="mt-2">
                {results.length > 0 ? (
                  results.map((match) => (
                    <MatchCard
                      key={match.id ?? match.kickoffAtUtcMs}
                      match={match}
                      variant="result"
                    />
                  ))
                ) : (
                  <EmptyState>Još nema odigranih utakmica.</EmptyState>
                )}
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}
