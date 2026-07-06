import { describe, expect, it } from "vitest";
import { runWithPayloadContext } from "./context";
import type { PayloadTransport } from "./context";
import { adaptDocument, fetchDocuments } from "./getDocuments";

type RawDoc = Parameters<typeof adaptDocument>[0];

const raw = (over: Partial<RawDoc> = {}): RawDoc => ({
  id: 1,
  title: "Statut",
  category: "statut",
  url: "/statut.pdf",
  filename: "statut.pdf",
  displayOrder: 0,
  ...over,
});

function pageOf(docs: unknown[]) {
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
  };
}

describe("adaptDocument", () => {
  it("maps a raw document 1:1", () => {
    expect(adaptDocument(raw())).toEqual({
      id: 1,
      title: "Statut",
      category: "statut",
      url: "/statut.pdf",
      filename: "statut.pdf",
      displayOrder: 0,
    });
  });
});

describe("fetchDocuments", () => {
  it("queries /documents at depth 0 with no category filter by default", async () => {
    const calls: string[] = [];
    const transport: PayloadTransport = async (path) => {
      calls.push(path);
      return pageOf([raw()]);
    };

    await runWithPayloadContext({ transport, tenantSlug: "moslavac" }, () =>
      fetchDocuments(),
    );

    const path = decodeURIComponent(calls[0]!);
    expect(path).toContain("/documents?");
    expect(path).toContain("depth=0");
    expect(path).toContain("sort=displayOrder");
    expect(path).not.toContain("where[category]");
  });

  it("adds the category filter when provided", async () => {
    const calls: string[] = [];
    const transport: PayloadTransport = async (path) => {
      calls.push(path);
      return pageOf([]);
    };

    await runWithPayloadContext({ transport, tenantSlug: "moslavac" }, () =>
      fetchDocuments({ category: "pravilnik" }),
    );

    expect(decodeURIComponent(calls[0]!)).toContain(
      "where[category][equals]=pravilnik",
    );
  });
});
