import { describe, expect, it } from "vitest";
import { runWithPayloadContext } from "./context";
import type { PayloadTransport } from "./context";
import { adaptBoardMember, fetchBoardMembers } from "./getBoardMembers";

type RawBoard = Parameters<typeof adaptBoardMember>[0];

const raw = (over: Partial<RawBoard> = {}): RawBoard => ({
  id: 1,
  name: "Ivo",
  role: "Predsjednik",
  roleGroup: "predsjednistvo",
  photo: null,
  email: null,
  phone: null,
  displayOrder: 3,
  ...over,
});

describe("adaptBoardMember", () => {
  it("maps a raw board member 1:1, keeping null photo and displayOrder", () => {
    expect(adaptBoardMember(raw())).toEqual({
      id: 1,
      name: "Ivo",
      role: "Predsjednik",
      roleGroup: "predsjednistvo",
      photo: null,
      email: null,
      phone: null,
      displayOrder: 3,
    });
  });

  it("keeps a populated media object as the photo", () => {
    const photo = { id: 9, url: "/foto.jpg", alt: "Ivo" };
    expect(adaptBoardMember(raw({ photo })).photo).toEqual(photo);
  });
});

describe("fetchBoardMembers", () => {
  it("queries /board-members sorted by displayOrder, limit 100, tag board-<slug>", async () => {
    const calls: { path: string; tags?: string[] }[] = [];
    const transport: PayloadTransport = async (path, opts) => {
      calls.push({ path, tags: opts?.next?.tags });
      return {
        docs: [raw()],
        totalDocs: 1,
        totalPages: 1,
        page: 1,
        limit: 100,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null,
      };
    };

    const result = await runWithPayloadContext(
      { transport, tenantSlug: "moslavac" },
      () => fetchBoardMembers(),
    );

    expect(result).toHaveLength(1);
    expect(result[0]!.name).toBe("Ivo");

    const path = decodeURIComponent(calls[0]!.path);
    expect(path).toContain("/board-members?");
    expect(path).toContain("sort=displayOrder");
    expect(path).toContain("limit=100");
    expect(calls[0]!.tags).toEqual(["board-moslavac"]);
  });
});
