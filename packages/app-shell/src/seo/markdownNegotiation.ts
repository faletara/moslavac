/**
 * Pregovaranje o obliku sadržaja (content negotiation) za agente: tko traži
 * `Accept: text/markdown` dobiva Markdown, svi ostali i dalje dobivaju HTML.
 * Preglednici nikad ne šalju `text/markdown`, pa im se ništa ne mijenja.
 */

const MARKDOWN_TYPES = ["text/markdown", "text/x-markdown"];

/** Zaglavlje kojim se vlastiti dohvat HTML-a označi da ne uđe u petlju. */
export const MARKDOWN_SOURCE_HEADER = "x-markdown-source";

export function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false;

  return accept
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .some((part) => {
      const [type, ...params] = part.split(";").map((p) => p.trim());

      if (!MARKDOWN_TYPES.includes(type)) return false;

      // `q=0` znači izričito odbijanje tog oblika.
      const quality = params
        .find((p) => p.startsWith("q="))
        ?.slice(2);

      return quality === undefined || Number.parseFloat(quality) > 0;
    });
}

/**
 * Procjena broja tokena. Agenti je koriste da unaprijed znaju cijenu dohvata;
 * omjer od otprilike četiri znaka po tokenu dovoljno je točan za tu svrhu.
 */
export function estimateTokens(markdown: string): number {
  return Math.ceil(markdown.length / 4);
}

export function markdownResponse(markdown: string): Response {
  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // Isti URL vraća dva oblika, pa posrednici moraju odvojiti predmemoriju.
      Vary: "Accept",
      "x-markdown-tokens": String(estimateTokens(markdown)),
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
