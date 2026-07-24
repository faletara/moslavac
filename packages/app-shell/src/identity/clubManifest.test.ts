import { describe, expect, it } from "vitest";
import type { FrontendTenant } from "@/lib/payload/types";
import { buildClubManifest } from "./clubManifest";

const themeColor = "#de2025";

function tenant(overrides: Partial<FrontendTenant> = {}): FrontendTenant {
  return {
    id: 1,
    slug: "primjer",
    displayName: "ŠNK Primjer",
    active: true,
    hns: { apiKey: "k", teamId: "1" },
    ...overrides,
  };
}

describe("buildClubManifest", () => {
  it("izvodi ime i kratko ime iz Tenanta", () => {
    const manifest = buildClubManifest({
      tenant: tenant({ branding: { shortName: "Primjer" } }),
      themeColor,
    });

    expect(manifest.name).toBe("ŠNK Primjer");
    expect(manifest.short_name).toBe("Primjer");
  });

  it("vraća se na puni naziv kad kratko ime nije upisano", () => {
    const manifest = buildClubManifest({ tenant: tenant(), themeColor });

    expect(manifest.short_name).toBe("ŠNK Primjer");
  });

  it("koristi isti opis kao metadata — moto, pa generički fallback", () => {
    const sMottom = buildClubManifest({
      tenant: tenant({ branding: { motto: "Ponos naše općine" } }),
      themeColor,
    });
    const bezMotta = buildClubManifest({ tenant: tenant(), themeColor });

    expect(sMottom.description).toBe("Ponos naše općine");
    expect(bezMotta.description).toBe(
      "Službena web stranica nogometnog kluba ŠNK Primjer",
    );
  });

  it("nosi boju teme kluba, uz bijelu pozadinu", () => {
    const manifest = buildClubManifest({ tenant: tenant(), themeColor });

    expect(manifest.theme_color).toBe("#de2025");
    expect(manifest.background_color).toBe("#ffffff");
  });

  it("instalabilan je: standalone s korijena, s ikonom preko 192px", () => {
    const manifest = buildClubManifest({ tenant: tenant(), themeColor });

    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");
    // Dimenzije moraju odgovarati datotekama koje svaki klub isporučuje —
    // deklarirana veličina koju bitmapa nema znači da Chrome odbaci ikonu.
    expect(manifest.icons).toEqual([
      { src: "/icon.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ]);
  });

  it("ne poseže za logotipom iz Tenanta — ikone su lokalne, poznatih dimenzija", () => {
    const manifest = buildClubManifest({
      tenant: tenant({
        branding: { logo: "https://cdn.example/proizvoljan-logo.png" },
      }),
      themeColor,
    });

    expect(JSON.stringify(manifest.icons)).not.toContain("cdn.example");
  });
});
