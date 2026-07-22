const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === "#") {
      const codePoint =
        body[1] === "x" || body[1] === "X"
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

/**
 * Derive a plain-text meta description from a rich-text HTML fragment: strip
 * tags, decode entities, collapse whitespace, then truncate on a word boundary
 * with an ellipsis. Used to backfill `<meta name="description">` when a document
 * has no explicit excerpt.
 */
export function htmlToMetaDescription(html: string, maxLength = 160): string {
  const text = decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;

  // Reserve one character for the ellipsis, then cut back to the last space.
  const clipped = text.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  const head = (lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).trimEnd();
  return `${head}…`;
}
