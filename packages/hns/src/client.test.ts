import { afterEach, describe, expect, it, vi } from "vitest";
import { runWithPayloadContext } from "@/lib/payload/context";
import type { PayloadTransport } from "@/lib/payload/context";
import { httpTransport } from "./client";

const HNS_KEY = "dummy-hns-key-A";

/** CMS vraća Tenant s HNS ključem; frontend ga čita autentificirano. */
const payloadTransport: PayloadTransport = async () => ({
  docs: [
    {
      id: 1,
      slug: "club-a",
      hns: { apiKey: HNS_KEY, teamId: "1", seniorCompetitionFilter: null },
    },
  ],
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("httpTransport", () => {
  it("šalje HNS ključ Tenanta u API_KEY zaglavlju", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json({}));
    vi.stubGlobal("fetch", fetchMock);

    await runWithPayloadContext(
      { transport: payloadTransport, tenantSlug: "club-a" },
      () => httpTransport("/v1/teams/1"),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const headers = new Headers(fetchMock.mock.calls[0]![1]?.headers);
    expect(headers.get("API_KEY")).toBe(HNS_KEY);
  });
});
