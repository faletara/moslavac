import { describe, expect, it } from "vitest";
import { runWithPayloadContext } from "./context";
import type { PayloadFetchOptions, PayloadTransport } from "./context";
import { adaptRoster, fetchRoster } from "./getRoster";

type RawRoster = Parameters<typeof adaptRoster>[0];

const raw = (over: Partial<RawRoster> = {}): RawRoster => ({
  id: 1,
  displayName: "Ivan Horvat",
  personId: 99,
  position: "vratar",
  displayOrder: 3,
  jerseyNumber: 1,
  captain: true,
  photo: { id: 7, url: "/ivan.jpg", alt: "" },
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

describe("adaptRoster", () => {
  it("normalises an unpopulated (numeric) photo relation to null", () => {
    const entry = adaptRoster(
      raw({ photo: 7, jerseyNumber: null, captain: null, displayOrder: null }),
    );
    expect(entry.photo).toBeNull();
    expect(entry.jerseyNumber).toBeNull();
    expect(entry.captain).toBe(false);
    expect(entry.displayOrder).toBe(0);
  });

  it("keeps a populated photo object", () => {
    expect(adaptRoster(raw()).photo).toEqual({ id: 7, url: "/ivan.jpg", alt: "" });
  });
});

describe("fetchRoster", () => {
  it("is authenticated, revalidates at 300, tags roster-<slug>", async () => {
    const calls: { path: string; opts?: PayloadFetchOptions }[] = [];
    const transport: PayloadTransport = async (path, opts) => {
      calls.push({ path, opts });
      return pageOf([raw()]);
    };

    const res = await runWithPayloadContext(
      { transport, tenantSlug: "moslavac" },
      () => fetchRoster(),
    );

    expect(res).toHaveLength(1);
    expect(decodeURIComponent(calls[0]!.path)).toContain("/roster?");
    expect(calls[0]!.opts?.authenticated).toBe(true);
    expect(calls[0]!.opts?.next?.revalidate).toBe(300);
    expect(calls[0]!.opts?.next?.tags).toEqual(["roster-moslavac"]);
  });
});
