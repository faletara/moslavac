import "server-only";
import type { BoardMember, BoardRoleGroup } from "@/types/board";
import { payloadFetch } from "./client";
import { tenantSlug } from "./getTenant";
import { mediaObject } from "./media";
import { buildQuery, tenantWhere } from "./query";
import type { PayloadMedia, PayloadPaginated } from "./types";

interface PayloadBoardMember {
  id: number;
  name: string;
  role: string;
  roleGroup: BoardRoleGroup;
  photo: PayloadMedia | number | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  displayOrder: number;
}

const boardTags = () => [`board-${tenantSlug}`];

function adaptBoardMember(doc: PayloadBoardMember): BoardMember {
  return {
    id: doc.id,
    name: doc.name,
    role: doc.role,
    roleGroup: doc.roleGroup,
    photo: mediaObject(doc.photo),
    email: doc.email ?? null,
    phone: doc.phone ?? null,
    bio: doc.bio ?? null,
    displayOrder: doc.displayOrder ?? 0,
  };
}

export async function fetchBoardMembers(): Promise<BoardMember[]> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    limit: 100,
    sort: "displayOrder",
    depth: 2,
  });
  try {
    const result = await payloadFetch<PayloadPaginated<PayloadBoardMember>>(
      `/board-members?${query}`,
      { next: { revalidate: 60, tags: boardTags() } },
    );
    return result.docs.map(adaptBoardMember);
  } catch {
    return [];
  }
}
