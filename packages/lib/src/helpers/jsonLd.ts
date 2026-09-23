import type { JsonLdRoot } from "@/types/jsonld";

/**
 * Znakovi koji u inline `<script>` elementu nose HTML značenje (`<`, `>`, `&`)
 * ili lome stariji JS parser (U+2028, U+2029).
 */
const HTML_UNSAFE = /[<>&\u2028\u2029]/g;

/**
 * JSON-LD za `<script type="application/ld+json" dangerouslySetInnerHTML>`.
 *
 * Goli `JSON.stringify` ne escapea `<`, pa naslov iz CMS-a ili ime momčadi iz
 * HNS-a sa `</script>` zatvara element i otvara izvršnu skriptu. Ovdje svaki
 * takav znak postaje `\uXXXX` escape: preglednik ne vidi oznaku, a `JSON.parse`
 * vraća isti tekst. Oxlint pravilo `moslavac/no-raw-json-in-html` traži ovaj
 * helper u svakom `dangerouslySetInnerHTML`.
 */
export function serializeJsonLd(data: JsonLdRoot): string {
  return JSON.stringify(data).replace(
    HTML_UNSAFE,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}
