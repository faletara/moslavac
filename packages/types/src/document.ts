export type DocumentCategory =
  | "statut"
  | "pravilnik"
  | "obrazac"
  | "izvjesce"
  | "ostalo";

export interface ClubDocument {
  id: number;
  title: string;
  category: DocumentCategory;
  /** Javni URL PDF datoteke. */
  url: string | null;
  filename: string | null;
  displayOrder: number;
}
