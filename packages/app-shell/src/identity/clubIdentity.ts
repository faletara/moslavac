import type { Metadata } from "next";
import type { FrontendTenant } from "@/lib/payload/types";

/**
 * Projection of a Tenant into the identity a search engine sees: page metadata
 * and schema.org graph. Every club renders this from its own Tenant record, so
 * nothing here may hardcode a club name, place or URL.
 */

type ClubIdentityInput = {
  tenant: FrontendTenant;
  baseUrl: string;
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

/** A Tenant's logo arrives either already resolved or as a bare id/URL string. */
function resolveLogoUrl(tenant: FrontendTenant): string | null {
  const logo = tenant.branding?.logo;
  if (!logo) return null;
  return typeof logo === "string" ? logo : logo.url;
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
  return {
    "@type": "PostalAddress",
    ...(street ? { streetAddress: street } : {}),
    ...(city ? { addressLocality: city } : {}),
    ...(region ? { addressRegion: region } : {}),
    addressCountry: "HR",
  };
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

export function buildClubJsonLd({ tenant, baseUrl }: ClubIdentityInput): {
  organization: OrganizationJsonLd;
  website: WebSiteJsonLd;
} {
  const organizationId = `${baseUrl}/#organization`;
  const logoUrl = resolveLogoUrl(tenant);
  const altNames = clubNameVariants(tenant);
  const address = clubAddress(tenant);
  const motto = tenant.branding?.motto;
  const founded = tenant.branding?.founded;
  const email = tenant.contact?.email;
  const phone = tenant.contact?.phone;
  const sameAs = [tenant.social?.facebook, tenant.social?.youtube].filter(
    (value): value is string => Boolean(value),
  );

  return {
    organization: {
      "@context": "https://schema.org",
      "@type": "SportsOrganization",
      "@id": organizationId,
      name: tenant.displayName,
      ...(altNames.length > 0 ? { alternateName: altNames } : {}),
      ...(motto ? { slogan: motto } : {}),
      sport: "Football",
      url: baseUrl,
      ...(logoUrl ? { logo: logoUrl, image: logoUrl } : {}),
      ...(founded ? { foundingDate: String(founded) } : {}),
      ...(address ? { address } : {}),
      ...(email ? { email } : {}),
      ...(phone ? { telephone: phone } : {}),
      ...(sameAs.length > 0 ? { sameAs } : {}),
    },
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
