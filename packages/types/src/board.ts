import type { MediaImage } from "@/lib/payload/schemas";

export type BoardRoleGroup =
  | "predsjednistvo"
  | "nadzorni-odbor"
  | "strucni-stozer"
  | "ostalo";

export interface BoardMember {
  id: number;
  name: string;
  role: string;
  roleGroup: BoardRoleGroup;
  photo: MediaImage | null;
  email: string | null;
  phone: string | null;
  displayOrder: number;
}
