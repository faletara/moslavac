import "server-only";
import type { BoardMember, BoardRoleGroup } from "@/types/board";
import { clubFeatureQuery } from "./clubFeatures";
import { fetchList } from "./fetchCollection";
import { mediaObject } from "./media";
import type { PayloadMedia } from "./types";

interface PayloadBoardMember {
  id: number;
  name: string;
  role: string;
  roleGroup: BoardRoleGroup;
  photo: PayloadMedia | number | null;
  email: string | null;
  phone: string | null;
  displayOrder: number;
}

export function adaptBoardMember(doc: PayloadBoardMember): BoardMember {
  return {
    id: doc.id,
    name: doc.name,
    role: doc.role,
    roleGroup: doc.roleGroup,
    photo: mediaObject(doc.photo),
    email: doc.email ?? null,
    phone: doc.phone ?? null,
    displayOrder: doc.displayOrder ?? 0,
  };
}

const boardFeature = clubFeatureQuery("board");

export const fetchBoardMembers = (): Promise<BoardMember[]> =>
  fetchList<PayloadBoardMember, BoardMember>({
    ...boardFeature,
    sort: "displayOrder",
    limit: 100,
    adapt: adaptBoardMember,
  });
