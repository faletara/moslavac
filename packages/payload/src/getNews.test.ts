import { describe, expect, it, vi } from "vitest";

// The Lexical → HTML converter is a heavy server package; stub it so adaptNews
// is deterministic and the module imports cleanly under vitest.
vi.mock("@payloadcms/richtext-lexical/html", () => ({
  convertLexicalToHTML: ({ data }: { data: unknown }) => (data ? "<p>html</p>" : ""),
}));

import { runWithPayloadContext } from "./context";
import type { PayloadTransport } from "./context";
import {
  adaptNews,
  fetchLatestNews,
  fetchNewsBySlug,
  fetchNewsPaginated,
} from "./getNews";

type RawNews = Parameters<typeof adaptNews>[0];

const raw = (over: Partial<RawNews> = {}): RawNews => ({
  id: 3,
  title: "Naslov",
  slug: "naslov",
  content: { root: {} },
  publishedAt: "2026-01-01",
  excerpt: null,
  thumbnail: { id: 1, url: "/t.jpg", alt: "" },
  gallery: [{ image: { id: 2, url: "/g.jpg", alt: "" } }],
  tenant: { id: 1, slug: "moslavac" },
  createdAt: "2025-12-01",
  updatedAt: "2026-01-02",
  ...over,
});

function pageOf(docs: RawNews[], over: Record<string, unknown> = {}) {
  return {
    docs,
    totalDocs: docs.length,
    totalPages: 1,
    page: 1,
    limit: docs.length,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
    ...over,
  };
}

describe("adaptNews", () => {
  it("maps content→html, media urls, and the tenant slug", () => {
    expect(adaptNews(raw())).toMatchObject({
      id: 3,
      slug: "naslov",
      title: "Naslov",
      content: "<p>html</p>",
      thumbnailPath: "/t.jpg",
      imagePaths: ["/g.jpg"],
      tenantId: "moslavac",
      date: "2026-01-01",
    });
  });

  it("renders empty html when content is null", () => {
    expect(adaptNews(raw({ content: null })).content).toBe("");
  });
});

describe("fetchLatestNews", () => {
  it("queries /news sorted -publishedAt with limit 6", async () => {
    const calls: string[] = [];
    const transport: PayloadTransport = async (path) => {
      calls.push(path);
      return pageOf([raw()]);
    };

    const result = await runWithPayloadContext(
      { transport, tenantSlug: "moslavac" },
      () => fetchLatestNews(),
    );

    expect(result).toHaveLength(1);
    expect(result[0]!.tenantId).toBe("moslavac");

    const path = decodeURIComponent(calls[0]!);
    expect(path).toContain("/news?");
    expect(path).toContain("sort=-publishedAt");
    expect(path).toContain("limit=6");
  });
});

describe("fetchNewsPaginated", () => {
  it("maps into the domain Paginated shape (0-indexed page number)", async () => {
    const transport: PayloadTransport = async () =>
      pageOf([raw()], { totalDocs: 12, totalPages: 2, page: 1, limit: 6 });

    const result = await runWithPayloadContext(
      { transport, tenantSlug: "moslavac" },
      () => fetchNewsPaginated({ page: 1, size: 6 }),
    );

    expect(result.totalElements).toBe(12);
    expect(result.totalPages).toBe(2);
    expect(result.number).toBe(0);
    expect(result.size).toBe(6);
    expect(result.content).toHaveLength(1);
  });
});

describe("fetchNewsBySlug", () => {
  it("returns null when no doc matches", async () => {
    const transport: PayloadTransport = async () => pageOf([]);
    const result = await runWithPayloadContext(
      { transport, tenantSlug: "moslavac" },
      () => fetchNewsBySlug({ slug: "x" }),
    );
    expect(result).toBeNull();
  });
});
