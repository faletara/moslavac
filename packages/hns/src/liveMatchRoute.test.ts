import { describe, expect, it } from "vitest";
import type { HnsLineups, HnsMatch, HnsMatchEvent } from "@/types/hns";
import { HnsHttpError, runWithHnsContext } from "./context";
import type { HnsTransport } from "./context";
import { createLiveMatchRoute } from "./liveMatchRoute";

const ctx = (transport: HnsTransport) => ({
  transport,
  teamId: "42",
  apiKey: "test-key",
});

const GET = createLiveMatchRoute();

function call(transport: HnsTransport, id: string): Promise<Response> {
  return runWithHnsContext(ctx(transport), () =>
    GET(new Request(`https://klub.test/api/utakmice/${id}/uzivo`), {
      params: Promise.resolve({ id }),
    }),
  );
}

// SAFETY (sva tri fixturea): nose samo polja koja fetcher i adapter čitaju;
// ostatak HNS-ove OpenAPI strukture ovaj test ne dira.
const rawMatch = {
  id: 99,
  dateTimeUTC: 1_710_000_000_000,
  homeTeam: { id: 42, name: "HNK Sloga", allowDetail: true },
  awayTeam: { id: 7, name: "Gosti", allowDetail: true },
  homeTeamResult: { current: 2, half: 1 },
  awayTeamResult: { current: 1, half: 1 },
  liveStatus: "RUNNING",
  minute: 67,
  currentMinute: "67'",
  allowDetail: true,
} as HnsMatch;

const rawEvent = {
  eventId: 5,
  eventType: { name: "Pogodak", fcdName: "GOAL" },
  homeTeam: true,
  minuteFull: 18,
  player: { personId: 11, name: "Strijelac" },
} as HnsMatchEvent;

const rawLineups = {
  home: { players: [{ personId: 11, name: "Strijelac" }], officials: [] },
} as HnsLineups;

/** Lažni HNS koji poznaje samo utakmicu 99. */
const liveHns: HnsTransport = async (endpoint) => {
  if (endpoint.startsWith("/api/live/match/99/events")) return [rawEvent];

  if (endpoint.startsWith("/api/live/match/99/lineups")) return rawLineups;

  if (endpoint.startsWith("/api/live/match/99?")) return rawMatch;

  throw new Error(`unexpected endpoint ${endpoint}`);
};

describe("GET /api/utakmice/[id]/uzivo", () => {
  it("vraća LiveMatch u domain obliku s dijeljenim CDN kešom od 30 s", async () => {
    const response = await call(liveHns, "99");

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe(
      "public, s-maxage=30, stale-while-revalidate=30",
    );

    const body = await response.json();

    expect(body).toMatchObject({
      matchId: 99,
      liveStatus: "RUNNING",
      minute: 67,
      currentMinute: "67'",
      score: {
        home: { current: 2, half: 1 },
        away: { current: 1, half: 1 },
      },
      events: [{ id: 5, kind: "goal", side: "home", minute: 18 }],
      lineups: { home: { players: [{ personId: 11, name: "Strijelac" }] } },
    });
    // Samo ono što se mijenja uživo — bez timova, natjecanja, tablice i sudaca.
    expect(Object.keys(body).sort()).toEqual([
      "currentMinute",
      "events",
      "lineups",
      "liveStatus",
      "matchId",
      "minute",
      "score",
    ]);
  });

  it("traži od HNS-a utakmicu, događaje i postave s rokom keša od 30 s", async () => {
    const revalidates = new Map<string, number | undefined>();

    const transport: HnsTransport = async (endpoint, opts) => {
      revalidates.set(endpoint.split("?")[0]!, opts?.revalidate);

      return liveHns(endpoint, opts);
    };

    await call(transport, "99");

    expect(Object.fromEntries(revalidates)).toEqual({
      "/api/live/match/99": 30,
      "/api/live/match/99/events": 30,
      "/api/live/match/99/lineups": 30,
    });
  });

  it("vraća 404 kad HNS ne poznaje utakmicu", async () => {
    // HNS uspješno odgovori, ali bez utakmice; događaji i postave su prazni.
    const transport: HnsTransport = async (endpoint) =>
      endpoint.includes("/events") ? [] : null;

    const response = await call(transport, "12345");

    expect(response.status).toBe(404);
  });

  it("vraća 404 kad HNS na nepoznatu utakmicu odgovori HTTP greškom", async () => {
    // Stvarni HNS: utakmica → 404, događaji i postave → 400.
    const transport: HnsTransport = async (endpoint) => {
      const status = endpoint.startsWith("/api/live/match/12345?") ? 404 : 400;

      throw new HnsHttpError(status, endpoint);
    };

    const response = await call(transport, "12345");

    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("vraća 502 bez keša kad HNS zakaže", async () => {
    const transport: HnsTransport = async () => {
      throw new Error("HNS fetch failed (503 Service Unavailable)");
    };

    const response = await call(transport, "99");

    expect(response.status).toBe(502);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("vraća 502, a ne djelomično stanje, kad zakažu samo događaji", async () => {
    const transport: HnsTransport = async (endpoint) => {
      if (endpoint.includes("/events")) throw new Error("HNS fetch failed");

      return liveHns(endpoint);
    };

    const response = await call(transport, "99");

    expect(response.status).toBe(502);
  });

  it.each(["abc", "0", "-5", "1.5", "12abc", "1e3", ""])(
    "vraća 400 za ID %j bez poziva HNS-u",
    async (id) => {
      let called = false;

      const transport: HnsTransport = async () => {
        called = true;

        return null;
      };

      const response = await call(transport, id);

      expect(response.status).toBe(400);
      expect(called).toBe(false);
    },
  );
});
