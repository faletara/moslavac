import { describe, expect, it } from "vitest";
import { mediaRef, payloadPage, tenantRef } from "./schemas";

describe("mediaRef", () => {
  it("populated → domain image", () => {
    expect(
      mediaRef.parse({ id: 1, url: "/a.jpg", alt: "A", sizes: { card: { url: "/a-card.jpg", width: 1, height: 1 } } }),
    ).toEqual({
      id: 1,
      url: "/a.jpg",
      cardUrl: "/a-card.jpg",
      heroUrl: "/a.jpg",
      alt: "A",
      width: null,
      height: null,
    });
  });
  it("populated without card → falls back to url", () => {
    expect(mediaRef.parse({ id: 1, url: "/a.jpg", alt: null })).toEqual({
      id: 1,
      url: "/a.jpg",
      cardUrl: "/a.jpg",
      heroUrl: "/a.jpg",
      alt: "",
      width: null,
      height: null,
    });
  });
  it("bare id / string / null / undefined → null", () => {
    expect(mediaRef.parse(7)).toBeNull();
    expect(mediaRef.parse("7")).toBeNull();
    expect(mediaRef.parse(null)).toBeNull();
    expect(mediaRef.parse(undefined)).toBeNull();
  });
});

describe("tenantRef", () => {
  it("populated keeps the slug", () => {
    expect(tenantRef.parse({ id: 1, slug: "moslavac" })).toEqual({ id: 1, slug: "moslavac" });
  });
  it("bare id → null", () => {
    expect(tenantRef.parse(3)).toBeNull();
  });
});

describe("payloadPage", () => {
  it("parses the envelope", () => {
    const page = payloadPage(mediaRef).parse({
      docs: [{ id: 1, url: "/a.jpg", alt: "A" }],
      totalDocs: 1, totalPages: 1, page: 1, limit: 10,
      hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null,
    });

    expect(page.docs[0]).toEqual({
      id: 1,
      url: "/a.jpg",
      cardUrl: "/a.jpg",
      heroUrl: "/a.jpg",
      alt: "A",
      width: null,
      height: null,
    });
  });
});
