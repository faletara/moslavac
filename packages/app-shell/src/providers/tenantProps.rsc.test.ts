import { createRequire } from "node:module";
import { PassThrough } from "node:stream";
import { createElement } from "react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { runWithPayloadContext } from "@/lib/payload/context";
import type { PayloadTransport } from "@/lib/payload/context";
import { getTenant } from "@/lib/payload/getTenant";

// Next's own flight server, the one that turns a Server Component tree into the
// RSC payload inlined into every page's HTML. Club apps depend on `next`; the
// monorepo root does not, so resolve it from a Club app.
const requireFromApp = createRequire(
  new URL("../../../../apps/moslavac/package.json", import.meta.url),
);

interface FlightServer {
  registerClientReference: <T>(proxy: T, id: string, name: string) => T;
  renderToPipeableStream: (
    model: ReactNode,
    manifest: Record<string, { id: string; chunks: string[]; name: string }>,
  ) => { pipe: (destination: NodeJS.WritableStream) => void };
}

// SAFETY: `require` vraća `any`; `FlightServer` opisuje samo dva izvoza koja
// ovaj test zove, s potpisima iz React 19 `react-server-dom-webpack/server`.
const flight = requireFromApp(
  "next/dist/compiled/react-server-dom-webpack/server.node",
) as FlightServer;

const HNS_KEY = "dummy-hns-key-A";

const tenantTransport: PayloadTransport = async () => ({
  docs: [
    {
      id: 1,
      slug: "club-a",
      displayName: "NK Club A",
      hns: { apiKey: HNS_KEY, teamId: "1", seniorCompetitionFilter: null },
    },
  ],
});

/** Client komponenta kako je vidi flight server: referenca, ne kod. */
function clientComponent(id: string) {
  return flight.registerClientReference(
    () => {
      throw new Error(`${id} se renderira u browseru`);
    },
    id,
    "default",
  );
}

/** RSC payload stabla, isti niz koji Next ugradi u HTML (`self.__next_f`). */
function renderFlight(tree: ReactNode, ids: string[]): Promise<string> {
  const manifest = Object.fromEntries(
    ids.map((id) => [`${id}#default`, { id, chunks: [], name: "default" }]),
  );

  return new Promise((resolve, reject) => {
    const sink = new PassThrough();
    let payload = "";
    sink.on("data", (chunk: Buffer) => (payload += chunk.toString()));
    sink.on("end", () => resolve(payload));
    sink.on("error", reject);
    flight.renderToPipeableStream(tree, manifest).pipe(sink);
  });
}

describe("Tenant u props client komponenti", () => {
  it("RSC payload Providers, Header, Footer i Hero ne sadrži HNS ključ", async () => {
    const tenant = await runWithPayloadContext(
      { transport: tenantTransport, tenantSlug: "club-a" },
      () => getTenant(),
    );

    // Client sinkovi Tenanta: Providers (ClubRootShell), Header i Footer
    // (layout Club appa) te Hero (početna stranica Club appa).
    const Providers = clientComponent("Providers");
    const Header = clientComponent("Header");
    const Hero = clientComponent("Hero");
    const Footer = clientComponent("Footer");

    const tree = createElement(
      Providers,
      { tenant },
      createElement(Header, { tenant, logo: tenant.branding?.logo ?? null }),
      createElement(Hero, { tenant }),
      createElement(Footer, { tenant }),
    );

    const payload = await renderFlight(tree, [
      "Providers",
      "Header",
      "Hero",
      "Footer",
    ]);

    expect(payload).toContain('"slug":"club-a"');
    expect(payload).not.toContain(HNS_KEY);
    expect(payload).not.toContain("apiKey");
  });
});
