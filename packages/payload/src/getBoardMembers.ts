import "server-only";
import { z } from "zod";
import type { BoardMember } from "@/types/board";
import { clubFeatureQuery } from "./clubFeatures";
import { fetchList } from "./fetchCollection";
import { mediaRef } from "./schemas";

export const boardMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  roleGroup: z.enum([
    "predsjednistvo",
    "nadzorni-odbor",
    "strucni-stozer",
    "ostalo",
  ]),
  photo: mediaRef,
  email: z.string().nullish().default(null),
  phone: z.string().nullish().default(null),
  displayOrder: z.number().nullish().default(null),
});

type PayloadBoardMember = z.output<typeof boardMemberSchema>;

export function adaptBoardMember(doc: PayloadBoardMember): BoardMember {
  return {
    id: doc.id,
    name: doc.name,
    role: doc.role,
    roleGroup: doc.roleGroup,
    photo: doc.photo,
    email: doc.email ?? null,
    phone: doc.phone ?? null,
    displayOrder: doc.displayOrder ?? 0,
  };
}

const boardFeature = clubFeatureQuery("board");

export const fetchBoardMembers = (): Promise<BoardMember[]> =>
  fetchList<PayloadBoardMember, BoardMember>({
    ...boardFeature,
    schema: boardMemberSchema,
    sort: "displayOrder",
    limit: 100,
    adapt: adaptBoardMember,
  });
