import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HeroActions } from "./HeroActions";

describe("HeroActions", () => {
  it("vodi prema sljedećoj utakmici kada je dostupna", () => {
    const html = renderToStaticMarkup(<HeroActions hasNextMatch />);

    expect(html).toContain('href="#sljedeca-utakmica"');
    expect(html).toContain("Pogledaj sljedeću utakmicu");
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).not.toContain('href="/prva-momcad"');
    expect(html).toContain("border-foreground/20");
    expect(html).toContain("bg-foreground/5");
    expect(html).toContain("backdrop-blur-lg");
    expect(html).not.toContain("bg-chalk");
  });

  it("vodi na raspored bez mrtvog anchora kada utakmica nije dostupna", () => {
    const html = renderToStaticMarkup(<HeroActions hasNextMatch={false} />);

    expect(html).toContain('href="/utakmice"');
    expect(html).toContain("Pogledaj raspored");
    expect(html).not.toContain('href="#sljedeca-utakmica"');
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).not.toContain('href="/prva-momcad"');
  });
});
