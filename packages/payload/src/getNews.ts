import "server-only";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import type { News, PaginatedNews } from "@/types/news";
import { fetchList, fetchOne, fetchPage } from "./fetchCollection";
import { mediaUrl } from "./media";
import { resolveTenantSlug } from "./tenant";
import type { PayloadMedia } from "./types";

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

function tenantSlugOf(tenant: PayloadNews["tenant"]): string {
  if (tenant && typeof tenant === "object") return tenant.slug;
  return resolveTenantSlug();
}

export function adaptNews(doc: PayloadNews): News {
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

export const fetchLatestNews = (): Promise<News[]> =>
  fetchList<PayloadNews, News>({
    collection: "news",
    sort: "-publishedAt",
    limit: 6,
    adapt: adaptNews,
  });

export const fetchNewsPaginated = (params: {
  page: number;
  size: number;
}): Promise<PaginatedNews> =>
  fetchPage<PayloadNews, News>({
    collection: "news",
    sort: "-publishedAt",
    page: params.page,
    size: params.size,
    adapt: adaptNews,
  });

export const fetchNewsBySlug = (params: {
  slug: string;
}): Promise<News | null> =>
  fetchOne<PayloadNews, News>({
    collection: "news",
    where: { "where[slug][equals]": params.slug },
    adapt: adaptNews,
  });

export const fetchNewsById = (params: { id: string }): Promise<News | null> =>
  fetchOne<PayloadNews, News>({
    collection: "news",
    where: { "where[id][equals]": params.id },
    adapt: adaptNews,
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
