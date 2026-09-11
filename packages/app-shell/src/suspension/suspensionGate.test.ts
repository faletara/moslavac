import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { applySuspension, suspensionGate } from "./suspensionGate";

const TOKEN = "7f905df87bbd36ea5e7dedb50b70ae96";

function request(url = "https://snk-moslavac.hr/utakmice", cookie?: string) {
  return new NextRequest(url, { headers: cookie ? { cookie } : undefined });
}

describe("suspensionGate", () => {
  it("prekidač je ugašen u repozitoriju", () => {
    expect(suspensionGate(request())).toBeNull();
  });

  it("propušta promet dok prekidač nije upaljen", () => {
    expect(applySuspension(request(), false)).toBeNull();
  });

  it("vraća 503 s Retry-After kad je stranica zaustavljena", async () => {
    const response = applySuspension(request(), true);

    expect(response?.status).toBe(503);
    expect(response?.headers.get("retry-after")).toBe("86400");
    expect(response?.headers.get("cache-control")).toContain("no-store");
    await expect(response?.text()).resolves.toContain("privremeno nedostupna");
  });

  it("token u adresi postavlja kolačić i miče token iz adrese", () => {
    const response = applySuspension(
      request(`https://snk-moslavac.hr/utakmice?pristup=${TOKEN}`),
      true,
    );

    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toBe(
      "https://snk-moslavac.hr/utakmice",
    );
    expect(response?.cookies.get("moslavac-pristup")?.value).toBe(TOKEN);
  });

  it("propušta posjetitelja s ispravnim kolačićem, zaustavlja ostale", () => {
    expect(
      applySuspension(request(undefined, `moslavac-pristup=${TOKEN}`), true),
    ).toBeNull();
    expect(
      applySuspension(request(undefined, "moslavac-pristup=krivo"), true)
        ?.status,
    ).toBe(503);
  });
});
