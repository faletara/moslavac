import { describe, expect, it } from "vitest";
import { clampInt, isNumericId, isUuid } from "./validate";

describe("isUuid", () => {
  it("prihvaća HNS UUID neovisno o veličini slova", () => {
    expect(isUuid("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(isUuid("123E4567-E89B-12D3-A456-426614174000")).toBe(true);
  });

  it.each(["", "nije-uuid", "123e4567e89b12d3a456426614174000", "../etc/passwd"])(
    "odbacuje vrijednost koja nije UUID: %s",
    (value) => {
      expect(isUuid(value)).toBe(false);
    },
  );
});

describe("isNumericId", () => {
  it("prihvaća numerički id razumne duljine", () => {
    expect(isNumericId("1")).toBe(true);
    expect(isNumericId("101087009")).toBe(true);
  });

  it.each(["", "12a", "-1", "1.5", "1234567890123"])(
    "odbacuje vrijednost koja nije numerički id: %s",
    (value) => {
      expect(isNumericId(value)).toBe(false);
    },
  );
});

describe("clampInt", () => {
  it("parsira vrijednost unutar granica", () => {
    expect(clampInt("5", 1, 1, 10)).toBe(5);
  });

  it("stišće vrijednost na granice", () => {
    expect(clampInt("99", 1, 1, 10)).toBe(10);
    expect(clampInt("0", 1, 1, 10)).toBe(1);
  });

  it("vraća zadanu vrijednost kada parametar nedostaje ili nije broj", () => {
    expect(clampInt(null, 3, 1, 10)).toBe(3);
    expect(clampInt("abc", 3, 1, 10)).toBe(3);
  });

  it("odbacuje decimalni dio umjesto zaokruživanja", () => {
    expect(clampInt("5.9", 1, 1, 10)).toBe(5);
  });
});
