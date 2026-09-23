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

// `FrontendTenant` je sada izlaz `tenantSchema` (vidi schemas.ts): logo i
// ostale relacije stižu normalizirane, pa ga ovdje samo ponovno izvozimo.
export type { FrontendTenant, MediaImage } from "./schemas";

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
