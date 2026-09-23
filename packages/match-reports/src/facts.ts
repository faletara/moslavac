import { eventKind } from "@/lib/hns/eventKind";
import { formatDateTime, formatDateLong } from "@/lib/helpers/date";
import { formatEventTime } from "@/lib/helpers/events";
import { buildMatchSlug } from "@/lib/helpers/slug";
import type { Match, MatchEvent, MatchSide } from "@/types/hns";

/**
 * Jedan događaj koji izvještaj smije spomenuti. `display` je već formatirana
 * minuta ("47'", "45+2"), pa je ni šablona ni model ne moraju sami slagati.
 */
export interface FactEvent {
  side: MatchSide;
  team: string;
  player: string;
  display: string;
}

/** Sljedeća utakmica istog kluba, ako je HNS već ima u rasporedu. */
export interface NextMatchFact {
  opponent: string;
  atHome: boolean;
  dateLong: string;
  time: string;
}

/**
 * Sve što MatchReport smije tvrditi o odigranoj utakmici. Ništa izvan ovog
 * objekta ne smije završiti u tekstu — ni ocjena igre, ni tumačenje rezultata.
 */
export interface MatchFacts {
  matchId: number;
  /** Slug stranice utakmice na klupskom webu (`buildMatchSlug`). */
  matchSlug: string;
  competition: string | null;
  round: string | null;
  kickoffAtUtcMs: number;
  dateLong: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  homeHalfTimeGoals: number | null;
  awayHalfTimeGoals: number | null;
  venue: string | null;
  attendance: number | null;
  goals: FactEvent[];
  ownGoals: FactEvent[];
  yellowCards: FactEvent[];
  redCards: FactEvent[];
  /** Strana na kojoj igra klub čiji je ovo web. `null` kad HNS ne kaže. */
  clubSide: MatchSide | null;
  /**
   * Kontekst oko utakmice. Puni ga `publishMatchReports` iz zasebnog HNS
   * poziva; `toMatchFacts` ostaje čista funkcija i vraća `null`.
   */
  nextMatch: NextMatchFact | null;
}

const teamName = (match: Match, side: MatchSide): string =>
  (side === "home" ? match.homeTeam?.name : match.awayTeam?.name)?.trim() ?? "";

/**
 * HNS zna izostaviti `minute`, a događaj bez minute u izvještaju izgleda kao
 * izmišljotina. Takve preskačemo umjesto da ih prikažemo kao 0'.
 */
function toFactEvent(match: Match, event: MatchEvent): FactEvent | null {
  if (event.side !== "home" && event.side !== "away") return null;

  if (event.minute == null) return null;
  const player = event.player?.name?.trim();

  if (!player) return null;

  return {
    side: event.side,
    team: teamName(match, event.side),
    player,
    display: formatEventTime(event.minute, event.stoppageTime ?? undefined),
  };
}

/**
 * Prevodi HNS utakmicu u činjenice. Čista funkcija bez I/O — jedini ulaz su
 * podaci koje su `fetchMatchInfo` i `fetchMatchEvents` već dohvatili.
 */
export function toMatchFacts(
  match: Match,
  events: MatchEvent[],
): MatchFacts | null {
  if (match.id == null || match.kickoffAtUtcMs == null) return null;

  const home = teamName(match, "home");
  const away = teamName(match, "away");

  if (!home || !away) return null;

  const collect = (kind: ReturnType<typeof eventKind>): FactEvent[] =>
    events.flatMap((e) => {
      if (eventKind(e.type) !== kind) return [];

      const fact = toFactEvent(match, e);

      return fact === null ? [] : [fact];
    });

  const { time } = formatDateTime(match.kickoffAtUtcMs);

  return {
    matchId: match.id,
    matchSlug: buildMatchSlug(match),
    competition: match.competition?.name?.trim() || null,
    round: match.matchDayDescription?.trim() || match.round?.trim() || null,
    kickoffAtUtcMs: match.kickoffAtUtcMs,
    dateLong: formatDateLong(match.kickoffAtUtcMs),
    time,
    homeTeam: home,
    awayTeam: away,
    homeGoals: match.score.home.current ?? 0,
    awayGoals: match.score.away.current ?? 0,
    homeHalfTimeGoals: match.score.home.half,
    awayHalfTimeGoals: match.score.away.half,
    venue: match.facility?.name?.trim() || null,
    attendance: match.attendance,
    goals: collect("goal"),
    ownGoals: collect("own-goal"),
    yellowCards: collect("yellow"),
    redCards: collect("red"),
    clubSide: match.teamSide,
    nextMatch: null,
  };
}
