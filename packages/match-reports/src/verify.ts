import type { FactEvent, MatchFacts } from "./facts";

export interface VerifyResult {
  ok: boolean;
  problems: string[];
}

/**
 * Događaji koje izvještaj mora navesti poimence. Žuti kartoni namjerno nisu
 * ovdje: sedam imena s minutama je popis, a ne vijest, pa se za njih provjerava
 * samo da je broj točan.
 */
const namedEvents = (facts: MatchFacts): FactEvent[] => [
  ...facts.goals,
  ...facts.ownGoals,
  ...facts.redCards,
];

const allEvents = (facts: MatchFacts): FactEvent[] => [
  ...namedEvents(facts),
  ...facts.yellowCards,
];

/**
 * Minute u tekstu: „16'”, „45+2'” i „u 88. minuti”. Oba oblika moraju biti tu —
 * bez drugog je „Sloga je promašila u 88. minuti” prošlo kao ispravno.
 */
const MINUTE_IN_TEXT =
  /\b(\d{1,3}(?:\+\d{1,2})?)\s*(?:'|\.\s*minut\p{L}*)/gu;

/** Hrvatski brojevi do 20 — model broj kartona češće piše riječju nego brojkom. */
const NUMERAL_WORDS = [
  "nula", "jedan", "dva", "tri", "četiri", "pet", "šest", "sedam", "osam",
  "devet", "deset", "jedanaest", "dvanaest", "trinaest", "četrnaest",
  "petnaest", "šesnaest", "sedamnaest", "osamnaest", "devetnaest", "dvadeset",
];

/**
 * Brojevi koje tekst navodi u rečenicama o zadanoj temi. Minute se prvo brišu
 * iz cijelog teksta, jer „u 16. minuti” inače puca na točku i broj ostane.
 */
function numbersInSentencesAbout(text: string, topic: RegExp): Set<number> {
  const found = new Set<number>();

  const sentences = text
    .replace(MINUTE_IN_TEXT, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => topic.test(sentence));

  for (const sentence of sentences) {
    for (const match of sentence.matchAll(/\b(\d{1,3})\b/g)) {
      found.add(Number(match[1]));
    }

    for (const [value, word] of NUMERAL_WORDS.entries()) {
      if (value === 0) continue;

      // `\b` je u JS-u ASCII: ispred "č" nema granice riječi, pa `\bčetir`
      // nikad ne pogodi "četiri". Zato lookbehind na bilo koje slovo.
      if (new RegExp(`(?<!\\p{L})${word.slice(0, -1)}`, "iu").test(sentence)) {
        found.add(value);
      }
    }
  }

  return found;
}

/**
 * Usporedba očekivanih i nađenih brojeva. `requireAll` razdvaja dvije vrste
 * podatka: kartone tekst MORA navesti u cijelosti, a tablicu smije izostaviti.
 * Izmišljen broj je greška u oba slučaja.
 */
function numberProblems(
  label: string,
  expected: Set<number>,
  found: Set<number>,
  requireAll: boolean,
): string[] {
  const problems: string[] = [];

  if (requireAll) {
    for (const value of expected) {
      if (!found.has(value)) problems.push(`${label}: nedostaje ${value}`);
    }
  }

  for (const value of found) {
    if (!expected.has(value)) problems.push(`${label}: izmišljen broj ${value}`);
  }

  return problems;
}

/**
 * Provjera žutih kartona. Gleda samo rečenice u kojima se kartoni spominju —
 * brojka u „1. kolu” ili u satnici inače prođe kao broj kartona i kriva podjela
 * ostane neuhvaćena. Unutar tih rečenica traži točno tri broja: ukupno, koliko
 * domaćinu i koliko gostima. Svaki drugi broj je izmišljen.
 */
function yellowCardProblems(text: string, facts: MatchFacts): string[] {
  const total = facts.yellowCards.length;

  if (total === 0) return [];

  const home = facts.yellowCards.filter((e) => e.side === "home").length;
  const away = total - home;
  const found = numbersInSentencesAbout(text, /žut/i);

  if (found.size === 0) return [`žuti kartoni (${total}) se ne spominju`];

  return numberProblems(
    "broj žutih kartona ne štima",
    new Set([total, home, away].filter((n) => n > 0)),
    found,
    true,
  );
}

/**
 * Ime igrača kako ga tekst smije napisati. Doslovan `includes(player)` je
 * tražio puni oblik u nominativu — a živa hrvatska rečenica ime sklanja
 * („Bilušića”), a dugo ime krati („Joao Pedro Ramos Coutada” → „Coutada”).
 * Takav tekst nije bio netočan, ali je padao na šablonu. Zato tražimo prezime,
 * i to bez završnog samoglasnika, jer se padežni nastavak lijepi na kraj.
 */
function nameStem(word: string): string {
  const w = word.trim();

  return w.length > 3 && /[aeiou]$/i.test(w) ? w.slice(0, -1) : w;
}

const surnameStem = (player: string): string => {
  const parts = player.trim().split(/\s+/);

  return nameStem(parts[parts.length - 1] ?? player);
};

const firstNameStem = (player: string): string =>
  nameStem(player.trim().split(/\s+/)[0] ?? player);

/**
 * Traži korijen na početku riječi. Bez toga bi „Marić” prošao i unutar
 * „Zmarić”. Podniz duže riječi svjesno prolazi — „Coutad” mora uhvatiti
 * „Coutada” i „Coutade”.
 */
function mentions(text: string, stem: string): boolean {
  const escaped = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(`(?<!\\p{L})${escaped}`, "iu").test(text);
}

/**
 * Prezimena se ponavljaju (braća u istoj momčadi). Kad dva imenovana događaja
 * dijele prezime, tekst mora navesti i ime — inače ne znamo o kome piše.
 */
function playerProblems(text: string, facts: MatchFacts): string[] {
  const named = namedEvents(facts);
  const stems = named.map((e) => surnameStem(e.player));
  const problems: string[] = [];

  named.forEach((event, index) => {
    const own = stems[index] ?? event.player;

    const ambiguous = stems.some(
      (other, j) => j !== index && other.toLowerCase() === own.toLowerCase(),
    );

    const needed = ambiguous ? [firstNameStem(event.player), own] : [own];

    if (!needed.every((stem) => mentions(text, stem))) {
      problems.push(`nedostaje ${event.player}`);
    }

    if (!text.includes(event.display.replace(/'$/, ""))) {
      problems.push(`nedostaje minuta ${event.display} (${event.player})`);
    }
  });

  return problems;
}

/**
 * Provjera prije objave. Nema urednika koji bi uhvatio grešku (vidi ADR 0002),
 * pa brojevi moraju proći kroz kod. Provjeravamo četvero: točan rezultat, sve
 * golove i crvene kartone poimence, točan broj žutih kartona, i da tekst ne
 * spominje minutu koje u činjenicama nema.
 */
export function verifyReport(
  paragraphs: string[],
  facts: MatchFacts,
): VerifyResult {
  const text = paragraphs.join("\n");
  const problems: string[] = [];

  // Puko `includes("7:0")` prolazi i na satnici „17:00”, pa rezultat ne smije
  // imati znamenku ni dvotočku uza se.
  const score = `${facts.homeGoals}:${facts.awayGoals}`;

  const scoreStandsAlone = new RegExp(
    `(?<![\\d:])${facts.homeGoals}:${facts.awayGoals}(?![\\d:])`,
  );

  if (!scoreStandsAlone.test(text)) {
    problems.push(`rezultat ${score} nije naveden`);
  }

  problems.push(...playerProblems(text, facts));

  problems.push(...yellowCardProblems(text, facts));

  // Minute svih događaja su dopuštene, i onih koje tekst ne mora spomenuti —
  // model smije istaknuti pojedini žuti karton, samo ga ne smije izmisliti.
  const known = new Set(allEvents(facts).map((e) => e.display.replace(/'$/, "")));

  for (const match of text.matchAll(MINUTE_IN_TEXT)) {
    if (!known.has(match[1])) {
      problems.push(`izmišljena minuta ${match[1]}'`);
    }
  }

  return { ok: problems.length === 0, problems };
}
