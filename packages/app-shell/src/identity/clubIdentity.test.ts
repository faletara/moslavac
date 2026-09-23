import { describe, expect, it } from "vitest";
import type { FrontendTenant } from "@/lib/payload/types";
import { buildClubJsonLd, buildClubMetadata } from "./clubIdentity";

const baseUrl = "https://klub.example";

function tenant(overrides: Partial<FrontendTenant> = {}): FrontendTenant {
  return {
    id: 1,
    slug: "primjer",
    displayName: "ŠNK Primjer",
    active: true,
    hns: { teamId: "1" },
    ...overrides,
  };
}

describe("buildClubMetadata", () => {
  it("izvodi naslov i opis iz Tenanta", () => {
    const meta = buildClubMetadata({ tenant: tenant(), baseUrl });

    expect(meta.title).toEqual({
      default: "ŠNK Primjer",
      template: "%s | ŠNK Primjer",
    });
    expect(meta.description).toBe(
      "Službena web stranica nogometnog kluba ŠNK Primjer",
    );
    expect(meta.alternates?.canonical).toBe("/");
    expect(String(meta.metadataBase)).toBe(`${baseUrl}/`);
  });

  it("koristi klupski moto kao opis kada postoji", () => {
    const meta = buildClubMetadata({
      tenant: tenant({ branding: { motto: "Ponos kvarta" } }),
      baseUrl,
    });

    expect(meta.description).toBe("Ponos kvarta");
    expect(meta.openGraph?.description).toBe("Ponos kvarta");
  });

  it("ne postavlja OG sliku, da datotečni opengraph-image ostane na snazi", () => {
    const meta = buildClubMetadata({ tenant: tenant(), baseUrl });

    expect(meta.openGraph).not.toHaveProperty("images");
    expect(meta.twitter).not.toHaveProperty("images");
  });

  it("ni klupski logotip ne nadjačava generiranu karticu s grbom", () => {
    // SAFETY: fixture nosi samo `branding.logo`, jedino polje koje ovaj test
    // provjerava; ostatak tenanta `buildClubMetadata` ovdje ne čita.
    const meta = buildClubMetadata({
      tenant: tenant({
        branding: { logo: { url: "https://cdn.example/logo.png" } },
      }) as FrontendTenant,
      baseUrl,
    });

    expect(meta.openGraph).not.toHaveProperty("images");
    expect(meta.twitter).not.toHaveProperty("images");
  });
});

describe("buildClubJsonLd", () => {
  it("gradi organizaciju i website povezane preko @id", () => {
    const { organization, website } = buildClubJsonLd({
      tenant: tenant(),
      baseUrl,
    });

    expect(organization["@type"]).toBe("SportsOrganization");
    expect(organization["@id"]).toBe(`${baseUrl}/#organization`);
    expect(organization.name).toBe("ŠNK Primjer");
    expect(organization.sport).toBe("Football");
    expect(organization.url).toBe(baseUrl);
    expect(website["@id"]).toBe(`${baseUrl}/#website`);
    expect(website.publisher).toEqual({ "@id": `${baseUrl}/#organization` });
    expect(website.inLanguage).toBe("hr-HR");
  });

  it("izvodi alternativne nazive iz naziva kluba bez hardkodiranja", () => {
    const { organization } = buildClubJsonLd({
      tenant: tenant({ displayName: "SNK Moslavac" }),
      baseUrl,
    });

    expect(organization.alternateName).toEqual(["Moslavac", "NK Moslavac"]);
  });

  it("dodaje kratki naziv iz brandinga i ne ponavlja puni naziv", () => {
    const { organization } = buildClubJsonLd({
      tenant: tenant({
        displayName: "NK Vrapče",
        branding: { shortName: "Vrapče Zagreb" },
      }),
      baseUrl,
    });

    // "NK Vrapče" je i sam puni naziv pa ispada iz alternativa.
    expect(organization.alternateName).toEqual(["Vrapče", "Vrapče Zagreb"]);
  });

  it("ne emitira alternateName kada klupski naziv nema prepoznat prefiks", () => {
    const { organization } = buildClubJsonLd({
      tenant: tenant({ displayName: "Zagreb" }),
      baseUrl,
    });

    expect(organization).not.toHaveProperty("alternateName");
  });

  it("gradi adresu iz Tenant kontakta, bez hardkodiranog mjesta", () => {
    const { organization } = buildClubJsonLd({
      tenant: tenant({
        contact: {
          address: "Sportska 1",
          city: "Popovača",
          region: "Sisačko-moslavačka županija",
        },
      }),
      baseUrl,
    });

    expect(organization.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "Sportska 1",
      addressLocality: "Popovača",
      addressRegion: "Sisačko-moslavačka županija",
      addressCountry: "HR",
    });
  });

  it("izostavlja nepopunjena polja adrese umjesto da emitira prazne vrijednosti", () => {
    const { organization } = buildClubJsonLd({
      tenant: tenant({ contact: { city: "Split" } }),
      baseUrl,
    });

    expect(organization.address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Split",
      addressCountry: "HR",
    });
  });

  it("ne emitira adresu kada Tenant nema nijedan podatak o lokaciji", () => {
    const { organization } = buildClubJsonLd({
      tenant: tenant({ contact: { email: "klub@example.hr" } }),
      baseUrl,
    });

    expect(organization).not.toHaveProperty("address");
    expect(organization.email).toBe("klub@example.hr");
  });

  it("emitira samo popunjene društvene mreže", () => {
    const { organization } = buildClubJsonLd({
      tenant: tenant({
        social: { facebook: "https://facebook.com/klub", youtube: null },
      }),
      baseUrl,
    });

    expect(organization.sameAs).toEqual(["https://facebook.com/klub"]);
  });

  it("ne emitira sameAs kada klub nema društvene mreže", () => {
    const { organization } = buildClubJsonLd({ tenant: tenant(), baseUrl });

    expect(organization).not.toHaveProperty("sameAs");
  });

  it("prenosi godinu osnutka i moto kada su popunjeni", () => {
    const { organization } = buildClubJsonLd({
      tenant: tenant({ branding: { founded: 1932, motto: "Ponos kvarta" } }),
      baseUrl,
    });

    expect(organization.foundingDate).toBe("1932");
    expect(organization.slogan).toBe("Ponos kvarta");
  });
});

describe("buildClubJsonLd — stadion", () => {
  const facility = {
    id: 7,
    fifaId: null,
    name: "Stadion Kraj Rijeke",
    address: "Sportska 1",
    place: "Primjer",
    latitude: 45.5,
    longitude: 16.6,
    field: null,
  };

  it("dodaje Place i geo koordinate kada ih HNS isporuči", () => {
    const { organization } = buildClubJsonLd({
      tenant: tenant(),
      baseUrl,
      facility,
    });

    expect(organization.location).toEqual({
      "@type": "Place",
      name: "Stadion Kraj Rijeke",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Sportska 1",
        addressLocality: "Primjer",
        addressCountry: "HR",
      },
      geo: { "@type": "GeoCoordinates", latitude: 45.5, longitude: 16.6 },
    });
    expect(organization.geo).toEqual(organization.location?.geo);
  });

  it("izostavlja lokaciju kada koordinate nedostaju", () => {
    const { organization } = buildClubJsonLd({
      tenant: tenant(),
      baseUrl,
      facility: { ...facility, latitude: null, longitude: null },
    });

    expect(organization.location).toBeUndefined();
    expect(organization.geo).toBeUndefined();
  });

  it("gradi se i bez stadiona, jer HNS smije biti nedostupan", () => {
    const { organization } = buildClubJsonLd({ tenant: tenant(), baseUrl });

    expect(organization.location).toBeUndefined();
    expect(organization.name).toBe("ŠNK Primjer");
  });

  it("skuplja svaki javni profil u sameAs", () => {
    const { organization } = buildClubJsonLd({
      tenant: tenant({
        social: {
          facebook: "https://facebook.com/primjer",
          instagram: "https://instagram.com/primjer",
          youtube: "https://youtube.com/@primjer",
          webshop: "https://trgovina.example",
        },
      }),
      baseUrl,
    });

    expect(organization.sameAs).toEqual([
      "https://facebook.com/primjer",
      "https://instagram.com/primjer",
      "https://youtube.com/@primjer",
      "https://trgovina.example",
    ]);
  });
});
