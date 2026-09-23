import { serializeJsonLd } from "@/lib/helpers/jsonLd";
import type { JsonLdRoot } from "@/types/jsonld";

/**
 * Jedini `<script type="application/ld+json">` u repou. Tekst iz CMS-a i HNS-a
 * prolazi kroz `serializeJsonLd`, pa `</script>` u naslovu ne izlazi iz
 * elementa. Oxlint pravilo `moslavac/no-raw-json-in-html` odbija ld+json
 * skriptu napisanu bilo gdje drugdje.
 */
export default function JsonLdScript({ data }: { data: JsonLdRoot }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
