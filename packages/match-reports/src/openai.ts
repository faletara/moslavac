import OpenAI from "openai";
import type { MatchFacts } from "./facts";
import type { MatchReportWriter } from "./template";

/**
 * Srednji sloj nove generacije, oko $0.21 po sezoni. Manji `gpt-5.6-luna` je
 * na provjeri padao na podjeli kartona po momčadima. Zamjena modela je ovaj
 * jedan string; vidi ADR 0002.
 */
export const DEFAULT_MODEL = "gpt-5.6-terra";

/**
 * Kratak prompt, namjerno. Dugi popisi pravila i primjera rečenica davali su
 * tekst koji zvuči kao ispunjen obrazac. Ovdje je samo ton i nekoliko tvrdih
 * pravila bez kojih `verifyReport` odbije tekst.
 */
const INSTRUCTIONS = [
  "Ti si sportski novinar koji piše izvještaj s utakmice za web kluba",
  "`nasKlub`. Piši na hrvatskom, živo i prirodno, kao izvještaj u lokalnim",
  "novinama: jak prvi redak, zatim tijek utakmice kroz golove, pa kraj.",
  "Iz minuta i rezultata smiješ izvući priču — tko je poveo, je li bilo",
  "preokreta, kad je utakmica bila riješena. Ništa ne izmišljaj: ni prilike,",
  "ni obrane, ni ocjenu igre. Ako je `nasKlub` null, piši neutralno.",
  "",
  "Obavezno:",
  "- Rezultat kao brojevi s dvotočkom, domaćin prvi (npr. 1:3 kad gost",
  "  pobijedi s tri gola).",
  "- Svaki strijelac s minutom točno kao u `display`.",
  "- Crveni kartoni imenom i minutom, ako ih ima.",
  "- Žuti kartoni samo brojem (ukupno i po momčadi), u zasebnoj rečenici bez",
  "  drugih brojeva, s riječju 'žut'.",
  "- Natjecanje, kolo, datum, mjesto i gledatelji, usput, ne kao popis.",
  "- Ako postoji `sljedecaUtakmica`, završi njome: protivnik, datum i vrijeme.",
  "",
  "Tri do četiri odlomka, 120 do 180 riječi, odvojeni praznim retkom.",
  "Bez naslova, markdowna i uskličnika.",
].join("\n");

export interface OpenAiWriterOptions {
  apiKey: string;
  model?: string;
  /** Ubrizgava se u testovima; u produkciji se klijent radi iz `apiKey`. */
  client?: Pick<OpenAI, "responses">;
}

/**
 * Model kao pisac. Namjerno ne hvata greške — `withFallback` ih pretvara u
 * pad na šablonu, pa je odluka o rezervi na jednom mjestu.
 */
export const openAiWriter = (opts: OpenAiWriterOptions): MatchReportWriter => {
  const client = opts.client ?? new OpenAI({ apiKey: opts.apiKey });
  // `||`, ne `??`: prazan OPENAI_MATCH_REPORT_MODEL inače ruši svaki poziv.
  const model = opts.model || DEFAULT_MODEL;

  return async (facts: MatchFacts) => {
    const response = await client.responses.create({
      model,
      reasoning: { effort: "low" },
      instructions: INSTRUCTIONS,
      input: JSON.stringify(promptFacts(facts)),
    });

    return splitParagraphs(response.output_text ?? "");
  };
};

/**
 * Model vidi samo ovo. `matchId` i `matchSlug` su interni podaci i ne šalju se —
 * u tekstu nemaju što raditi, a mogli bi završiti u njemu.
 *
 * `clubSide` se ranije također skrivao, i to je bila greška: model nije znao
 * čiji je ovo web, pa je izvještaj na stranici Sloge pisao iz kuta protivnika
 * („Primorac je poražen…”). Zato ide van kao `nasKlub`.
 */
function promptFacts(facts: MatchFacts) {
  const {
    matchId: _id,
    matchSlug: _slug,
    clubSide,
    kickoffAtUtcMs: _ms,
    yellowCards,
    nextMatch,
    ...rest
  } = facts;

  // Žuti kartoni idu kao gotovi zbrojevi, ne kao popis. Model ih inače mora
  // sam prebrojati po momčadima, a to je aritmetika koju kod već zna — i na
  // kojoj je manji model padao na provjeri.
  const home = yellowCards.filter((e) => e.side === "home").length;

  return {
    ...rest,
    // `null` kad HNS ne kaže stranu — tada izvještaj ostaje neutralan.
    nasKlub: clubSide
      ? {
          ime: clubSide === "home" ? facts.homeTeam : facts.awayTeam,
          igraKao: clubSide === "home" ? "domacin" : "gost",
        }
      : null,
    yellowCards: {
      ukupno: yellowCards.length,
      domacin: home,
      gosti: yellowCards.length - home,
    },
    // Ključ izostaje kad rasporeda nema — prompt tada kaže da ne piše ništa.
    ...(nextMatch && {
      sljedecaUtakmica: {
        protivnik: nextMatch.opponent,
        gdje: nextMatch.atHome ? "kod kuće" : "u gostima",
        datum: nextMatch.dateLong,
        vrijeme: nextMatch.time,
      },
    }),
  };
}

/** Prazan redak dijeli odlomke. Prazne i rubne razmake bacamo. */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0);
}
