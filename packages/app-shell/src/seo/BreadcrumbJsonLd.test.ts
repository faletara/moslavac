import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BreadcrumbJsonLd from "./BreadcrumbJsonLd";

describe("BreadcrumbJsonLd", () => {
  it("renderira naslov sa </script> unutar jednog script elementa", () => {
    const name = "</script><script>window.__x=1</script>";

    const html = renderToStaticMarkup(
      createElement(BreadcrumbJsonLd, {
        baseUrl: "https://klub.example",
        trail: [{ name, path: "/novosti/1" }],
      }),
    );

    const inner = html.slice(html.indexOf(">") + 1, html.lastIndexOf("</script>"));

    expect(inner).not.toContain("</script");
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(JSON.parse(inner).itemListElement[1].name).toBe(name);
  });
});
