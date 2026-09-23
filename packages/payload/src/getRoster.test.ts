import { describe, expect, it } from "vitest";
import { runWithPayloadContext } from "./context";
import type { PayloadFetchOptions, PayloadTransport } from "./context";
import { z } from "zod";
import { adaptRoster, fetchRoster, fetchRosterEntry, rosterSchema } from "./getRoster";

/** Dokument kakav Payload vraća po žici, prije raščlanjivanja. */
type WireRoster = z.input<typeof rosterSchema>;

const raw = (over: Partial<WireRoster> = {}): WireRoster => ({
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

const parsed = (over: Partial<WireRoster> = {}) => rosterSchema.parse(raw(over));

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
      parsed({ photo: 7, jerseyNumber: null, captain: null, displayOrder: null }),
    );

    expect(entry.photo).toBeNull();
    expect(entry.jerseyNumber).toBeNull();
    expect(entry.captain).toBe(false);
    expect(entry.displayOrder).toBe(0);
  });

  it("keeps a populated photo object", () => {
    expect(adaptRoster(parsed()).photo).toEqual({
      id: 7,
      url: "/ivan.jpg",
      cardUrl: "/ivan.jpg",
      heroUrl: "/ivan.jpg",
      alt: "",
      width: null,
      height: null,
    });
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

describe("fetchRosterEntry", () => {
  // Momčad kluba: igrač 99 i unos bez HNS igrača (personId 0).
  const transport: PayloadTransport = async () =>
    pageOf([raw(), raw({ id: 2, displayName: "Bez HNS-a", personId: null })]);

  const lookup = (personId: number) =>
    runWithPayloadContext({ transport, tenantSlug: "sloga-mravince" }, () =>
      fetchRosterEntry(personId),
    );

  it("returns the club's player", async () => {
    expect((await lookup(99))?.displayName).toBe("Ivan Horvat");
  });

  it("returns null for a player outside the club's roster", async () => {
    expect(await lookup(12345)).toBeNull();
  });

  it("never matches a roster entry that has no HNS player", async () => {
    expect(await lookup(0)).toBeNull();
  });
});
