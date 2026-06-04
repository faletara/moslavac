import type { PayloadMedia } from "@/lib/payload/types";

export type PageKey =
  | "povijest"
  | "navijaci"
  | "statut"
  | "skola-info"
  | "seniori-info";

/** Adaptirana statična stranica iz CMS-a (rich-text → HTML). */
export interface ClubPage {
  id: number;
  key: PageKey;
  title: string;
  eyebrow: string | null;
  heroImage: PayloadMedia | null;
  /** Rich-text sadržaj pretvoren u HTML. */
  content: string;
  gallery: PayloadMedia[];
  seoDescription: string | null;
}
