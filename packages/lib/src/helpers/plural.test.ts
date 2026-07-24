import { describe, expect, it } from "vitest";
import { pluralize, pluralForm } from "./plural";

const utakmica = {
  one: "puna utakmica",
  few: "pune utakmice",
  many: "punih utakmica",
};

describe("pluralForm", () => {
  it("bira jedninu za brojeve koji završavaju na 1", () => {
    for (const count of [1, 21, 101, 131]) {
      expect(pluralForm(count, utakmica)).toBe("puna utakmica");
    }
  });

  it("bira dvojinu za brojeve koji završavaju na 2, 3 i 4", () => {
    for (const count of [2, 3, 4, 22, 33, 104]) {
      expect(pluralForm(count, utakmica)).toBe("pune utakmice");
    }
  });

  it("bira množinu za 5 do 20 i sve ostalo", () => {
    for (const count of [0, 5, 9, 10, 20, 25.0, 100]) {
      expect(pluralForm(count, utakmica)).toBe("punih utakmica");
    }
  });

  it("tretira 11 do 14 kao množinu, ne kao jedninu ili dvojinu", () => {
    for (const count of [11, 12, 13, 14, 111, 112, 113, 114]) {
      expect(pluralForm(count, utakmica)).toBe("punih utakmica");
    }
  });

  it("ponaša se jednako za negativne brojeve", () => {
    expect(pluralForm(-1, utakmica)).toBe("puna utakmica");
    expect(pluralForm(-3, utakmica)).toBe("pune utakmice");
    expect(pluralForm(-12, utakmica)).toBe("punih utakmica");
  });

  it("gleda cijeli dio decimalnog broja", () => {
    expect(pluralForm(1.5, utakmica)).toBe("puna utakmica");
    expect(pluralForm(2.7, utakmica)).toBe("pune utakmice");
  });
});

describe("pluralize", () => {
  it("sastavlja broj i pripadni oblik", () => {
    expect(pluralize(1, utakmica)).toBe("1 puna utakmica");
    expect(pluralize(2, utakmica)).toBe("2 pune utakmice");
    expect(pluralize(5, utakmica)).toBe("5 punih utakmica");
    expect(pluralize(0, utakmica)).toBe("0 punih utakmica");
  });

  it("radi i kada se dvojina i množina poklapaju, kao kod „igrač”", () => {
    const igrac = { one: "igrač", few: "igrača", many: "igrača" };

    expect(pluralize(1, igrac)).toBe("1 igrač");
    expect(pluralize(2, igrac)).toBe("2 igrača");
    expect(pluralize(25, igrac)).toBe("25 igrača");
  });
});
