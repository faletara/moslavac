import { describe, expect, it } from "vitest";
import { htmlToMetaDescription } from "./text";

describe("htmlToMetaDescription", () => {
  it("strips HTML tags and collapses whitespace", () => {
    const html = "<p>Prvi   odlomak.</p>\n<p>Drugi odlomak.</p>";
    expect(htmlToMetaDescription(html)).toBe("Prvi odlomak. Drugi odlomak.");
  });

  it("decodes common HTML entities", () => {
    const html = "<p>Sloga &amp; navija&#269;i &lt;3</p>";
    expect(htmlToMetaDescription(html)).toBe("Sloga & navijači <3");
  });

  it("truncates on a word boundary and adds an ellipsis", () => {
    const html = `<p>${"rijec ".repeat(60).trim()}</p>`;
    const result = htmlToMetaDescription(html, 40);
    expect(result.length).toBeLessThanOrEqual(40);
    expect(result.endsWith("…")).toBe(true);
    expect(result).not.toMatch(/\srije…$/); // no dangling partial word before the ellipsis root
  });

  it("does not add an ellipsis when the text already fits", () => {
    expect(htmlToMetaDescription("<p>Kratko.</p>", 160)).toBe("Kratko.");
  });

  it("returns an empty string for empty or tag-only input", () => {
    expect(htmlToMetaDescription("")).toBe("");
    expect(htmlToMetaDescription("<p></p>")).toBe("");
  });
});
