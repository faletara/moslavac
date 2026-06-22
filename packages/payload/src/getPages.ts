import "server-only";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import type { ClubPage, PageKey } from "@/types/page";
import { payloadFetch } from "./client";
import { tenantSlug } from "./getTenant";
import { mediaObject } from "./media";
import { buildQuery, tenantWhere } from "./query";
import type { PayloadMedia, PayloadPaginated } from "./types";

interface PayloadPage {
  id: number;
  key: PageKey;
  title: string;
  eyebrow: string | null;
  heroImage: PayloadMedia | number | null;
  content: { root: unknown } | null;
  gallery: { id?: string; image: PayloadMedia | number }[] | null;
  seoDescription: string | null;
}

const pagesTags = () => [`pages-${tenantSlug}`];

function adaptPage(doc: PayloadPage): ClubPage {
  return {
    id: doc.id,
    key: doc.key,
    title: doc.title,
    eyebrow: doc.eyebrow ?? null,
    heroImage: mediaObject(doc.heroImage),
    content: doc.content
      ? convertLexicalToHTML({
          data: doc.content as Parameters<
            typeof convertLexicalToHTML
          >[0]["data"],
        })
      : "",
    gallery:
      doc.gallery
        ?.map((item) => mediaObject(item.image))
        .filter((m): m is PayloadMedia => m !== null) ?? [],
    seoDescription: doc.seoDescription ?? null,
  };
}

export async function fetchPageByKey(params: {
  key: PageKey;
}): Promise<ClubPage | null> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    "where[key][equals]": params.key,
    limit: 1,
    depth: 2,
  });
  try {
    const result = await payloadFetch<PayloadPaginated<PayloadPage>>(
      `/pages?${query}`,
      { next: { revalidate: 60, tags: pagesTags() } },
    );
    const doc = result.docs[0];
    return doc ? adaptPage(doc) : null;
  } catch {
    // Kolekcija još nije deployana ili zapis ne postoji → graciozno null.
    return null;
  }
}
