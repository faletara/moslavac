import "server-only";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import type { News, PaginatedNews } from "@/types/news";
import { payloadFetch } from "./client";
import { tenantSlug } from "./getTenant";
import { publishedWhere } from "./query";
import type { PayloadMedia, PayloadPaginated } from "./types";

interface PayloadNews {
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

function mediaUrl(value: PayloadMedia | number | null | undefined): string | null {
  if (!value || typeof value !== "object") return null;
  return value.url ?? null;
}

function tenantSlugOf(tenant: PayloadNews["tenant"]): string {
  if (tenant && typeof tenant === "object") return tenant.slug;
  return tenantSlug;
}

function adaptNews(doc: PayloadNews): News {
  const html = doc.content
    ? convertLexicalToHTML({
        data: doc.content as Parameters<typeof convertLexicalToHTML>[0]["data"],
      })
    : "";

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    content: html,
    date: doc.publishedAt ?? doc.createdAt,
    updatedAt: doc.updatedAt ?? doc.publishedAt ?? doc.createdAt,
    thumbnailPath: mediaUrl(doc.thumbnail),
    imagePaths:
      doc.gallery
        ?.map((item) => mediaUrl(item.image))
        .filter((url): url is string => url !== null) ?? [],
    tenantId: tenantSlugOf(doc.tenant),
  };
}

function adaptNewsPaginated(page: PayloadPaginated<PayloadNews>): PaginatedNews {
  return {
    content: page.docs.map(adaptNews),
    totalElements: page.totalDocs,
    totalPages: page.totalPages,
    number: page.page - 1,
    size: page.limit,
  };
}

export async function fetchLatestNews(): Promise<News[]> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    ...publishedWhere(),
    limit: 6,
    sort: "-publishedAt",
    depth: 2,
  });
  const result = await payloadFetch<PayloadPaginated<PayloadNews>>(
    `/news?${query}`,
    { next: { revalidate: 60, tags: newsTags() } },
  );
  return result.docs.map(adaptNews);
}

export async function fetchNewsPaginated(params: {
  page: number;
  size: number;
}): Promise<PaginatedNews> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    ...publishedWhere(),
    page: params.page,
    limit: params.size,
    sort: "-publishedAt",
    depth: 2,
  });
  const result = await payloadFetch<PayloadPaginated<PayloadNews>>(
    `/news?${query}`,
    { next: { revalidate: 60, tags: newsTags() } },
  );
  return adaptNewsPaginated(result);
}

export async function fetchNewsBySlug(params: {
  slug: string;
}): Promise<News | null> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    ...publishedWhere(),
    "where[slug][equals]": params.slug,
    limit: 1,
    depth: 2,
  });
  const result = await payloadFetch<PayloadPaginated<PayloadNews>>(
    `/news?${query}`,
    { next: { revalidate: 60, tags: newsTags() } },
  );
  const doc = result.docs[0];
  return doc ? adaptNews(doc) : null;
}

export async function fetchNewsById(params: {
  id: string;
}): Promise<News | null> {
  // Query by id rather than findByID so the published-only filter applies —
  // unpublished drafts must not be reachable by id either.
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    ...publishedWhere(),
    "where[id][equals]": params.id,
    limit: 1,
    depth: 2,
  });
  const result = await payloadFetch<PayloadPaginated<PayloadNews>>(
    `/news?${query}`,
    { next: { revalidate: 60, tags: newsTags() } },
  );
  const doc = result.docs[0];
  return doc ? adaptNews(doc) : null;
}
