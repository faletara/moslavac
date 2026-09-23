import type { Metadata } from "next";
import type { FrontendTenant } from "@/lib/payload/types";
import type { Facility } from "@/types/hns";
import { z } from "zod";

/**
 * Projection of a Tenant into the identity a search engine sees: page metadata
 * and schema.org graph. Every club renders this from its own Tenant record, so
 * nothing here may hardcode a club name, place or URL.
 */

type ClubIdentityInput = {
  tenant: FrontendTenant;
  baseUrl: string;
};

/**
 * Stadion dolazi iz HNS-a, ne iz Tenanta, pa se predaje zasebno i smije
 * izostati — JSON-LD kluba mora se izgraditi i kad je HNS nedostupan.
 */
type ClubJsonLdInput = ClubIdentityInput & {
  facility?: Facility | null;
};

type GeoCoordinates = {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
};

type PlaceJsonLd = {
  "@type": "Place";
  name: string;
  address?: PostalAddress;
  geo?: GeoCoordinates;
};

type PostalAddress = {
  "@type": "PostalAddress";
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressCountry: "HR";
};

type OrganizationJsonLd = {
  "@context": "https://schema.org";
  "@type": "SportsOrganization";
  "@id": string;
  name: string;
  alternateName?: string[];
  slogan?: string;
  sport: "Football";
  url: string;
  logo?: string;
  image?: string;
  foundingDate?: string;
  address?: PostalAddress;
  email?: string;
  telephone?: string;
  sameAs?: string[];
  location?: PlaceJsonLd;
  geo?: GeoCoordinates;
};

type WebSiteJsonLd = {
  "@context": "https://schema.org";
  "@type": "WebSite";
  "@id": string;
  name: string;
  url: string;
  inLanguage: "hr-HR";
  publisher: { "@id": string };
};

/** Tenantov logo stiže već normaliziran iz `tenantSchema`. */
function resolveLogoUrl(tenant: FrontendTenant): string | null {
  return tenant.branding?.logo?.url ?? null;
}

/** Shared with the manifest projection so both describe the club identically. */
export function clubDescription(tenant: FrontendTenant): string {
  return (
    tenant.branding?.motto ??
    `Službena web stranica nogometnog kluba ${tenant.displayName}`
  );
}

/**
 * Common alternate names people actually search for, derived generically from
 * the club's display name (e.g. "SNK Moslavac" → "Moslavac", "NK Moslavac").
 * Feeds schema.org `alternateName` so Google links these queries to the club
 * entity.
 */
function clubNameVariants(tenant: FrontendTenant): string[] {
  const variants = new Set<string>();
  const prefixRe = /^(SNK|ŠNK|HNK|GNK|MNK|NK|NŠ|ŠK)\s+/i;
  const bare = tenant.displayName.replace(prefixRe, "").trim();

  if (bare && bare !== tenant.displayName) {
    variants.add(bare);
    variants.add(`NK ${bare}`);
  }

  const shortName = tenant.branding?.shortName;

  if (shortName) variants.add(shortName);
  variants.delete(tenant.displayName);

  return [...variants];
}

function clubAddress(tenant: FrontendTenant): PostalAddress | null {
  const street = tenant.contact?.address;
  const city = tenant.contact?.city;
  const region = tenant.contact?.region;

  if (!street && !city && !region) return null;

  const address: PostalAddress = {
    "@type": "PostalAddress",
    addressCountry: "HR",
  };

  if (street) address.streetAddress = street;

  if (city) address.addressLocality = city;

  if (region) address.addressRegion = region;

  return address;
}

/**
 * Stadion kluba kao `Place` s koordinatama. Google lokalne rezultate veže uz
 * koordinate, a HNS ih isporučuje uz objekt — bez njih se `location` izostavlja
 * jer je Place bez geo podatka za tražilicu bezvrijedan.
 */
function clubVenue(facility: Facility | null | undefined): PlaceJsonLd | null {
  if (!facility?.name) return null;
  const { latitude, longitude } = facility;

  // Koordinate stižu iz HNS-a i smiju izostati; zod ih provjerava umjesto
  // `typeof` grananja na pozivnom mjestu.
  const coords = z
    .object({ latitude: z.number().finite(), longitude: z.number().finite() })
    .safeParse({ latitude, longitude });

  if (!coords.success) return null;

  const street = facility.address?.trim();
  const place = facility.place?.trim();

  const venue: PlaceJsonLd = {
    "@type": "Place",
    name: facility.name,
    geo: {
      "@type": "GeoCoordinates",
      latitude: coords.data.latitude,
      longitude: coords.data.longitude,
    },
  };

  if (street || place) {
    const address: PostalAddress = {
      "@type": "PostalAddress",
      addressCountry: "HR",
    };

    if (street) address.streetAddress = street;

    if (place) address.addressLocality = place;

    venue.address = address;
  }

  return venue;
}

export function buildClubMetadata({
  tenant,
  baseUrl,
}: ClubIdentityInput): Metadata {
  const name = tenant.displayName;
  const description = clubDescription(tenant);

  // Slike se namjerno NE postavljaju ovdje: datotečni `opengraph-image.tsx`
  // sam popuni og:image (a Next iz njega izvede i twitter:image). Postavljanje
  // `images` nadjačalo bi generiranu karticu golim logotipom i ubilo bi svaku
  // vlastitu sliku dublje rute — uključujući postere pojedine utakmice.
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "hr_HR",
      siteName: name,
      title: name,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
    },
  };
}

/** Oba čvora koje stranica kluba ugrađuje u jedan `<script>`. */
export interface ClubJsonLd {
  organization: OrganizationJsonLd;
  website: WebSiteJsonLd;
}

export function buildClubJsonLd({
  tenant,
  baseUrl,
  facility,
}: ClubJsonLdInput): ClubJsonLd {
  const organizationId = `${baseUrl}/#organization`;
  const logoUrl = resolveLogoUrl(tenant);
  const altNames = clubNameVariants(tenant);
  const address = clubAddress(tenant);
  const motto = tenant.branding?.motto;
  const founded = tenant.branding?.founded;
  const email = tenant.contact?.email;
  const phone = tenant.contact?.phone;

  // `sameAs` je Googleu potvrda da su klub, profil i trgovina isti entitet, pa
  // ide svaki javni profil kojim klub raspolaže.
  const sameAs = [
    tenant.social?.facebook,
    tenant.social?.instagram,
    tenant.social?.youtube,
    tenant.social?.webshop,
  ].filter((value): value is string => Boolean(value));

  const venue = clubVenue(facility);

  const organization: OrganizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "@id": organizationId,
    name: tenant.displayName,
    sport: "Football",
    url: baseUrl,
  };

  if (altNames.length > 0) organization.alternateName = altNames;

  if (motto) organization.slogan = motto;

  if (logoUrl) {
    organization.logo = logoUrl;
    organization.image = logoUrl;
  }

  if (founded) organization.foundingDate = String(founded);

  if (address) organization.address = address;

  if (email) organization.email = email;

  if (phone) organization.telephone = phone;

  if (sameAs.length > 0) organization.sameAs = sameAs;

  if (venue) {
    organization.location = venue;
    organization.geo = venue.geo;
  }

  return {
    organization,
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: tenant.displayName,
      url: baseUrl,
      inLanguage: "hr-HR",
      publisher: { "@id": organizationId },
    },
  };
}
