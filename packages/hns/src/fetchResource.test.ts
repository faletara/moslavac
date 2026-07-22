import { describe, expect, it, vi } from "vitest";
import { runWithHnsContext } from "./context";
import type { HnsFetchOptions, HnsTransport } from "./context";
import { hnsList, hnsListResult, hnsResource } from "./fetchResource";

type Call = { endpoint: string; opts?: HnsFetchOptions };

function recorder(body: unknown): { transport: HnsTransport; calls: Call[] } {
  const calls: Call[] = [];
  const transport: HnsTransport = async (endpoint, opts) => {
    calls.push({ endpoint, opts });
    return body;
  };
  return { transport, calls };
}

const ctx = (transport: HnsTransport) => ({
  transport,
  teamId: "42",
  apiKey: "test-key",
});

describe("hnsList", () => {
  it("injects the team id, appends teamIdFilter, and unwraps a paginated envelope", async () => {
    const { transport, calls } = recorder({ result: [{ id: 1 }, { id: 2 }] });

    const result = await runWithHnsContext(ctx(transport), () =>
      hnsList<{ id: number }>({
        path: (teamId) => `/api/live/team/${teamId}/matches/paginated/past/2`,
        tag: "team-matches",
        revalidate: 60,
        paginated: true,
      }),
    );

    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    const call = calls[0]!;
    expect(call.endpoint).toBe(
      "/api/live/team/42/matches/paginated/past/2?teamIdFilter=42",
    );
    expect(call.opts?.revalidate).toBe(60);
    expect(call.opts?.tags?.[0]).toMatch(/team-matches$/);
  });

  it("returns a bare array unchanged (non-paginated)", async () => {
    const { transport } = recorder([{ id: 9 }]);
    const result = await runWithHnsContext(ctx(transport), () =>
      hnsList<{ id: number }>({
        path: () => `/api/live/match/1/events`,
        tag: "match-1-events",
        revalidate: 30,
      }),
    );
    expect(result).toEqual([{ id: 9 }]);
  });

  it("appends teamIdFilter with & when the path already has a query", async () => {
    const { transport, calls } = recorder([]);
    await runWithHnsContext(ctx(transport), () =>
      hnsList({
        path: () => `/api/live/match/1/events?showComments=true`,
        revalidate: 30,
      }),
    );
    expect(calls[0]!.endpoint).toBe(
      "/api/live/match/1/events?showComments=true&teamIdFilter=42",
    );
  });

  it("omits the cache tag when no tag is given", async () => {
    const { transport, calls } = recorder([]);
    await runWithHnsContext(ctx(transport), () =>
      hnsList({ path: () => `/api/live/player/search`, revalidate: 3600 }),
    );
    expect(calls[0]!.opts?.tags).toBeUndefined();
  });

  it("skips teamIdFilter when teamFilter is false", async () => {
    const { transport, calls } = recorder([]);
    await runWithHnsContext(ctx(transport), () =>
      hnsList({ path: () => `/api/live/x`, revalidate: 60, teamFilter: false }),
    );
    expect(calls[0]!.endpoint).toBe("/api/live/x");
  });

  it("is resilient: returns [] and logs on transport error", async () => {
    const transport: HnsTransport = async () => {
      throw new Error("boom");
    };
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await runWithHnsContext(ctx(transport), () =>
      hnsList({ path: () => `/api/live/x`, revalidate: 60 }),
    );

    expect(result).toEqual([]);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });
});

describe("hnsListResult", () => {
  it("reports ok:true with the unwrapped data on success", async () => {
    const { transport } = recorder({ result: [{ id: 1 }, { id: 2 }] });
    const result = await runWithHnsContext(ctx(transport), () =>
      hnsListResult<{ id: number }>({
        path: () => `/api/live/x`,
        revalidate: 60,
        paginated: true,
      }),
    );
    expect(result).toEqual({ data: [{ id: 1 }, { id: 2 }], ok: true });
  });

  it("reports ok:false with [] and logs when the transport errors", async () => {
    const transport: HnsTransport = async () => {
      throw new Error("boom");
    };
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await runWithHnsContext(ctx(transport), () =>
      hnsListResult({ path: () => `/api/live/x`, revalidate: 60 }),
    );
    expect(result).toEqual({ data: [], ok: false });
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });
});

describe("hnsResource", () => {
  it("returns the fetched object", async () => {
    const { transport } = recorder({ id: 7, name: "match" });
    const result = await runWithHnsContext(ctx(transport), () =>
      hnsResource<{ id: number; name: string }>({
        path: () => `/api/live/match/7`,
        tag: "match-7",
        revalidate: 30,
      }),
    );
    expect(result).toEqual({ id: 7, name: "match" });
  });

  it("returns null when the transport yields null", async () => {
    const { transport } = recorder(null);
    const result = await runWithHnsContext(ctx(transport), () =>
      hnsResource({ path: () => `/api/live/match/7`, revalidate: 30 }),
    );
    expect(result).toBeNull();
  });

  it("is resilient: returns null and logs on transport error", async () => {
    const transport: HnsTransport = async () => {
      throw new Error("boom");
    };
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await runWithHnsContext(ctx(transport), () =>
      hnsResource({ path: () => `/api/live/match/7`, revalidate: 30 }),
    );

    expect(result).toBeNull();
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });
});
