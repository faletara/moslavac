/**
 * Pretvara HTML stranice u Markdown, bez vanjskih ovisnosti i bez DOM-a, kako
 * bi radilo i u Next middlewareu (Edge runtime). Cilj nije savršena vjernost
 * nego čitljiv tekst za agenta: naslovi, odlomci, popisi, veze i slike.
 *
 * Namjerno je konzervativan — nepoznate oznake se uklanjaju, a sadržaj ostaje.
 */

const BLOCK_ELEMENTS_TO_DROP = [
  "script",
  "style",
  "noscript",
  "template",
  "svg",
  "iframe",
  "canvas",
  "form",
  "nav",
];

const ENTITIES = new Map([
  ["amp", "&"],
  ["lt", "<"],
  ["gt", ">"],
  ["quot", '"'],
  ["apos", "'"],
  ["nbsp", " "],
  ["hellip", "…"],
  ["mdash", "—"],
  ["ndash", "–"],
  ["laquo", "«"],
  ["raquo", "»"],
  ["bdquo", "„"],
  ["ldquo", "“"],
  ["rdquo", "”"],
  ["lsquo", "‘"],
  ["rsquo", "’"],
  ["bull", "•"],
  ["middot", "·"],
  ["eacute", "é"],
  ["scaron", "š"],
  ["ccaron", "č"],
]);

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      String.fromCodePoint(Number.parseInt(dec, 10)),
    )
    .replace(/&([a-z]+);/gi, (match, name: string) => {
      const value = ENTITIES.get(name.toLowerCase());

      return value ?? match;
    });
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

function absolute(url: string, baseUrl?: string): string {
  if (!baseUrl) return url;

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

/** Ispod ovoliko znakova teksta smatramo da `<main>` još nije popunjen. */
const MIN_MAIN_TEXT = 200;

/**
 * Uzima `<main>` ako u njemu doista ima teksta, inače `<body>`.
 *
 * React streaming isporučuje sadržaj izvan `<main>`: u prvom naletu `<main>`
 * drži samo kosture učitavanja, a pravi se dijelovi šalju kasnije, kao skriveni
 * blokovi pri dnu dokumenta. Zato prazan `<main>` nije razlog za prazan ispis
 * nego znak da sadržaj treba tražiti u cijelom `<body>`.
 */
function mainContent(html: string): string {
  const body = /<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(html)?.[1];
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1];

  if (main && stripTags(main).length >= MIN_MAIN_TEXT) return main;

  return body ?? main ?? html;
}

function documentTitle(html: string): string | null {
  const match = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html);

  return match ? stripTags(match[1]) || null : null;
}

export function htmlToMarkdown(
  html: string,
  { baseUrl }: { baseUrl?: string } = {},
): string {
  const title = documentTitle(html);
  let text = mainContent(html);

  // 1. Cijele blokove koji ne nose sadržaj uklanjamo zajedno s unutrašnjošću.
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  for (const tag of BLOCK_ELEMENTS_TO_DROP) {
    text = text.replace(
      new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"),
      "",
    );
    text = text.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi"), "");
  }

  // 2. Predformatirani blokovi prije svega ostalog, da zadrže prijelome redaka.
  text = text.replace(
    /<pre\b[^>]*>([\s\S]*?)<\/pre>/gi,
    (_, inner: string) =>
      `\n\n\`\`\`\n${decodeEntities(inner.replace(/<[^>]*>/g, "")).trim()}\n\`\`\`\n\n`,
  );

  // 3. Slike i veze — prije uklanjanja preostalih oznaka, jer nose atribute.
  text = text.replace(
    /<img\b[^>]*>/gi,
    (tag: string) => {
      const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];

      if (!src) return "";
      const alt = /\balt\s*=\s*["']([^"']*)["']/i.exec(tag)?.[1] ?? "";

      return ` ![${decodeEntities(alt)}](${absolute(src, baseUrl)}) `;
    },
  );

  text = text.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
    (whole: string, attrs: string, inner: string) => {
      const label = stripTags(inner);

      if (!label) return "";
      const href = /\bhref\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];

      if (!href || href.startsWith("javascript:")) return label;

      return `[${label}](${absolute(href, baseUrl)})`;
    },
  );

  // 4. Naglašavanje.
  text = text.replace(
    /<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi,
    (_, __, inner: string) => {
      const label = stripTags(inner);

      return label ? `**${label}**` : "";
    },
  );
  text = text.replace(
    /<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi,
    (_, __, inner: string) => {
      const label = stripTags(inner);

      return label ? `*${label}*` : "";
    },
  );
  text = text.replace(
    /<code\b[^>]*>([\s\S]*?)<\/code>/gi,
    (_, inner: string) => {
      const label = stripTags(inner);

      return label ? `\`${label}\`` : "";
    },
  );

  // 5. Blokovske oznake postaju prijelomi. Naslovi zadržavaju razinu.
  text = text.replace(
    /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi,
    (_, level: string, inner: string) => {
      const label = stripTags(inner);

      return label ? `\n\n${"#".repeat(Number(level))} ${label}\n\n` : "\n\n";
    },
  );
  text = text.replace(/<li\b[^>]*>/gi, "\n- ");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<hr\s*\/?>/gi, "\n\n---\n\n");
  text = text.replace(/<\/(p|div|section|article|ul|ol|tr|table|header|footer|figure|blockquote)>/gi, "\n\n");
  text = text.replace(/<\/t[dh]>/gi, " | ");

  // 6. Sve preostalo je oblikovanje bez značenja za agenta.
  text = decodeEntities(text.replace(/<[^>]*>/g, ""));

  // 7. Čišćenje razmaka: najviše jedan prazan redak, bez repova.
  text = text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Naslov dokumenta ide na vrh samo ako ga sadržaj već ne otvara.
  if (title && !text.startsWith("# ")) {
    text = `# ${title}\n\n${text}`;
  }

  return `${text}\n`;
}
