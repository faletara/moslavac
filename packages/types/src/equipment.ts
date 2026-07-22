export type EquipmentCategory =
  | "paketi"
  | "dresovi"
  | "trenirke"
  | "jakne"
  | "dodaci";

export interface Equipment {
  id: number;
  displayName: string;
  category: EquipmentCategory;
  price: number;
  imagePath: string;
  imageAlt: string;
  externalUrl: string;
  displayOrder: number;
  featured: boolean;
  tenantId: string;
}
