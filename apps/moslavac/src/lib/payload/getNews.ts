import "server-only";
import { payloadFetch } from "./client";
import { tenantSlug } from "./getTenant";
import type { PayloadMedia, PayloadPaginated } from "./types";

export interface PayloadNews {
  id: number;
  title: string;
  slug: string | null;
  content: { root: unknown } | null;
  publishedAt: string;
  excerpt: string | null;
  thumbnail: PayloadMedia | number | null;
  gallery:
    | {
        id?: string;
        image: PayloadMedia | number;
      }[]
    | null;
  tenant: number | { id: number; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

const newsTags = () => [`news-${tenantSlug}`];

const tenantWhere = (slug: string) => ({
  "where[tenant.slug][equals]": slug,
});

function buildQuery(params: Record<string, string | number>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.append(key, String(value));
  }
  return search.toString();
}

export async function fetchLatestNews(): Promise<PayloadNews[]> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    limit: 6,
    sort: "-publishedAt",
    depth: 2,
  });
  const result = await payloadFetch<PayloadPaginated<PayloadNews>>(
    `/news?${query}`,
    { next: { revalidate: 60, tags: newsTags() } },
  );
  return result.docs;
}

export async function fetchNewsPaginated(params: {
  page: number;
  size: number;
}): Promise<PayloadPaginated<PayloadNews>> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    page: params.page,
    limit: params.size,
    sort: "-publishedAt",
    depth: 2,
  });
  return payloadFetch<PayloadPaginated<PayloadNews>>(`/news?${query}`, {
    next: { revalidate: 60, tags: newsTags() },
  });
}

export async function fetchNewsBySlug(params: {
  slug: string;
}): Promise<PayloadNews | null> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    "where[slug][equals]": params.slug,
    limit: 1,
    depth: 2,
  });
  const result = await payloadFetch<PayloadPaginated<PayloadNews>>(
    `/news?${query}`,
    { next: { revalidate: 60, tags: newsTags() } },
  );
  return result.docs[0] ?? null;
}

export async function fetchNewsById(params: {
  id: string;
}): Promise<PayloadNews | null> {
  try {
    return await payloadFetch<PayloadNews>(`/news/${params.id}?depth=2`, {
      next: { revalidate: 60, tags: newsTags() },
    });
  } catch {
    return null;
  }
}
