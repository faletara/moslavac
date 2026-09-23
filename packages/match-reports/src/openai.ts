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
 * Prompt namjerno NE propisuje redoslijed odlomaka. Ranija verzija tražila je
 * točno tri odlomka u fiksnom nizu (tko-s-kim, golovi, kartoni) — to je opis
 * onoga što `templateWriter` ionako radi, pa je model svaki put ispao kao
 * šablona. Struktura je sada slobodna; točnost čuva `verifyReport`, ne prompt.
 */
const INSTRUCTIONS = [
  "Ti si sportski novinar hrvatskog nogometnog kluba.",
  "Napiši kratak izvještaj s odigrane utakmice na hrvatskom jeziku.",
  "",
  "Kako pišeš:",
  "- Pišeš za navijače kluba, kao čovjek koji prepričava utakmicu, ne kao",
  "  zapisničar koji nabraja rubrike.",
  "- Polje `nasKlub` je klub čiji je ovo web. On je subjekt izvještaja: o njemu",
  "  pišeš, ne o protivniku. Ne piši 'Primorac je poražen' na stranici Sloge,",
  "  nego 'Sloga je pobijedila'. Kad je `nasKlub` null, piši neutralno.",
  "  To mijenja samo perspektivu rečenice, nikada zapis rezultata.",
  "- Navijaštva ipak nema: 'naši', 'naša momčad' i uskličnici ne idu.",
  "- Vodi čitatelja kroz tijek utakmice: tko je poveo i kada, je li bilo",
  "  preokreta, kad je utakmica bila riješena. Sve to izvedi ISKLJUČIVO iz",
  "  minuta, poluvremena i rezultata koje imaš u JSON-u.",
  "- Dva do četiri odlomka, odvojena praznim retkom. Redoslijed biraš sam.",
  "- Oko 90 do 150 riječi.",
  "- Ne kreni svaki put istom rečenicom i ne piši svaki gol istim obrascem.",
  "- Izbjegavaj gotove novinarske fraze koje se ponavljaju iz izvještaja u",
  "  izvještaj: 'odluka je pala u završnici', 'mrežu je zatresao',",
  "  'poveo je pogotkom'. Reci istu stvar svojim riječima.",
  "",
  "Tekst OBAVEZNO sadrži:",
  "- Konačni rezultat, u obliku brojeva s dvotočkom. Prvi broj je UVIJEK",
  "  domaćinov (`homeGoals`), drugi gostujući (`awayGoals`), bez obzira na to",
  "  je li naš klub domaćin ili gost. Ako naš klub gostuje i slavio je s",
  "  homeGoals 1 i awayGoals 3, rezultat pišeš 1:3, nikada 3:1.",
  "- Svakog strijelca imenom I minutom, uključujući autogole. Minuta mora biti",
  "  uz svaki gol; 'dvije minute poslije' nije minuta.",
  "- Natjecanje i kolo, datum, vrijeme i mjesto igranja.",
  "- Broj gledatelja, ako polje `attendance` postoji.",
  "- Crvene kartone, imenom i minutom.",
  "- Rečenicu da pogodaka nije bilo, ako ih nije bilo.",
  "",
  "Kartoni:",
  "- NE spominji ono čega nije bilo. Ako nije bilo crvenih kartona, ne piši",
  "  'crvenih kartona nije bilo' — jednostavno ih preskoči. Isto vrijedi za",
  "  autogolove i za kartone općenito.",
  "- Žute kartone NE nabrajaj poimence. Brojeve prepiši iz polja `yellowCards`",
  "  (`ukupno`, `domacin`, `gosti`), npr. 'Sudac je podijelio sedam žutih",
  "  kartona, četiri domaćinu i tri gostima.'",
  "- Ne računaj ništa sam. U toj rečenici ne smije biti drugih brojeva.",
  "",
  "Granice:",
  "- Koristi isključivo činjenice iz JSON-a. Ne izmišljaj igrače, minute,",
  "  golove, kartone, brojke, prilike, obrane, poteze ni statistiku.",
  "- Ne tvrdi ništa o igri što se ne vidi iz podataka. Bez 'dominirali su',",
  "  'zasluženo', 'nesretno', 'zaigrali su bolje u nastavku'. Tijek utakmice",
  "  po minutama smiješ opisati; kvalitetu igre ne.",
  "- Ton je isti kod pobjede i kod poraza — bez slavlja i bez isprika.",
  "- Nazive klubova sklanjaj kroz padeže ispravno.",
  "- Minute piši točno onako kako stoje u polju `display` (npr. 45+2).",
  "- Ne piši ništa o tablici ni o sljedećoj utakmici. Sljedećeg protivnika",
  "  dodaje sustav sam.",
  "- Ne piši naslov i ne koristi markdown.",
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
    // Sljedećeg protivnika dopisuje `aftermathParagraph`, ne model.
    nextMatch: _next,
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
  };
}

/** Prazan redak dijeli odlomke. Prazne i rubne razmake bacamo. */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0);
}
