import { describe, expect, it } from "vitest";
import { runWithPayloadContext } from "./context";
import type { PayloadFetchOptions, PayloadTransport } from "./context";
import { adaptEquipment, fetchFeaturedEquipment } from "./getEquipment";

type RawEq = Parameters<typeof adaptEquipment>[0];

const raw = (over: Partial<RawEq> = {}): RawEq => ({
  id: 1,
  displayName: "Dres",
  name: "dres-home",
  category: "dresovi",
  price: 30,
  image: {
    id: 5,
    url: "/full.jpg",
    alt: "Alt",
    sizes: {
      card: { url: "/card.jpg", width: 1, height: 1 },
      thumbnail: null,
      hero: null,
    },
  },
  externalUrl: "https://shop",
  description: null,
  displayOrder: 2,
  featured: true,
  active: true,
  tenant: { id: 1, slug: "moslavac" },
  createdAt: "",
  updatedAt: "",
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

describe("adaptEquipment", () => {
  it("prefers the card-sized image and maps the tenant slug", () => {
    expect(adaptEquipment(raw())).toMatchObject({
      imagePath: "/card.jpg",
      imageAlt: "Alt",
      tenantId: "moslavac",
      featured: true,
    });
  });

  it("falls back to the original url and to displayName for alt", () => {
    const eq = adaptEquipment(raw({ image: { id: 5, url: "/full.jpg", alt: "" } }));
    expect(eq.imagePath).toBe("/full.jpg");
    expect(eq.imageAlt).toBe("Dres");
  });

  it("yields an empty path when the image is unpopulated", () => {
    const eq = adaptEquipment(raw({ image: null }));
    expect(eq.imagePath).toBe("");
    expect(eq.imageAlt).toBe("Dres");
  });
});

describe("fetchFeaturedEquipment", () => {
  it("filters active + featured, limit 12, tags equipment-<slug>", async () => {
    const calls: { path: string; opts?: PayloadFetchOptions }[] = [];
    const transport: PayloadTransport = async (path, opts) => {
      calls.push({ path, opts });
      return pageOf([raw()]);
    };

    const res = await runWithPayloadContext(
      { transport, tenantSlug: "moslavac" },
      () => fetchFeaturedEquipment(),
    );

    expect(res).toHaveLength(1);
    const path = decodeURIComponent(calls[0]!.path);
    expect(path).toContain("/equipment?");
    expect(path).toContain("where[active][equals]=true");
    expect(path).toContain("where[featured][equals]=true");
    expect(path).toContain("limit=12");
    expect(calls[0]!.opts?.next?.tags).toEqual(["equipment-moslavac"]);
  });
});
