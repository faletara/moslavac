import { describe, expect, it } from "vitest";
import { runWithPayloadContext } from "./context";
import type { PayloadTransport } from "./context";
import { adaptAlbum, fetchAlbums } from "./getGallery";

type RawAlbum = Parameters<typeof adaptAlbum>[0];

const raw = (over: Partial<RawAlbum> = {}): RawAlbum => ({
  id: 1,
  title: "Album",
  slug: "album",
  date: "2026-01-01",
  coverImage: { id: 1, url: "/cover.jpg", alt: "" },
  description: null,
  photos: [
    { image: { id: 2, url: "/p1.jpg", alt: "" }, caption: "Prva" },
    { image: 99, caption: null }, // unpopulated relation → dropped
  ],
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

describe("adaptAlbum", () => {
  it("keeps populated photos and drops unpopulated (numeric) ones", () => {
    const album = adaptAlbum(raw());
    expect(album.coverImage).toEqual({ id: 1, url: "/cover.jpg", alt: "" });
    expect(album.photos).toHaveLength(1);
    expect(album.photos[0]).toEqual({
      image: { id: 2, url: "/p1.jpg", alt: "" },
      caption: "Prva",
    });
  });

  it("defaults photos to [] when null", () => {
    expect(adaptAlbum(raw({ photos: null })).photos).toEqual([]);
  });
});

describe("fetchAlbums", () => {
  it("queries /gallery-albums and tags gallery-<slug>", async () => {
    const calls: { path: string; tags?: string[] }[] = [];
    const transport: PayloadTransport = async (path, opts) => {
      calls.push({ path, tags: opts?.next?.tags });
      return pageOf([raw()]);
    };

    const res = await runWithPayloadContext(
      { transport, tenantSlug: "moslavac" },
      () => fetchAlbums(),
    );

    expect(res).toHaveLength(1);
    expect(decodeURIComponent(calls[0]!.path)).toContain("/gallery-albums?");
    expect(calls[0]!.tags).toEqual(["gallery-moslavac"]);
  });
});
