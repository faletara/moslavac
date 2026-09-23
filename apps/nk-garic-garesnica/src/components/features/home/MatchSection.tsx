import {
  AnimatedCounter,
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import { HnsCrest } from "@/components/HnsCrest";
import { formatDateParts, formatDateShort } from "@/lib/helpers/date";
import type { Match, MatchOutcome, Team } from "@/types/hns";

type MatchSectionProps = {
  /** Istaknuta utakmica — sljedeća, ili (van sezone) posljednja odigrana. */
  featured: Match;
  /** Zadnje odigrane utakmice, kronološki (najstarija prva). Bez istaknute. */
  results: Match[];
  /** Nadolazeći termini, kronološki. Bez istaknute. */
  fixtures: Match[];
  /** true kad je istaknuta utakmica nadolazeća (postoji sljedeća). */
  isNext: boolean;
};

/** Golovi za prikaz — završena utakmica koristi `current`, pa `regular`. */
function goals(side: Match["score"]["home"]): number | null {
  return side.current ?? side.regular;
}

/** Odigrana utakmica bez upisanog rezultata ne smije rendati prazan razmak. */
function scoreText(value: number | null): string {
  return value === null ? "–" : String(value);
}

function isPlayed(m: Match): boolean {
  return m.liveStatus === "PLAYED";
}

/** HNS ponekad nema `matchDay`, a `round` vrati kao goli broj ("30"). */
function roundLabel(m: Match): string {
  if (m.matchDay != null) return `${m.matchDay}. kolo`;
  const round = m.round?.trim();

  if (!round) return "";

  return /^\d+$/.test(round) ? `${round}. kolo` : round;
}

const OUTCOME_LABEL: Record<MatchOutcome, string> = {
  W: "Pobjeda",
  D: "Neriješeno",
  L: "Poraz",
};

/** Boja koja nosi ishod — točkica ispod kartice i ploča koja proviruje iza grba. */
const OUTCOME_ACCENT: Record<MatchOutcome, string> = {
  W: "bg-club",
  D: "bg-foreground/45",
  L: "bg-border",
};

/** Meka, slojevita sjena umjesto ruba — čist "premium" dojam bez okvira. */
const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_36px_-22px_rgba(15,23,42,0.35)]";

/**
 * Asimetrični raspored: plakat istaknute utakmice (jeka Hero tipografije —
 * puno ime doma, ime gostiju u obrisu) lijevo, uz ograđen panel s mrežom
 * rezultata/termina desno. Panel se uvijek popuni po širini bez obzira na
 * broj kartica — nema "otoka" praznog prostora kao kod fiksnog jednorednog
 * niza. Forma je vidljiva izravno na karticama rezultata (traka boje).
 */
export default function MatchSection({
  featured,
  results,
  fixtures,
  isNext,
}: MatchSectionProps) {
  const hasRail = results.length > 0 || fixtures.length > 0;
  const competition = featured.competition?.name;
  // Uz nadolazeću istaknutu traka je vremenska crta: prošlost → "Danas" →
  // termini, pa ide uzlazno. Kad je istaknuta zadnja odigrana (van sezone),
  // traka je popis rezultata unatrag — prva kartica do plakata mora biti kolo
  // neposredno prije istaknutog, ne najstarije.
  const orderedResults = isNext ? results : [...results].reverse();

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto w-full max-w-350 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <FadeInView>
            <h2 className="font-display text-6xl uppercase leading-[0.88] tracking-tight text-foreground lg:text-8xl">
              Rezultati <span className="text-club">&amp; raspored</span>
            </h2>
          </FadeInView>
          {competition && (
            <FadeInView delay={0.08}>
              <p className="font-mono text-[13px] uppercase tracking-widest text-muted-foreground sm:pb-2">
                {competition}
              </p>
            </FadeInView>
          )}
        </div>

        {hasRail ? (
          <FadeInView
            delay={0.1}
            className="mt-14 grid items-start gap-6 lg:mt-20 lg:grid-cols-[0.62fr_1fr] lg:gap-8"
          >
            <FeaturedPoster match={featured} isNext={isNext} />

            <StaggerContainer
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              staggerChildren={0.06}
            >
              {orderedResults.map((m) => (
                <StaggerItem key={m.id}>
                  <ResultCard match={m} />
                </StaggerItem>
              ))}

              {fixtures.length > 0 && (
                <StaggerItem className="col-span-full">
                  <TodayDivider />
                </StaggerItem>
              )}

              {fixtures.map((m) => (
                <StaggerItem key={m.id}>
                  <FixtureCard match={m} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeInView>
        ) : (
          <FadeInView className="mt-14 flex justify-center lg:mt-20">
            <div className="w-full max-w-md">
              <FeaturedPoster match={featured} isNext={isNext} />
            </div>
          </FadeInView>
        )}
      </div>
    </section>
  );
}

function TodayDivider() {
  return (
    <div className="flex items-center gap-3 py-1">
      <span aria-hidden className="h-px flex-1 bg-border" />
      <span className="shrink-0 rounded-full bg-club px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-white">
        Danas
      </span>
      <span
        aria-hidden
        className="h-px flex-1 border-t border-dashed border-club/40"
      />
    </div>
  );
}

/**
 * Kartica odigrane utakmice. Gornji red kao tiha navigacijska traka (kolo,
 * datum), naslov je ime protivnika, a "foto" mjesto zauzima pločica s OBA
 * grba i rezultatom u stvarnom poretku doma:gosti — Garićev grb ima plavi
 * prsten da se odmah vidi koja je strana "mi", a njegov broj nosi boju
 * ishoda umjesto da UX ovisi o sitnoj oznaci na dnu. Iza pločice proviruje
 * druga, blago pomaknuta ploča u boji ishoda.
 */
function ResultCard({ match }: { match: Match }) {
  const hg = goals(match.score.home);
  const ag = goals(match.score.away);
  const opponent = match.teamSide === "home" ? match.awayTeam : match.homeTeam;
  const venue = match.teamSide === "home" ? "Doma" : "Gosti";

  const date = match.kickoffAtUtcMs
    ? formatDateShort(match.kickoffAtUtcMs)
    : "";

  const accentCls = match.teamResult
    ? OUTCOME_ACCENT[match.teamResult]
    : "bg-border";

  const ourScoreCls =
    match.teamResult === "W"
      ? "text-club"
      : match.teamResult === "L"
        ? "text-muted-foreground"
        : "text-foreground";

  return (
    <div
      className={`flex h-full flex-col rounded-[28px] bg-background p-4 transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${CARD_SHADOW}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {roundLabel(match)}
        </span>
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {date}
        </span>
      </div>

      {/* `title` drži puno ime dohvatljivim kad ga clamp odreže. */}
      <p
        className="mt-3 line-clamp-1 font-display text-xl uppercase leading-none tracking-tight text-foreground"
        title={opponent?.name ?? undefined}
      >
        {opponent?.name ?? "-"}
      </p>
      <p className="mt-0.5 text-xs font-medium text-muted-foreground">
        {venue}
      </p>

      <div className="relative mt-4">
        <span
          aria-hidden
          className={`absolute inset-0 translate-x-2 translate-y-2 rounded-lg opacity-80 ${accentCls}`}
        />
        <div className="relative flex items-center justify-center gap-2.5 rounded-lg bg-secondary/70 py-5">
          <TeamCrest team={match.homeTeam} ours={match.teamSide === "home"} />
          <span className="font-display text-2xl leading-none tracking-tight tabular-nums">
            <span className={match.teamSide === "home" ? ourScoreCls : "text-foreground/60"}>
              {scoreText(hg)}
            </span>
            <span className="mx-0.5 text-muted-foreground/40">:</span>
            <span className={match.teamSide === "away" ? ourScoreCls : "text-foreground/60"}>
              {scoreText(ag)}
            </span>
          </span>
          <TeamCrest team={match.awayTeam} ours={match.teamSide === "away"} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span aria-hidden className={`size-1.5 rounded-full ${accentCls}`} />
        {match.teamResult ? OUTCOME_LABEL[match.teamResult] : "Odigrano"}
      </div>
    </div>
  );
}

/** Grb u pločici rezultata — Garićev ima plavi prsten da se izdvoji kao "mi". */
function TeamCrest({ team, ours }: { team: Team | null; ours: boolean }) {
  return (
    <span
      className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-background ${
        ours ? "ring-2 ring-club" : "opacity-70"
      }`}
    >
      <HnsCrest
        picture={team?.picture}
        name={team?.name}
        size={36}
        className="size-8 object-contain"
      />
    </span>
  );
}

/**
 * Kartica termina — ista obitelj kao odigrana, samo je "foto" pločica u
 * klupskoj boji s isprekidanim rubom umjesto punog ishoda, jer rezultat još
 * ne postoji.
 */
function FixtureCard({ match }: { match: Match }) {
  const opponent = match.teamSide === "home" ? match.awayTeam : match.homeTeam;

  const parts = match.kickoffAtUtcMs
    ? formatDateParts(match.kickoffAtUtcMs)
    : null;

  const venue = match.teamSide === "home" ? "Doma" : "Gosti";

  return (
    <div
      className={`flex h-full flex-col rounded-[28px] bg-background p-4 transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${CARD_SHADOW}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {roundLabel(match)}
        </span>
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {parts ? `${parts.day}. ${parts.monthShort}` : ""}
        </span>
      </div>

      {/* `title` drži puno ime dohvatljivim kad ga clamp odreže. */}
      <p
        className="mt-3 line-clamp-1 font-display text-xl uppercase leading-none tracking-tight text-foreground"
        title={opponent?.name ?? undefined}
      >
        {opponent?.name ?? "-"}
      </p>
      <p className="mt-0.5 text-xs font-medium text-muted-foreground">
        {venue}
      </p>

      <div className="relative mt-4">
        <span
          aria-hidden
          className="absolute inset-0 translate-x-2 translate-y-2 rounded-lg border-2 border-dashed border-club/35"
        />
        <div className="relative flex items-center justify-center gap-2.5 rounded-lg bg-club/10 py-5">
          <TeamCrest team={match.homeTeam} ours={match.teamSide === "home"} />
          <span className="font-display text-xl leading-none tracking-tight tabular-nums text-club">
            {parts?.time ?? "VS"}
          </span>
          <TeamCrest team={match.awayTeam} ours={match.teamSide === "away"} />
        </div>
      </div>

      {/* Donji redak nosi igralište, ne ponovljeni "Doma"/"Gosti" koji već stoji
          pod imenom protivnika. Bez igrališta redak otpada. */}
      {match.facility?.name && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full ring-1 ring-inset ring-club"
          />
          <span className="truncate" title={match.facility.name}>
            {match.facility.name}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Plakat istaknute utakmice — dosljedno tornju sitewide identiteta: ime
 * domaćina puno bijelo, ime gostiju u obrisu (isti motiv kao Hero). Grbovi i
 * rezultat sjede u istoj "tile" pločici kao na karticama rezultata/termina
 * (bg-white/5), pa cijela obitelj kartica dijeli isti jezik. Podnožje je
 * jedan redak (mjesto lijevo, kolo desno) umjesto dupliciranog datuma i
 * odvojene trake boje.
 */
function FeaturedPoster({ match, isNext }: { match: Match; isNext: boolean }) {
  const played = isPlayed(match);

  const parts = match.kickoffAtUtcMs
    ? formatDateParts(match.kickoffAtUtcMs)
    : null;

  const dateShort = match.kickoffAtUtcMs
    ? formatDateShort(match.kickoffAtUtcMs)
    : "";

  const venue = match.facility?.name ?? null;
  const hg = goals(match.score.home);
  const ag = goals(match.score.away);
  const round = roundLabel(match);

  return (
    <div className="relative h-full">
      <div
        aria-hidden
        className="absolute -inset-x-4 -inset-y-3 -z-10 rounded-4xl bg-club/25 opacity-70 blur-2xl"
      />

      <div className="relative isolate flex h-full flex-col overflow-hidden rounded-4xl bg-navy-deep text-white shadow-2xl shadow-navy-deep/40 ring-1 ring-white/10">
        <span
          aria-hidden
          className="halftone halftone-fade-b pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 opacity-20"
          // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
          // standardna svojstva, pa ga inline stil ovdje mora proširiti.
          style={
            { "--halftone-color": "rgba(255,255,255,0.65)" } as React.CSSProperties
          }
        />

        <div className="flex items-center justify-between gap-2 px-6 pt-6 font-mono text-xs uppercase tracking-[0.12em] text-white/75">
          <span className="rounded-full bg-club px-2.5 py-1 font-bold text-white">
            {isNext ? "Slijedi" : "Zadnja"}
          </span>
          <span className="tabular-nums">{dateShort}</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 text-center">
          {/* `line-clamp` postavlja `overflow: hidden`, a `leading` < 1 skraćuje
              kutiju prvog reda ispod visine glifa — bez `pt` se kvačice (Ć, Š)
              odrežu. Padding je unutar overflow kutije, pa vraća prostor bez
              popuštanja proreda. */}
          <p className="line-clamp-2 pt-[0.2em] font-display uppercase leading-[0.87] tracking-tight text-[clamp(1.7rem,3.8vw,2.75rem)] text-white">
            {match.homeTeam?.name ?? "-"}
          </p>

          <div className="flex items-center justify-center gap-4 rounded-sm bg-white/5 px-5 py-4 sm:gap-5">
            <CrestBadge team={match.homeTeam} />
            <span className="shrink-0 font-display text-4xl leading-none tracking-tight tabular-nums sm:text-5xl">
              {played ? (
                <>
                  <AnimatedCounter value={hg ?? 0} />
                  <span className="mx-1 text-white/30">:</span>
                  <AnimatedCounter value={ag ?? 0} />
                </>
              ) : (
                (parts?.time ?? "VS")
              )}
            </span>
            <CrestBadge team={match.awayTeam} />
          </div>

          <p
            className="text-stroke line-clamp-2 pt-[0.2em] font-display uppercase leading-[0.87] tracking-tight text-[clamp(1.7rem,3.8vw,2.75rem)]"
            // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
            // standardna svojstva, pa ga inline stil ovdje mora proširiti.
            style={{ "--text-stroke-color": "#ffffff" } as React.CSSProperties}
          >
            {match.awayTeam?.name ?? "-"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-6 py-4 font-mono text-xs uppercase tracking-widest text-white/75">
          <span className="truncate">{venue ?? ""}</span>
          {round && <span className="shrink-0">{round}</span>}
        </div>
      </div>
    </div>
  );
}

function CrestBadge({ team }: { team: Team | null }) {
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/15 sm:size-14">
      <HnsCrest
        picture={team?.picture}
        name={team?.name}
        size={44}
        className="size-8 object-contain sm:size-9"
      />
    </span>
  );
}
