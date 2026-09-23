import { describe, expect, it } from "vitest";
import { runWithPayloadContext } from "./context";
import type { PayloadTransport } from "./context";
import { getHnsApiKey, getTenant } from "./getTenant";

const HNS_KEY = "dummy-hns-key-A";

/** Tenant kakav CMS vraća autentificiranom frontendu: uključuje `hns.apiKey`. */
const tenantDoc = {
  id: 1,
  slug: "club-a",
  displayName: "NK Club A",
  active: true,
  hns: { apiKey: HNS_KEY, teamId: "1", seniorCompetitionFilter: null },
  branding: null,
  contact: null,
  social: null,
  payment: null,
  legal: null,
};

function recordingTransport() {
  const calls: { path: string; authenticated?: boolean }[] = [];

  const transport: PayloadTransport = async (path, opts) => {
    calls.push({ path, authenticated: opts?.authenticated });

    return {
      docs: [tenantDoc],
      totalDocs: 1,
      totalPages: 1,
      page: 1,
      limit: 1,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
    };
  };

  return { transport, calls };
}

describe("getTenant", () => {
  it("vraća javni Tenant bez HNS ključa", async () => {
    const { transport } = recordingTransport();

    const tenant = await runWithPayloadContext(
      { transport, tenantSlug: "club-a" },
      () => getTenant(),
    );

    expect(tenant.hns).toEqual({ teamId: "1", seniorCompetitionFilter: null });
    expect(JSON.stringify(tenant)).not.toContain(HNS_KEY);
  });

  it("dohvaća Tenant zadanog kluba autentificirano", async () => {
    const { transport, calls } = recordingTransport();

    await runWithPayloadContext({ transport, tenantSlug: "club-a" }, () =>
      getTenant(),
    );

    expect(calls).toHaveLength(1);
    expect(decodeURIComponent(calls[0]!.path)).toContain(
      "/tenants?where[slug][equals]=club-a",
    );
    expect(calls[0]!.authenticated).toBe(true);
  });
});

describe("getHnsApiKey", () => {
  it("vraća HNS ključ Tenanta serverskom HNS klijentu", async () => {
    const { transport } = recordingTransport();

    const key = await runWithPayloadContext(
      { transport, tenantSlug: "club-a" },
      () => getHnsApiKey(),
    );

    expect(key).toBe(HNS_KEY);
  });
});
