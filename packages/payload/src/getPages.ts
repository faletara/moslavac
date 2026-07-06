import "server-only";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import type { ClubPage, PageKey } from "@/types/page";
import { fetchOne } from "./fetchCollection";
import { mediaObject } from "./media";
import type { PayloadMedia } from "./types";

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

export function adaptPage(doc: PayloadPage): ClubPage {
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

export const fetchPageByKey = (params: {
  key: PageKey;
}): Promise<ClubPage | null> =>
  fetchOne<PayloadPage, ClubPage>({
    collection: "pages",
    where: { "where[key][equals]": params.key },
    adapt: adaptPage,
  });
