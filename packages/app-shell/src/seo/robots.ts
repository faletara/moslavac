import type { MetadataRoute } from "next";

/**
 * Pravila za robote vrijede jednako za svaki klub na platformi, pa žive ovdje:
 * promjena politike prema tražilicama ili AI robotima izvodi se jednom.
 */

/**
 * Roboti AI tražilica čitaju robots.txt konzervativno — izostanak pravila umiju
 * protumačiti kao zabranu. Zato ih se propušta izrijekom; oni pokreću citiranje
 * u ChatGPT-u, Perplexityju, Claudeu i Google AI odgovorima.
 */
const AI_SEARCH_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
];

/**
 * Content Signals (contentsignals.org) izriču namjeru kluba nad sadržajem:
 * `search` je indeksiranje za tražilice, `ai-input` je dohvat sadržaja kao
 * izvora za AI odgovor uz citat, `ai-train` je treniranje modela. Klubovi žele
 * biti nađeni i citirani, ali ne i poslužiti kao građa za treniranje.
 */
type ContentSignals = {
  aiTrain: boolean;
  search: boolean;
  aiInput: boolean;
};

const CITE_BUT_DO_NOT_TRAIN: ContentSignals = {
  aiTrain: false,
  search: true,
  aiInput: true,
};

const NOTHING_ALLOWED: ContentSignals = {
  aiTrain: false,
  search: false,
  aiInput: false,
};

type Rule = {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  signals: ContentSignals;
};

const RULES: Rule[] = [
  {
    userAgent: "*",
    // Posrednik za slike se propušta da tražilice dohvate OG slike i
    // grbove (uže pravilo Allow nadjačava širu zabranu /api/). Same slike
    // nose X-Robots-Tag: noindex, pa ostaju izvan pretraživanja slika.
    allow: ["/", "/api/images/"],
    disallow: "/api/",
    signals: CITE_BUT_DO_NOT_TRAIN,
  },
  // Common Crawl skuplja podatke za treniranje modela, ne za pretraživanje.
  {
    userAgent: "CCBot",
    disallow: "/",
    signals: NOTHING_ALLOWED,
  },
  {
    userAgent: AI_SEARCH_AGENTS,
    allow: "/",
    disallow: "/api/",
    signals: CITE_BUT_DO_NOT_TRAIN,
  },
];

const sitemapUrl = (baseUrl: string) =>
  `${baseUrl.replace(/\/+$/, "")}/sitemap.xml`;

export function buildRobots({
  baseUrl,
}: {
  baseUrl: string;
}): MetadataRoute.Robots {
  return {
    rules: RULES.map(({ signals: _signals, ...rule }) => rule),
    sitemap: sitemapUrl(baseUrl),
  };
}

const asList = (value: string | string[] | undefined) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

const yesNo = (allowed: boolean) => (allowed ? "yes" : "no");

const contentSignalLine = ({ aiTrain, search, aiInput }: ContentSignals) =>
  `Content-Signal: ai-train=${yesNo(aiTrain)}, search=${yesNo(search)}, ai-input=${yesNo(aiInput)}`;

/**
 * Ispisuje robots.txt kao tekst. Next-ova `MetadataRoute.Robots` ne zna za
 * `Content-Signal`, pa klubovi poslužuju robots.txt kao rutu i koriste ovaj
 * ispis. `buildRobots` ostaje jer dijeli ista pravila i pokriva metapodatke.
 */
export function buildRobotsTxt({ baseUrl }: { baseUrl: string }): string {
  const blocks = RULES.map((rule) => {
    const lines = [
      ...asList(rule.userAgent).map((agent) => `User-agent: ${agent}`),
      ...asList(rule.allow).map((path) => `Allow: ${path}`),
      ...asList(rule.disallow).map((path) => `Disallow: ${path}`),
      // Signal stoji unutar bloka na koji se odnosi, kako nalaže specifikacija.
      contentSignalLine(rule.signals),
    ];

    return lines.join("\n");
  });

  return `${blocks.join("\n\n")}\n\nSitemap: ${sitemapUrl(baseUrl)}\n`;
}
