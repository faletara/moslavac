export type EquipmentCategory =
  | "paketi"
  | "dresovi"
  | "trenirke"
  | "jakne"
  | "dodaci";

export interface Equipment {
  id: number;
  displayName: string;
  name: string;
  category: EquipmentCategory;
  price: number;
  imagePath: string;
  imageAlt: string;
  externalUrl: string;
  description: string | null;
  displayOrder: number;
  featured: boolean;
  tenantId: string;
}
