import { describe, expect, it } from "vitest";
import { newsPageHref, parseNewsPageSegment } from "./newsPagination";

describe("parseNewsPageSegment", () => {
  it("reads a positive page number", () => {
    expect(parseNewsPageSegment("1")).toBe(1);
    expect(parseNewsPageSegment("27")).toBe(27);
  });

  it("rejects anything that is not a canonical positive integer", () => {
    for (const segment of ["abc", "0", "-2", "2.5", "02", "1e2", "", " 3", "3abc"]) {
      expect(parseNewsPageSegment(segment)).toBeNull();
    }
  });
});

describe("newsPageHref", () => {
  it("first page is the bare list", () => {
    expect(newsPageHref(1)).toBe("/novosti");
  });

  it("later pages live under /novosti/stranica/<n>", () => {
    expect(newsPageHref(2)).toBe("/novosti/stranica/2");
    expect(newsPageHref(14)).toBe("/novosti/stranica/14");
  });
});
