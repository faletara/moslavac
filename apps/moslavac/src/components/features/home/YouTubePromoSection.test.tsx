import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { YouTubePromoContent } from "./YouTubePromoSection";

describe("YouTubePromoContent", () => {
  it("s konfiguriranim kanalom prikazuje sigurnu vanjsku poveznicu", () => {
    const html = renderToStaticMarkup(
      <YouTubePromoContent
        youtubeUrl="https://www.youtube.com/@snkmoslavac"
        reducedMotion
      />,
    );

    expect(html).toContain('href="https://www.youtube.com/@snkmoslavac"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain(
      'aria-label="Posjeti YouTube kanal (otvara se u novoj kartici)"',
    );
    expect(html).toContain("Posjeti kanal");
    expect(html).not.toContain("Uživo na YouTubeu");
    expect(html).not.toContain("Kanal trenutačno nije dostupan");
  });

  it("bez URL-a prikazuje pošteno prazno stanje bez poveznice", () => {
    const html = renderToStaticMarkup(
      <YouTubePromoContent youtubeUrl={null} reducedMotion />,
    );

    expect(html).toContain("Službeni YouTube kanal još nije dostupan");
    expect(html).toContain("Kanal trenutačno nije dostupan");
    expect(html).not.toContain("<a");
    expect(html).not.toContain('href="#"');
  });
});
