import type { PayloadMedia } from "@/lib/payload/types";

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
  photo: PayloadMedia | null;
  email: string | null;
  phone: string | null;
  displayOrder: number;
}
