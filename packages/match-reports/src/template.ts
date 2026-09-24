import { formatDateLong } from "@/lib/helpers/date";
import { pluralForm, pluralize } from "@/lib/helpers/plural";
import type { FactEvent, MatchFacts } from "./facts";

/**
 * Pisac izvještaja: iz činjenica radi odlomke teksta. Dva adaptera — šablona
 * (uvijek točna, uvijek ista) i jezični model (prirodniji, ali se provjerava).
 */
export type MatchReportWriter = (facts: MatchFacts) => Promise<string[]>;

const VIEWERS = { one: "gledatelj", few: "gledatelja", many: "gledatelja" };

const YELLOW_COUNT = {
  one: "žuti karton",
  few: "žuta kartona",
  many: "žutih kartona",
};

const RED = { one: "Crveni karton", few: "Crvene kartone", many: "Crvene kartone" };

/**
 * Šablona nikad ne sklanja vlastita imena. "Treća NL Jug 26/27" u genitivu je
 * "Treće NL Jug 26/27", a to se iz naziva ne da izvesti bez pogađanja. Umjesto
 * toga imena stoje kao apozicija uz sklonjivu imenicu ("natjecanja X"), a na
 * mjestima gdje bi klub morao u padež govorimo o „domaćoj” i „gostujućoj”
 * momčadi. Rečenica time ostaje i točna i pitka.
 */
const SIDE_NOUN = {
  home: { from: "iz domaće momčadi", forTeam: "Za domaću momčad" },
  away: { from: "iz gostujuće momčadi", forTeam: "Za gostujuću momčad" },
} as const;

const WEEKDAY = new Map([
  ["Sun", "u nedjelju"],
  ["Mon", "u ponedjeljak"],
  ["Tue", "u utorak"],
  ["Wed", "u srijedu"],
  ["Thu", "u četvrtak"],
  ["Fri", "u petak"],
  ["Sat", "u subotu"],
]);

/**
 * Dan u tjednu po zagrebačkom zidnom satu. Vercel radi u UTC-u, pa bi utakmica
 * u 00:30 po hrvatskom vremenu inače ispala dan ranije.
 */
const ZAGREB_WEEKDAY = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Zagreb",
  weekday: "short",
});

/** Nabraja imena s minutama: „A (16'), B (47') i C (58')”. */
function joinNames(events: FactEvent[]): string {
  const parts = events.map((e) => `${e.player} (${e.display})`);

  if (parts.length <= 1) return parts.join("");

  return `${parts.slice(0, -1).join(", ")} i ${parts[parts.length - 1]}`;
}

/** Isto, ali razdvojeno po momčadima: „A (16') iz gostujuće momčadi te B …”. */
function joinBySide(events: FactEvent[]): string {
  const groups = (["home", "away"] as const).flatMap((side) => {
    const list = events.filter((e) => e.side === side);

    if (list.length === 0) return [];

    return [{ side, list }];
  });

  if (groups.length === 1) return joinNames(groups[0].list);

  return groups
    .map((g) => `${joinNames(g.list)} ${SIDE_NOUN[g.side].from}`)
    .join(" te ");
}

/**
 * HNS kolo stiže u dva oblika: kao riječ („1. kolo”) ili kao goli broj („1”).
 * Oba moraju dati lokativ „1. kolu”, inače rečenica ispadne „u 1 natjecanja”.
 */
function roundInLocative(round: string | null): string | null {
  const value = round?.trim();

  if (!value) return null;

  if (/^\d+\.?$/.test(value)) return `${value.replace(/\.$/, "")}. kolu`;

  return value.replace(/\bkolo\b/i, "kolu");
}

function opening(facts: MatchFacts): string {
  const score = `${facts.homeGoals}:${facts.awayGoals}`;
  const round = roundInLocative(facts.round);
  const where = round ? `u ${round}` : "";

  const competition = facts.competition
    ? `${where ? " " : ""}natjecanja ${facts.competition}`
    : "";

  const context = where || competition ? ` ${where}${competition}` : "";

  return `${facts.homeTeam} i ${facts.awayTeam} odigrali su ${score}${context}.`;
}

function occasion(facts: MatchFacts): string {
  // `Intl` s `weekday: "short"` uvijek vrati jedan od sedam ključeva; `?? ""`
  // postoji da rečenica ostane čitljiva i ako se format ikad promijeni.
  const weekday = WEEKDAY.get(ZAGREB_WEEKDAY.format(facts.kickoffAtUtcMs)) ?? "";

  const parts = [
    `Utakmica je odigrana ${weekday ? `${weekday}, ` : ""}${formatDateLong(facts.kickoffAtUtcMs)} u ${facts.time}`,
  ];

  if (facts.venue) parts.push(` na igralištu ${facts.venue}`);

  // HNS zna poslati 0 kad broj nije upisan; „pred 0 gledatelja” nije podatak.
  if (facts.attendance != null && facts.attendance > 0) {
    parts.push(`, pred ${pluralize(facts.attendance, VIEWERS)}`);
  }

  return `${parts.join("")}.`;
}

function goals(facts: MatchFacts): string {
  const all = [...facts.goals, ...facts.ownGoals];

  if (all.length === 0) {
    const goallessHalf =
      facts.homeHalfTimeGoals === 0 && facts.awayHalfTimeGoals === 0;

    return goallessHalf
      ? "Golova nije bilo ni u prvom ni u drugom poluvremenu."
      : "Golova nije bilo.";
  }

  const sentences: string[] = [];

  for (const side of ["home", "away"] as const) {
    const scored = facts.goals.filter((e) => e.side === side);

    if (scored.length > 0) {
      // „preko Ivan Marić” bi tražilo genitiv imena. Ovako je ime subjekt i
      // ostaje u nominativu, a jedina sklonjena riječ je fiksna („momčad”).
      const verb = scored.length === 1 ? "pogodio je" : "pogodili su";
      sentences.push(
        `${SIDE_NOUN[side].forTeam} ${verb} ${joinNames(scored)}.`,
      );
    }
  }

  if (facts.ownGoals.length > 0) {
    const own = facts.ownGoals.length === 1
      ? "Autogol je zabio"
      : "Autogole su zabili";

    sentences.push(`${own} ${joinBySide(facts.ownGoals)}.`);
  }

  return sentences.join(" ");
}

function cards(facts: MatchFacts): string {
  const sentences: string[] = [];

  // Žuti kartoni idu brojem, ne popisom imena: sedam imena s minutama je
  // zapisnik, a ne vijest. Crveni ostaju poimence — oni mijenjaju utakmicu.
  const yellow = facts.yellowCards.length;

  if (yellow > 0) {
    const home = facts.yellowCards.filter((e) => e.side === "home").length;
    const away = yellow - home;

    const split =
      home > 0 && away > 0 ? `, ${home} domaćinu i ${away} gostima` : "";

    sentences.push(
      `Sudac je podijelio ${pluralize(yellow, YELLOW_COUNT)}${split}.`,
    );
  }

  if (facts.redCards.length > 0) {
    const verb = facts.redCards.length === 1 ? "dobio je" : "dobili su";
    sentences.push(
      `${pluralForm(facts.redCards.length, RED)} ${verb} ${joinBySide(facts.redCards)}.`,
    );
  }

  // Nema kartona — nema ni odlomka. Rečenica „Kartona nije bilo” je
  // popunjavanje prostora, ne vijest.
  return sentences.join(" ");
}

/**
 * Kontekst nakon utakmice: sljedeći protivnik, šablonskim riječima. Model ga
 * piše svojim riječima; ako ga ispusti, `verifyReport` odbije tekst i ova
 * rečenica dođe sa šablonom.
 *
 * Mjesto na tablici je namjerno izbačeno: pozicija se mijenja svakim kolom, a
 * novost stoji u arhivi zauvijek, pa bi tvrdnja ubrzo bila netočna.
 */
export function aftermathParagraph(facts: MatchFacts): string {
  const sentences: string[] = [];

  if (facts.nextMatch) {
    const where = facts.nextMatch.atHome ? "kod kuće" : "u gostima";
    sentences.push(
      `Sljedeći protivnik ${where}: ${facts.nextMatch.opponent}, ` +
        `${facts.nextMatch.dateLong} u ${facts.nextMatch.time}.`,
    );
  }

  return sentences.join(" ");
}

/** Zadani pisac. Nikad ne griješi jer ništa ne izmišlja — samo preslaguje. */
export const templateWriter: MatchReportWriter = async (facts) => {
  const paragraphs = [`${opening(facts)} ${occasion(facts)}`, goals(facts)];
  const cardsText = cards(facts);

  if (cardsText) paragraphs.push(cardsText);

  const closing = aftermathParagraph(facts);

  if (closing) paragraphs.push(closing);

  return paragraphs;
};

/** Naslov novosti. Uvijek iz šablone — model ga ne piše. */
export const templateTitle = (facts: MatchFacts): string =>
  `${facts.homeTeam} – ${facts.awayTeam} ${facts.homeGoals}:${facts.awayGoals}`;
