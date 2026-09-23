import { describe, expect, it } from "vitest";
import { parseTrailingId } from "./slug";

describe("parseTrailingId", () => {
  it("čita id s kraja SEO sluga", () => {
    expect(parseTrailingId("nas-klub-dinamo-zagreb-15-11-2024-101087009")).toBe(
      101087009,
    );
  });

  it("prihvaća goli brojčani id, pa stari URL-ovi rade", () => {
    expect(parseTrailingId("100444234")).toBe(100444234);
  });

  it("vraća null za slug bez znamenki na kraju", () => {
    expect(parseTrailingId("abc")).toBeNull();
    expect(parseTrailingId("")).toBeNull();
    expect(parseTrailingId("utakmica-123-abc")).toBeNull();
  });

  it("vraća null za predugačak broj umjesto da ga pretvori u Infinity", () => {
    expect(parseTrailingId("1".repeat(400))).toBeNull();
    expect(parseTrailingId(`utakmica-${"9".repeat(16)}`)).toBeNull();
  });

  it("vraća null za nulu, koja nije HNS id", () => {
    expect(parseTrailingId("utakmica-0")).toBeNull();
    expect(parseTrailingId("000")).toBeNull();
  });
});
