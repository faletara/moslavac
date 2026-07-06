import { describe, expect, it, vi } from "vitest";
import { runWithPayloadContext } from "./context";
import type { PayloadFetchOptions, PayloadTransport } from "./context";
import { fetchList, fetchOne } from "./fetchCollection";

type Call = { path: string; opts?: PayloadFetchOptions };

function page<T>(docs: T[]) {
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

function recorder(docs: unknown[]): { transport: PayloadTransport; calls: Call[] } {
  const calls: Call[] = [];
  const transport: PayloadTransport = async (path, opts) => {
    calls.push({ path, opts });
    return page(docs);
  };
  return { transport, calls };
}

describe("fetchList", () => {
  it("builds a tenant-scoped query, applies sort/limit/depth, and maps docs", async () => {
    const { transport, calls } = recorder([{ id: 1, name: "ana" }]);

    const result = await runWithPayloadContext(
      { transport, tenantSlug: "test-club" },
      () =>
        fetchList<{ id: number; name: string }, { id: number; name: string }>({
          collection: "widgets",
          sort: "displayOrder",
          limit: 50,
          adapt: (d) => ({ id: d.id, name: d.name.toUpperCase() }),
        }),
    );

    expect(result).toEqual([{ id: 1, name: "ANA" }]);

    const call = calls[0]!;
    const path = decodeURIComponent(call.path);
    expect(path).toContain("/widgets?");
    expect(path).toContain("where[tenant.slug][equals]=test-club");
    expect(path).toContain("sort=displayOrder");
    expect(path).toContain("limit=50");
    expect(path).toContain("depth=2");
    expect(call.opts?.next?.tags).toEqual(["widgets-test-club"]);
    expect(call.opts?.next?.revalidate).toBe(60);
  });

  it("uses tagPrefix when the cache tag differs from the collection name", async () => {
    const { transport, calls } = recorder([]);
    await runWithPayloadContext({ transport, tenantSlug: "moslavac" }, () =>
      fetchList({ collection: "board-members", tagPrefix: "board", adapt: (d: unknown) => d }),
    );
    expect(calls[0]!.opts?.next?.tags).toEqual(["board-moslavac"]);
  });

  it("is resilient: returns [] and logs on transport error", async () => {
    const transport: PayloadTransport = async () => {
      throw new Error("boom");
    };
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await runWithPayloadContext({ transport, tenantSlug: "t" }, () =>
      fetchList({ collection: "news", adapt: (d: unknown) => d }),
    );

    expect(result).toEqual([]);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it("surfaces the error when throwOnError is set", async () => {
    const transport: PayloadTransport = async () => {
      throw new Error("boom");
    };
    await expect(
      runWithPayloadContext({ transport, tenantSlug: "t" }, () =>
        fetchList({ collection: "news", adapt: (d: unknown) => d, throwOnError: true }),
      ),
    ).rejects.toThrow("boom");
  });
});

describe("fetchOne", () => {
  it("returns the first mapped doc", async () => {
    const { transport, calls } = recorder([{ id: 7 }, { id: 8 }]);
    const result = await runWithPayloadContext({ transport, tenantSlug: "t" }, () =>
      fetchOne<{ id: number }, number>({
        collection: "news",
        where: { "where[slug][equals]": "x" },
        adapt: (d) => d.id,
      }),
    );
    expect(result).toBe(7);
    // limit is forced to 1 for single fetches
    expect(decodeURIComponent(calls[0]!.path)).toContain("limit=1");
  });

  it("returns null when no docs match", async () => {
    const { transport } = recorder([]);
    const result = await runWithPayloadContext({ transport, tenantSlug: "t" }, () =>
      fetchOne<{ id: number }, number>({
        collection: "news",
        where: {},
        adapt: (d) => d.id,
      }),
    );
    expect(result).toBeNull();
  });
});
