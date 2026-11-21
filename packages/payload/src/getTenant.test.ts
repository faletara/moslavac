import { afterEach, describe, expect, it, vi } from "vitest";
import type { PayloadFetchOptions, PayloadTransport } from "./context";

const tenantDoc = { id: 1, slug: "sloga", name: "Sloga" };

const pageOf = (docs: unknown[]) => ({
  docs,
  totalDocs: docs.length,
  totalPages: 1,
  page: 1,
  limit: 1,
  hasNextPage: false,
  hasPrevPage: false,
  nextPage: null,
  prevPage: null,
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("getTenant", () => {
  it("revalidates daily and keeps the tenant-<slug> tag", async () => {
    // getTenant reads the tenant slug from env at module load.
    vi.stubEnv("PAYLOAD_TENANT_SLUG", "sloga");
    vi.resetModules();
    // Import the context alongside it so both share the fresh module graph.
    const { runWithPayloadContext } = await import("./context");
    const { getTenant } = await import("./getTenant");
    const calls: PayloadFetchOptions[] = [];

    const transport: PayloadTransport = async (_path, opts) => {
      calls.push(opts ?? {});

      return pageOf([tenantDoc]);
    };

    await runWithPayloadContext({ transport }, () => getTenant());

    expect(calls[0]?.next?.revalidate).toBe(86_400);
    expect(calls[0]?.next?.tags).toEqual(["tenant-sloga"]);
  });
});
