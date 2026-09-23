import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BreadcrumbJsonLd from "./BreadcrumbJsonLd";
import JsonLdScript from "./JsonLdScript";

const PAYLOAD = "</script><script>window.__x=1</script>";

/** Tekst između otvarajuće oznake i zadnjeg `</script>`. */
function scriptBody(html: string): string {
  return html.slice(html.indexOf(">") + 1, html.lastIndexOf("</script>"));
}

describe("JsonLdScript", () => {
  it("renderira naslov sa </script> unutar jednog ld+json elementa", () => {
    const html = renderToStaticMarkup(
      createElement(JsonLdScript, {
        data: { "@type": "NewsArticle", headline: PAYLOAD },
      }),
    );

    const body = scriptBody(html);

    expect(html.startsWith('<script type="application/ld+json">')).toBe(true);
    expect(body).not.toContain("</script");
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(JSON.parse(body).headline).toBe(PAYLOAD);
  });
});

describe("BreadcrumbJsonLd", () => {
  it("ime koraka sa </script> ostaje unutar jednog script elementa", () => {
    const html = renderToStaticMarkup(
      createElement(BreadcrumbJsonLd, {
        baseUrl: "https://klub.example",
        trail: [{ name: PAYLOAD, path: "/novosti/1" }],
      }),
    );

    const body = scriptBody(html);

    expect(body).not.toContain("</script");
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(JSON.parse(body).itemListElement[1].name).toBe(PAYLOAD);
  });
});
