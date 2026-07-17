import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HeroActions } from "./HeroActions";

describe("HeroActions", () => {
  it("vodi prema sljedećoj utakmici kada je dostupna", () => {
    const html = renderToStaticMarkup(<HeroActions hasNextMatch />);

    expect(html).toContain('href="#sljedeca-utakmica"');
    expect(html).toContain("Pogledaj sljedeću utakmicu");
    expect(html).toContain('href="/prva-momcad"');
    expect(html).toContain("Naša momčad");
  });

  it("vodi na raspored bez mrtvog anchora kada utakmica nije dostupna", () => {
    const html = renderToStaticMarkup(<HeroActions hasNextMatch={false} />);

    expect(html).toContain('href="/utakmice"');
    expect(html).toContain("Pogledaj raspored");
    expect(html).not.toContain('href="#sljedeca-utakmica"');
    expect(html).toContain('href="/prva-momcad"');
  });
});
