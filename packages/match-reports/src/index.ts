import { getCompetitionCategory } from "@/lib/helpers/competition";
import { getActiveHnsContext } from "@/lib/hns/context";
import { formatDateLong, formatDateTime } from "@/lib/helpers/date";
import {
  fetchAllMatches,
  fetchMatchEvents,
  fetchMatchInfo,
  fetchUpcomingMatches,
} from "@/lib/hns/matches";
import { isFinished } from "@/lib/hns/matchStatus";
import type { Match } from "@/types/hns";
import { toMatchFacts, type MatchFacts, type NextMatchFact } from "./facts";
import {
  aftermathParagraph,
  templateTitle,
  type MatchReportWriter,
} from "./template";

export type { MatchFacts, FactEvent, NextMatchFact } from "./facts";

export type { MatchReportWriter } from "./template";

export { templateWriter, templateTitle } from "./template";

export { openAiWriter, DEFAULT_MODEL } from "./openai";

export { withFallback, type FallbackEvent } from "./fallback";

export { verifyReport, type VerifyResult } from "./verify";

/** Novost spremna za spremanje. Sadržaj su odlomci, ne gotov Lexical. */
export interface MatchReportDraft {
  title: string;
  paragraphs: string[];
  /** Datum utakmice, ne datum obrade — novost sjeda na pravo mjesto u arhivi. */
  publishedAt: Date;
  sourceMatchId: number;
  /** Slug stranice utakmice; punu adresu slaže pohrana iz tenantove putanje. */
  matchSlug: string;
}

/**
 * Pohrana novosti. Payload u produkciji, `Map` u testovima — jedini razlog
 * zašto je ovo šav, a ne izravan poziv Payloada iz ovog modula.
 */
export interface NewsStore {
  has(sourceMatchId: number): Promise<boolean>;
  create(draft: MatchReportDraft): Promise<void>;
}

export interface PublishSummary {
  published: number[];
  /** Utakmice koje već imaju novost ili nemaju dovoljno podataka. */
  skipped: number[];
  failed: { matchId: number; error: string }[];
}

export interface PublishOptions {
  writer: MatchReportWriter;
  store: NewsStore;
  /** Ubrizgava se u testovima da prozor od 7 dana bude predvidljiv. */
  now?: Date;
  /** Koliko dana unatrag gledamo. HNS kasni s unosom, zato ne samo jučer. */
  windowDays?: number;
}

/**
 * Rezultat kaže da su golovi pali, a događaja nema — HNS ih još nije upisao,
 * ili je poziv pao (`fetchMatchEvents` grešku vraća kao prazan niz). Objaviti
 * sada značilo bi trajno „Golova nije bilo” uz naslov 2:1, jer `sourceMatchId`
 * spriječi drugi pokušaj. Pustimo utakmicu — prozor od 7 dana je uhvati sutra.
 */
function hasUsableEvents(facts: MatchFacts): boolean {
  const scored = facts.homeGoals + facts.awayGoals > 0;

  return !scored || facts.goals.length + facts.ownGoals.length > 0;
}

/**
 * Prva sljedeća seniorska utakmica kluba nakon ove. Kod izvještaja objavljenog
 * danima poslije, „sljedeća” je prva koja tek dolazi — ne ona odmah iza u
 * rasporedu. Raspored nosi sve uzraste, pa bez filtra juniori ispadnu protivnik.
 */
async function fetchNextMatch(
  match: Match,
  clubSide: "home" | "away" | null,
): Promise<NextMatchFact | null> {
  const upcoming = await fetchUpcomingMatches();

  const next = upcoming.find(
    (m) =>
      isSeniorMatch(m) &&
      m.kickoffAtUtcMs != null &&
      m.kickoffAtUtcMs > (match.kickoffAtUtcMs ?? 0),
  );

  if (!next?.kickoffAtUtcMs) return null;

  const atHome = next.teamSide === "home";
  const opponent = (atHome ? next.awayTeam?.name : next.homeTeam?.name)?.trim();

  if (!opponent || next.teamSide == null) return null;
  void clubSide;

  return {
    opponent,
    atHome,
    dateLong: formatDateLong(next.kickoffAtUtcMs),
    time: formatDateTime(next.kickoffAtUtcMs).time,
  };
}

const DAY_MS = 86_400_000;

const DEFAULT_WINDOW_DAYS = 7;

/**
 * Seniorska utakmica. Kad tenant ima `seniorCompetitionFilter`, on je mjerodavan
 * — inače bi kup, prijateljske i veteranske utakmice prošle kao seniorske, jer
 * `getCompetitionCategory` sve bez oznake mlađeg uzrasta svrsta u seniore.
 */
function isSeniorMatch(match: Match): boolean {
  const name = match.competition?.name ?? "";
  const filter = getActiveHnsContext()?.seniorCompetitionFilter?.trim();

  if (filter) return name.toLowerCase().includes(filter.toLowerCase());

  return getCompetitionCategory(name) === "seniors";
}

/** Utakmica je kandidat ako je seniorska, odigrana, i pala u prozor. */
function isCandidate(match: Match, fromMs: number, toMs: number): boolean {
  if (!isFinished(match)) return false;

  if (!isSeniorMatch(match)) return false;
  const kickoff = match.kickoffAtUtcMs;

  return kickoff != null && kickoff >= fromMs && kickoff <= toMs;
}

/**
 * Jedini javni ulaz modula. Pokreće se unutar `runWithHnsContext`, jednom po
 * tenantu koji ima uključenu rubriku izvještaja.
 *
 * Objavljuje bez ljudske provjere (ADR 0002): pisac je već omotan u
 * `withFallback`, pa je tekst koji stigne ovamo ili provjeren ili šablonski.
 */
export async function publishMatchReports(
  opts: PublishOptions,
): Promise<PublishSummary> {
  const nowMs = (opts.now ?? new Date()).getTime();
  const fromMs = nowMs - (opts.windowDays ?? DEFAULT_WINDOW_DAYS) * DAY_MS;

  const summary: PublishSummary = { published: [], skipped: [], failed: [] };

  const matches = (await fetchAllMatches()).filter((m) =>
    isCandidate(m, fromMs, nowMs),
  );

  for (const match of matches) {
    const matchId = match.id;

    if (matchId == null) continue;

    try {
      if (await opts.store.has(matchId)) {
        summary.skipped.push(matchId);
        continue;
      }

      // `fetchAllMatches` daje sažetak; detalj nosi gledatelje i poluvremena.
      const [detail, events] = await Promise.all([
        fetchMatchInfo({ matchId }),
        fetchMatchEvents({ matchId }),
      ]);

      const base = toMatchFacts(detail ?? match, events);

      if (!base || !hasUsableEvents(base)) {
        summary.skipped.push(matchId);
        continue;
      }

      // Sljedeći protivnik je dodatak, ne uvjet: ako HNS zakaže, izvještaj
      // svejedno izlazi, samo bez tog konteksta.
      const nextMatch = await fetchNextMatch(detail ?? match, base.clubSide)
        .catch(() => null);

      const facts: MatchFacts = { ...base, nextMatch };

      // Zadnji odlomak nije model — vidi `aftermathParagraph`.
      const written = await opts.writer(facts);
      const closing = aftermathParagraph(facts);

      await opts.store.create({
        title: templateTitle(facts),
        paragraphs: closing ? [...written, closing] : written,
        publishedAt: new Date(facts.kickoffAtUtcMs),
        sourceMatchId: matchId,
        matchSlug: facts.matchSlug,
      });
      summary.published.push(matchId);
    } catch (error) {
      summary.failed.push({
        matchId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return summary;
}
