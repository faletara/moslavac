import "server-only";
import type { ClubDocument, DocumentCategory } from "@/types/document";
import { fetchList } from "./fetchCollection";

interface PayloadDocument {
  id: number;
  title: string;
  category: DocumentCategory;
  url: string | null;
  filename: string | null;
  displayOrder: number;
}

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

export const fetchDocuments = (params?: {
  category?: DocumentCategory;
}): Promise<ClubDocument[]> =>
  fetchList<PayloadDocument, ClubDocument>({
    collection: "documents",
    where: params?.category
      ? { "where[category][equals]": params.category }
      : undefined,
    sort: "displayOrder",
    depth: 0,
    limit: 100,
    adapt: adaptDocument,
  });
