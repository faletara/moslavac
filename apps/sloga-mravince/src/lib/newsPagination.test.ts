import { describe, expect, it } from "vitest";
import { newsPageHref } from "./newsPagination";

describe("newsPageHref", () => {
  it("prva stranica je sam popis", () => {
    expect(newsPageHref(1)).toBe("/novosti");
  });

  it("sljedeće stranice su pod /novosti/stranica/<n>", () => {
    expect(newsPageHref(2)).toBe("/novosti/stranica/2");
    expect(newsPageHref(14)).toBe("/novosti/stranica/14");
  });
});
