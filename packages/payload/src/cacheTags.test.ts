import { describe, expect, it } from "vitest";
import { z } from "zod";
import { collectionCacheTag } from "./cacheTags";
import { CLUB_FEATURES } from "./clubFeatures";
import { fetchList } from "./fetchCollection";
import { runWithPayloadContext } from "./context";

// Ugovor između CMS-a i frontenda: CMS poništava tag po imenu kolekcije, a
// frontend ga piše preko `tagPrefix`. Razilaženje bi bilo tiho — CMS bi
// poništio tag koji nitko ne koristi, a sadržaj bi i dalje čekao istek TTL-a.

/** Testu treba samo id; sadržaj kolekcije nije predmet ovog ugovora. */
const idSchema = z.object({ id: z.number() });

const tagsOfFetch = async (collection: string, tagPrefix?: string) => {
  let captured: string[] | undefined;

  await runWithPayloadContext(
    {
      tenantSlug: "sloga-mravince",
      transport: async (_path, opts) => {
        captured = opts?.next?.tags;

        return { docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 10 };
      },
    },
    () => fetchList({ collection, schema: idSchema, tagPrefix, adapt: (doc) => doc }),
  );

  return captured;
};

describe("collectionCacheTag", () => {
  it("matches the tag fetchCollection writes for a plain collection", async () => {
    expect(await tagsOfFetch("news")).toEqual([
      collectionCacheTag("news", "sloga-mravince"),
    ]);
  });

  it("matches the tag for every club feature collection", async () => {
    for (const { feature, slug } of CLUB_FEATURES) {
      expect(await tagsOfFetch(slug, feature)).toEqual([
        collectionCacheTag(slug, "sloga-mravince"),
      ]);
    }
  });

  it("uses the singular prefix the tenant fetch writes", () => {
    // getTenant.ts tagira s `tenant-<slug>`, ne `tenants-<slug>`.
    expect(collectionCacheTag("tenants", "sloga-mravince")).toBe(
      "tenant-sloga-mravince",
    );
  });
});
