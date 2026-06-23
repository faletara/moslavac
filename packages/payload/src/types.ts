export interface PayloadMedia {
  id: number;
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  filename?: string | null;
  sizes?: {
    thumbnail?: { url: string; width: number; height: number } | null;
    card?: { url: string; width: number; height: number } | null;
    hero?: { url: string; width: number; height: number } | null;
  } | null;
}

export interface FrontendTenant {
  id: number;
  slug: string;
  displayName: string;
  active: boolean;
  hns: {
    apiKey: string;
    teamId: string;
    seniorCompetitionFilter?: string | null;
  };
  branding?: {
    shortName?: string | null;
    motto?: string | null;
    founded?: number | null;
    logo?: PayloadMedia | string | null;
  } | null;
  contact?: {
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    region?: string | null;
    mapEmbedUrl?: string | null;
  } | null;
  social?: {
    facebook?: string | null;
    youtube?: string | null;
    webshop?: string | null;
  } | null;
  payment?: {
    iban?: string | null;
    recipient?: string | null;
    seasonTicketPrice?: number | null;
  } | null;
  legal?: {
    oib?: string | null;
    registryNumber?: string | null;
    registryAuthority?: string | null;
  } | null;
}

export interface PayloadPaginated<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
