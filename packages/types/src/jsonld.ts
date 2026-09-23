/**
 * Schema.org oblici koje stranice ugrađuju u `<script type="application/ld+json">`.
 *
 * Postoje da JSON-LD ne bude `Record<string, unknown>`: tražilica čita ova
 * polja po imenu, pa tipkarska greška u ključu prolazi tiho i gubi bogati
 * rezultat. Opisani su samo ključevi koje ovaj repo stvarno šalje.
 */

export interface PostalAddressJsonLd {
  "@type": "PostalAddress";
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressCountry: "HR";
}

export interface GeoCoordinatesJsonLd {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
}

export interface PlaceJsonLd {
  "@type": "Place";
  name: string;
  address?: PostalAddressJsonLd;
  geo?: GeoCoordinatesJsonLd;
}

export interface ImageObjectJsonLd {
  "@type": "ImageObject";
  url: string;
}

export interface OrganizationJsonLd {
  "@context"?: "https://schema.org";
  "@type": "Organization" | "SportsOrganization";
  "@id"?: string;
  name: string;
  alternateName?: string[];
  slogan?: string;
  sport?: "Football";
  url?: string;
  logo?: ImageObjectJsonLd | string;
  image?: string;
  foundingDate?: string;
  address?: PostalAddressJsonLd;
  email?: string;
  telephone?: string;
  sameAs?: string[];
  location?: PlaceJsonLd;
  geo?: GeoCoordinatesJsonLd;
}

export interface SportsTeamJsonLd {
  "@context"?: "https://schema.org";
  "@type": "SportsTeam";
  name: string;
  sport?: "Football";
  url?: string;
  logo?: string;
  athlete?: PersonJsonLd[];
  coach?: PersonJsonLd[];
}

export interface PersonJsonLd {
  "@context"?: "https://schema.org";
  "@type": "Person";
  name: string;
  image?: string;
  jobTitle?: string;
  memberOf?: SportsTeamJsonLd;
  url?: string;
}

export interface QuantitativeValueJsonLd {
  "@type": "QuantitativeValue";
  value: number;
}

export interface SportsEventJsonLd {
  "@context"?: "https://schema.org";
  "@type": "SportsEvent";
  name: string;
  url?: string;
  sport?: "Football";
  description?: string;
  startDate?: string;
  endDate?: string;
  eventStatus?: string;
  eventAttendanceMode?: string;
  image?: string[];
  location?: PlaceJsonLd;
  homeTeam?: SportsTeamJsonLd;
  awayTeam?: SportsTeamJsonLd;
  performer?: SportsTeamJsonLd[];
  organizer?: OrganizationJsonLd;
  superEvent?: { "@type": "SportsEvent"; name: string };
  homeScore?: QuantitativeValueJsonLd;
  awayScore?: QuantitativeValueJsonLd;
}

export interface WebPageRefJsonLd {
  "@type": "WebPage";
  "@id": string;
}

export interface NewsArticleJsonLd {
  "@context"?: "https://schema.org";
  "@type": "NewsArticle";
  headline: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string[];
  author?: OrganizationJsonLd;
  publisher?: OrganizationJsonLd;
  mainEntityOfPage?: WebPageRefJsonLd | string;
  url?: string;
}

export interface ProfilePageJsonLd {
  "@context"?: "https://schema.org";
  "@type": "ProfilePage";
  url: string;
  mainEntity: PersonJsonLd;
}

export interface ListItemJsonLd {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbListJsonLd {
  "@context"?: "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: ListItemJsonLd[];
}

/** Bilo koji čvor koji stranica smije ugraditi. */
export type JsonLdNode =
  | BreadcrumbListJsonLd
  | NewsArticleJsonLd
  | OrganizationJsonLd
  | PersonJsonLd
  | PlaceJsonLd
  | ProfilePageJsonLd
  | SportsEventJsonLd
  | SportsTeamJsonLd;
