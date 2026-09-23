import { describe, expect, it } from "vitest";
import { runWithHnsContext } from "./context";
import type { HnsFetchOptions, HnsTransport } from "./context";
import { createHnsImageResponse } from "./imageResponse";

// 1×1 PNG — dovoljno da detectContentType prepozna potpis.
const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

interface Call {
  endpoint: string;
  opts?: HnsFetchOptions;
}

function imageRecorder() {
  const calls: Call[] = [];

  const transport: HnsTransport = async (endpoint, opts) => {
    calls.push({ endpoint, opts });

    return { uuid: "x", value: PNG_BASE64 };
  };

  return { transport, calls };
}

const ctx = (transport: HnsTransport) => ({
  transport,
  teamId: "42",
  apiKey: "test-key",
});

const request = (uuid: string) =>
  new Request(`https://klub.test/api/images/${uuid}`);

describe("createHnsImageResponse", () => {
  it("svodi varijante velikih i malih slova na jedan HNS URL i jedan cache tag", async () => {
    const { transport, calls } = imageRecorder();

    const variants = [
      "fe195b59-6d02-449c-9cad-0fc837c35bb6",
      "FE195B59-6D02-449C-9CAD-0FC837C35BB6",
      "Fe195b59-6D02-449c-9CaD-0fc837C35bb6",
    ];

    for (const uuid of variants) {
      const res = await runWithHnsContext(ctx(transport), () =>
        createHnsImageResponse(request(uuid), uuid),
      );

      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("image/png");
    }

    const endpoints = new Set(calls.map((c) => c.endpoint));
    const tags = new Set(calls.flatMap((c) => c.opts?.tags ?? []));

    expect([...endpoints]).toEqual([
      "/api/live/images/fe195b59-6d02-449c-9cad-0fc837c35bb6?teamIdFilter=42",
    ]);
    expect(tags.size).toBe(1);
    expect([...tags][0]).toMatch(/image-fe195b59-6d02-449c-9cad-0fc837c35bb6$/);
  });

  it("odbija id koji nije UUID bez ijednog HNS poziva", async () => {
    const { transport, calls } = imageRecorder();

    for (const uuid of ["abc", "../team/1", `${"a".repeat(8)}-xyz`]) {
      const res = await runWithHnsContext(ctx(transport), () =>
        createHnsImageResponse(request(uuid), uuid),
      );

      expect(res.status).toBe(400);
    }

    expect(calls).toHaveLength(0);
  });
});
