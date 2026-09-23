import { describe, expect, it } from "vitest";
import { htmlToMarkdown } from "./htmlToMarkdown";
import {
  estimateTokens,
  markdownResponse,
  wantsMarkdown,
} from "./markdownNegotiation";

const page = (body: string, title = "NK Primjer") =>
  `<!doctype html><html><head><title>${title}</title><style>.a{color:red}</style></head><body><nav><a href="/">Izbornik</a></nav><main>${body}</main><script>console.log(1)</script></body></html>`;

describe("htmlToMarkdown", () => {
  it("stavlja naslov dokumenta na vrh", () => {
    expect(htmlToMarkdown(page("<p>Tekst</p>"))).toMatch(/^# NK Primjer\n/);
  });

  it("ne ponavlja naslov ako ga sadržaj već otvara", () => {
    const md = htmlToMarkdown(page("<h1>NK Primjer</h1><p>Tekst</p>"));
    expect(md.match(/# NK Primjer/g)).toHaveLength(1);
  });

  it("zadržava razinu naslova", () => {
    expect(htmlToMarkdown(page("<h2>Utakmice</h2>"))).toContain("## Utakmice");
  });

  it("pretvara popis u Markdown natuknice", () => {
    const md = htmlToMarkdown(page("<ul><li>Prvi</li><li>Drugi</li></ul>"));
    expect(md).toContain("- Prvi");
    expect(md).toContain("- Drugi");
  });

  it("pretvara veze i razrješuje relativne putanje", () => {
    const md = htmlToMarkdown(page('<a href="/novosti">Vijesti</a>'), {
      baseUrl: "https://klub.example",
    });

    expect(md).toContain("[Vijesti](https://klub.example/novosti)");
  });

  it("pretvara slike zajedno s opisom", () => {
    const md = htmlToMarkdown(page('<img src="/grb.png" alt="Grb kluba">'), {
      baseUrl: "https://klub.example",
    });

    expect(md).toContain("![Grb kluba](https://klub.example/grb.png)");
  });

  it("izbacuje skripte, stilove i izbornik", () => {
    const md = htmlToMarkdown(page("<p>Tekst</p>"));
    expect(md).not.toContain("console.log");
    expect(md).not.toContain("color:red");
    expect(md).not.toContain("Izbornik");
  });

  it("dekodira HTML entitete", () => {
    expect(htmlToMarkdown(page("<p>Gari&#269;ka &amp; Mravince</p>"))).toContain(
      "Garička & Mravince",
    );
  });

  it("naglašava podebljani tekst", () => {
    expect(htmlToMarkdown(page("<p><strong>2:1</strong></p>"))).toContain(
      "**2:1**",
    );
  });

  it("ne ostavlja HTML oznake u ispisu", () => {
    const md = htmlToMarkdown(
      page('<div class="x"><p>Tekst <span>u rasponu</span></p></div>'),
    );

    expect(md).not.toMatch(/<[a-z]/i);
  });

  it("ne ostavlja više od jednog praznog retka", () => {
    const md = htmlToMarkdown(page("<p>A</p><div></div><div></div><p>B</p>"));
    expect(md).not.toContain("\n\n\n");
  });

  it("uzima <body> kada stranica nema <main>", () => {
    const md = htmlToMarkdown(
      "<html><head><title>T</title></head><body><p>Sadržaj</p></body></html>",
    );

    expect(md).toContain("Sadržaj");
  });
});

describe("wantsMarkdown", () => {
  it("prepoznaje izričit zahtjev agenta", () => {
    expect(wantsMarkdown("text/markdown")).toBe(true);
    expect(wantsMarkdown("text/markdown, text/html;q=0.9")).toBe(true);
  });

  it("ne dira uobičajeni zahtjev preglednika", () => {
    expect(
      wantsMarkdown(
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      ),
    ).toBe(false);
  });

  it("poštuje izričito odbijanje s q=0", () => {
    expect(wantsMarkdown("text/markdown;q=0, text/html")).toBe(false);
  });

  it("podnosi izostanak zaglavlja", () => {
    expect(wantsMarkdown(null)).toBe(false);
  });
});

describe("markdownResponse", () => {
  it("označava oblik i procjenu tokena", () => {
    const response = markdownResponse("# Naslov\n");
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(response.headers.get("vary")).toBe("Accept");
    expect(response.headers.get("x-markdown-tokens")).toBe(
      String(estimateTokens("# Naslov\n")),
    );
  });
});

describe("htmlToMarkdown i React streaming", () => {
  it("nalazi sadržaj koji je stigao izvan <main>", () => {
    const streamed = `<!doctype html><html><head><title>NK Primjer</title></head><body><main class="flex-1"><div style="opacity:0"><template id="B:0"></template><div data-slot="skeleton" class="animate-pulse"></div></div></main><div hidden id="S:0"><h2>Zadnja utakmica</h2><p>NK Primjer je pobijedio 2:1 u gostima.</p></div><script>$RC("B:0","S:0")</script></body></html>`;

    const md = htmlToMarkdown(streamed);

    expect(md).toContain("## Zadnja utakmica");
    expect(md).toContain("NK Primjer je pobijedio 2:1 u gostima.");
    expect(md).not.toContain("$RC");
  });
});
