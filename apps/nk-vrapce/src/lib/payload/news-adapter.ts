import "server-only";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import type { News, PaginatedNews } from "@/types/news";
import type { PayloadMedia } from "./types";
import type { PayloadNews } from "./getNews";
import type { PayloadPaginated } from "./types";

function mediaUrl(value: PayloadMedia | number | null | undefined): string | null {
  if (!value || typeof value !== "object") return null;
  return value.url ?? null;
}

function tenantSlugOf(
  tenant: PayloadNews["tenant"],
  fallback: string,
): string {
  if (!tenant) return fallback;
  if (typeof tenant === "object") return tenant.slug;
  return fallback;
}

export function adaptPayloadNews(
  doc: PayloadNews,
  tenantSlug: string,
): News {
  const html = doc.content
    ? convertLexicalToHTML({
        data: doc.content as Parameters<typeof convertLexicalToHTML>[0]["data"],
      })
    : "";

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    content: html,
    date: doc.publishedAt ?? doc.createdAt,
    thumbnailPath: mediaUrl(doc.thumbnail),
    imagePaths:
      doc.gallery
        ?.map((item) => mediaUrl(item.image))
        .filter((url): url is string => url !== null) ?? [],
    tenantId: tenantSlugOf(doc.tenant, tenantSlug),
  };
}

export function adaptPayloadNewsPaginated(
  page: PayloadPaginated<PayloadNews>,
  tenantSlug: string,
): PaginatedNews {
  return {
    content: page.docs.map((doc) => adaptPayloadNews(doc, tenantSlug)),
    totalElements: page.totalDocs,
    totalPages: page.totalPages,
    number: page.page - 1,
    size: page.limit,
  };
}
