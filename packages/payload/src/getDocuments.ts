import "server-only";
import { z } from "zod";
import type { ClubDocument, DocumentCategory } from "@/types/document";
import { clubFeatureQuery } from "./clubFeatures";
import { fetchList } from "./fetchCollection";
import { documentCategorySchema } from "./schemas";

export const documentSchema = z.object({
  id: z.number(),
  title: z.string(),
  category: documentCategorySchema,
  url: z.string().nullish().default(null),
  filename: z.string().nullish().default(null),
  displayOrder: z.number().nullish().default(null),
});

type PayloadDocument = z.output<typeof documentSchema>;

export function adaptDocument(doc: PayloadDocument): ClubDocument {
  return {
    id: doc.id,
    title: doc.title,
    category: doc.category,
    url: doc.url ?? null,
    filename: doc.filename ?? null,
    displayOrder: doc.displayOrder ?? 0,
  };
}

const documentsFeature = clubFeatureQuery("documents");

export const fetchDocuments = (params?: {
  category?: DocumentCategory;
}): Promise<ClubDocument[]> =>
  fetchList<PayloadDocument, ClubDocument>({
    ...documentsFeature,
    schema: documentSchema,
    where: params?.category
      ? { "where[category][equals]": params.category }
      : undefined,
    sort: "displayOrder",
    depth: 0,
    limit: 100,
    adapt: adaptDocument,
  });
