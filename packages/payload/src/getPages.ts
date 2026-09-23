import "server-only";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { z } from "zod";
import type { ClubPage, PageKey } from "@/types/page";
import { clubFeatureQuery } from "./clubFeatures";
import { fetchOne } from "./fetchCollection";
import { mediaRef, pageKeySchema } from "./schemas";

export const pageSchema = z.object({
  id: z.number(),
  key: pageKeySchema,
  title: z.string(),
  eyebrow: z.string().nullish().default(null),
  heroImage: mediaRef,
  content: z.object({ root: z.unknown() }).nullish().default(null),
  gallery: z
    .array(z.object({ id: z.string().nullish(), image: mediaRef }))
    .nullish()
    .default(null),
  seoDescription: z.string().nullish().default(null),
});

type PayloadPage = z.output<typeof pageSchema>;

export function adaptPage(doc: PayloadPage): ClubPage {
  return {
    id: doc.id,
    key: doc.key,
    title: doc.title,
    eyebrow: doc.eyebrow ?? null,
    heroImage: doc.heroImage,
    content: doc.content
      ? // SAFETY: Payload čuva Lexical stablo u `content.root`; tip stupca je
        // širi od onoga što pretvarač traži, a sadržaj je isti.
        convertLexicalToHTML({
          data: doc.content as Parameters<
            typeof convertLexicalToHTML
          >[0]["data"],
        })
      : "",
    gallery:
      doc.gallery?.flatMap((item) =>
        item.image === null ? [] : [item.image],
      ) ?? [],
    seoDescription: doc.seoDescription ?? null,
  };
}

const pagesFeature = clubFeatureQuery("pages");

export const fetchPageByKey = (params: {
  key: PageKey;
}): Promise<ClubPage | null> =>
  fetchOne<PayloadPage, ClubPage>({
    ...pagesFeature,
    schema: pageSchema,
    where: { "where[key][equals]": params.key },
    adapt: adaptPage,
  });
