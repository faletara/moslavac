import "server-only";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { z } from "zod";
import type { News, PaginatedNews } from "@/types/news";
import { fetchList, fetchOne, fetchPage } from "./fetchCollection";
import { mediaRef, tenantRef } from "./schemas";
import { resolveTenantSlug } from "./tenant";

export const newsSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string().nullish().default(null),
  content: z.object({ root: z.unknown() }).nullish().default(null),
  publishedAt: z.string(),
  excerpt: z.string().nullish().default(null),
  thumbnail: mediaRef,
  gallery: z
    .array(z.object({ id: z.string().nullish(), image: mediaRef }))
    .nullish()
    .default(null),
  tenant: tenantRef,
  sourceMatchId: z.union([z.number(), z.string()]).nullish().default(null),
  createdAt: z.string(),
  updatedAt: z.string(),
});

type PayloadNews = z.output<typeof newsSchema>;

function tenantSlugOf(tenant: PayloadNews["tenant"]): string {
  return tenant?.slug ?? resolveTenantSlug();
}

type LexicalToHtml = typeof convertLexicalToHTML;

/**
 * `toHtml` postoji da test ne mora mockati modul: pretvarač je teški serverski
 * paket, a ovdje je dovoljan bilo koji poziv s istim potpisom.
 */
export function adaptNews(
  doc: PayloadNews,
  toHtml: LexicalToHtml = convertLexicalToHTML,
): News {
  const html = doc.content
    ? // SAFETY: Payload čuva Lexical stablo u `content.root`; tip stupca je
      // širi od onoga što pretvarač traži, a sadržaj je isti.
      toHtml({
        data: doc.content as Parameters<LexicalToHtml>[0]["data"],
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
    thumbnailPath: doc.thumbnail?.url ?? null,
    imagePaths:
      doc.gallery?.flatMap((item) =>
        item.image === null ? [] : [item.image.url],
      ) ?? [],
    tenantId: tenantSlugOf(doc.tenant),
    // Payload numeric polje stiže kao string iz `numeric` stupca.
    sourceMatchId:
      doc.sourceMatchId == null ? null : Number(doc.sourceMatchId) || null,
  };
}

export const fetchLatestNews = (): Promise<News[]> =>
  fetchList<PayloadNews, News>({
    collection: "news",
    schema: newsSchema,
    sort: "-publishedAt",
    limit: 6,
    adapt: (doc) => adaptNews(doc),
  });

export const fetchNewsPaginated = (params: {
  page: number;
  size: number;
}): Promise<PaginatedNews> =>
  fetchPage<PayloadNews, News>({
    collection: "news",
    schema: newsSchema,
    sort: "-publishedAt",
    page: params.page,
    size: params.size,
    adapt: (doc) => adaptNews(doc),
  });

export const fetchNewsBySlug = (params: {
  slug: string;
}): Promise<News | null> =>
  fetchOne<PayloadNews, News>({
    collection: "news",
    schema: newsSchema,
    where: { "where[slug][equals]": params.slug },
    adapt: (doc) => adaptNews(doc),
  });

export const fetchNewsById = (params: { id: string }): Promise<News | null> =>
  fetchOne<PayloadNews, News>({
    collection: "news",
    schema: newsSchema,
    where: { "where[id][equals]": params.id },
    adapt: (doc) => adaptNews(doc),
  });

/** Slug + timestamps only, for the sitemap. `depth: 0` and no lexical→HTML
 * conversion keep it cheap even across the full news archive. */
export interface NewsSitemapEntry {
  slug: string;
  date: string;
  updatedAt: string;
}

export const fetchNewsSitemapEntries = (): Promise<NewsSitemapEntry[]> =>
  fetchList<PayloadNews, NewsSitemapEntry | null>({
    collection: "news",
    schema: newsSchema,
    sort: "-publishedAt",
    limit: 1000,
    depth: 0,
    adapt: (doc) =>
      doc.slug
        ? {
            slug: doc.slug,
            date: doc.publishedAt ?? doc.createdAt,
            updatedAt: doc.updatedAt ?? doc.publishedAt ?? doc.createdAt,
          }
        : null,
  }).then((entries) =>
    entries.filter((entry): entry is NewsSitemapEntry => entry !== null),
  );
