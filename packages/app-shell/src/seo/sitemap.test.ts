import { describe, expect, it } from "vitest";
import { buildSitemap } from "./sitemap";

const baseUrl = "https://klub.example";
const now = new Date("2026-07-23T10:00:00.000Z");

const urls = (entries: { url: string }[]) => entries.map((entry) => entry.url);

describe("buildSitemap", () => {
  it("gradi apsolutne adrese iz baznog URL-a i deklariranih ruta", async () => {
    const entries = await buildSitemap({
      baseUrl,
      now,
      routes: [{ path: "/" }, { path: "/novosti" }, { path: "/o-klubu" }],
    });

    expect(urls(entries)).toEqual([
      `${baseUrl}/`,
      `${baseUrl}/novosti`,
      `${baseUrl}/o-klubu`,
    ]);
  });

  it("podnosi bazni URL sa završnom kosom crtom i putanju bez početne", async () => {
    const entries = await buildSitemap({
      baseUrl: `${baseUrl}/`,
      now,
      routes: [{ path: "/" }, { path: "novosti" }],
    });

    expect(urls(entries)).toEqual([`${baseUrl}/`, `${baseUrl}/novosti`]);
  });

  it("prenosi učestalost promjene i prioritet rute", async () => {
    const [entry] = await buildSitemap({
      baseUrl,
      now,
      routes: [{ path: "/novosti", changeFrequency: "daily", priority: 0.9 }],
    });

    expect(entry).toMatchObject({
      url: `${baseUrl}/novosti`,
      changeFrequency: "daily",
      priority: 0.9,
    });
  });

  it("koristi vrijeme generiranja za sadržaj bez vlastite oznake promjene", async () => {
    const [entry] = await buildSitemap({
      baseUrl,
      now,
      routes: [{ path: "/" }],
    });

    expect(entry?.lastModified).toEqual(now);
  });

  it("normalizira oznaku promjene iz teksta, milisekundi i datuma", async () => {
    const entries = await buildSitemap({
      baseUrl,
      now,
      routes: [],
      sources: [
        async () => [
          { path: "/a", lastModified: "2026-01-02T00:00:00.000Z" },
          { path: "/b", lastModified: Date.UTC(2026, 0, 3) },
          { path: "/c", lastModified: new Date("2026-01-04T00:00:00.000Z") },
        ],
      ],
    });

    expect(entries.map((entry) => entry.lastModified)).toEqual([
      new Date("2026-01-02T00:00:00.000Z"),
      new Date("2026-01-03T00:00:00.000Z"),
      new Date("2026-01-04T00:00:00.000Z"),
    ]);
  });

  it("vraća se na vrijeme generiranja kada je oznaka promjene neupotrebljiva", async () => {
    const entries = await buildSitemap({
      baseUrl,
      now,
      routes: [],
      sources: [
        async () => [
          { path: "/a", lastModified: "nije datum" },
          { path: "/b", lastModified: null },
        ],
      ],
    });

    expect(entries.map((entry) => entry.lastModified)).toEqual([now, now]);
  });

  it("ispad jednog izvora ne ruši ostatak sitemapa", async () => {
    const entries = await buildSitemap({
      baseUrl,
      now,
      routes: [{ path: "/" }],
      sources: [
        async () => {
          throw new Error("HNS nedostupan");
        },
        async () => [{ path: "/novosti/prva" }],
      ],
    });

    expect(urls(entries)).toEqual([`${baseUrl}/`, `${baseUrl}/novosti/prva`]);
  });

  it("zadržava redoslijed: statične rute pa izvori redom kojim su deklarirani", async () => {
    const entries = await buildSitemap({
      baseUrl,
      now,
      routes: [{ path: "/" }],
      sources: [
        async () => [{ path: "/novosti/prva" }],
        async () => [{ path: "/utakmice/prva" }],
      ],
    });

    expect(urls(entries)).toEqual([
      `${baseUrl}/`,
      `${baseUrl}/novosti/prva`,
      `${baseUrl}/utakmice/prva`,
    ]);
  });

  it("istu adresu navodi jednom, s deklariranom rutom ispred izvora", async () => {
    const entries = await buildSitemap({
      baseUrl,
      now,
      routes: [{ path: "/novosti", priority: 0.9 }],
      sources: [
        async () => [
          { path: "/novosti", priority: 0.1 },
          { path: "/novosti/prva" },
          { path: "/novosti/prva" },
        ],
      ],
    });

    expect(urls(entries)).toEqual([
      `${baseUrl}/novosti`,
      `${baseUrl}/novosti/prva`,
    ]);
    expect(entries[0]?.priority).toBe(0.9);
  });

  it("izostavlja stavke bez upotrebljive putanje", async () => {
    const entries = await buildSitemap({
      baseUrl,
      now,
      routes: [],
      sources: [async () => [{ path: "" }, { path: "   " }, { path: "/ima" }]],
    });

    expect(urls(entries)).toEqual([`${baseUrl}/ima`]);
  });

  it("bez izvora radi jednako kao klub koji ima samo statične rute", async () => {
    const entries = await buildSitemap({ baseUrl, now, routes: [{ path: "/" }] });

    expect(urls(entries)).toEqual([`${baseUrl}/`]);
  });
});
