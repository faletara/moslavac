import "server-only";
import type { ClubDocument, DocumentCategory } from "@/types/document";
import { payloadFetch } from "./client";
import { tenantSlug } from "./getTenant";
import { buildQuery, tenantWhere } from "./query";
import type { PayloadPaginated } from "./types";

interface PayloadDocument {
  id: number;
  title: string;
  category: DocumentCategory;
  url: string | null;
  filename: string | null;
  displayOrder: number;
}

const documentsTags = () => [`documents-${tenantSlug}`];

function adaptDocument(doc: PayloadDocument): ClubDocument {
  return {
    id: doc.id,
    title: doc.title,
    category: doc.category,
    url: doc.url ?? null,
    filename: doc.filename ?? null,
    displayOrder: doc.displayOrder ?? 0,
  };
}

export async function fetchDocuments(params?: {
  category?: DocumentCategory;
}): Promise<ClubDocument[]> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    ...(params?.category
      ? { "where[category][equals]": params.category }
      : {}),
    limit: 100,
    sort: "displayOrder",
    depth: 0,
  });
  try {
    const result = await payloadFetch<PayloadPaginated<PayloadDocument>>(
      `/documents?${query}`,
      { next: { revalidate: 60, tags: documentsTags() } },
    );
    return result.docs.map(adaptDocument);
  } catch {
    return [];
  }
}
