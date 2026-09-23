import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "./jsonLd";

describe("serializeJsonLd", () => {
  it("naslov sa </script> ne može zatvoriti skriptu, a JSON.parse vraća izvorni tekst", () => {
    const headline = "</script><script>window.__x=1</script>";
    const json = serializeJsonLd({ "@type": "NewsArticle", headline });

    expect(json).not.toContain("<");
    expect(json).not.toContain(">");
    expect(JSON.parse(json)).toEqual({ "@type": "NewsArticle", headline });
  });

  it("escapea &, U+2028 i U+2029 kao \\u escape", () => {
    const name = "A & B\u2028C\u2029D <!--";
    const json = serializeJsonLd({ name });

    expect(json).toBe('{"name":"A \\u0026 B\\u2028C\\u2029D \\u003c!--"}');
    expect(JSON.parse(json)).toEqual({ name });
  });
});
