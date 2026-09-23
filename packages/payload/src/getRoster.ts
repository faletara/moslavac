import "server-only";
import { z } from "zod";
import type { RosterEntry } from "@/types/roster";
import { fetchList } from "./fetchCollection";
import { mediaRef } from "./schemas";

export const rosterSchema = z.object({
  id: z.number(),
  displayName: z.string().nullish().transform((text) => text ?? ""),
  personId: z.number().nullish().transform((n) => n ?? 0),
  position: z
    .enum(["vratar", "obrambeni", "vezni", "napadac", "trener"])
    .catch("vezni"),
  displayOrder: z.number().nullish().default(null),
  jerseyNumber: z.number().nullish().default(null),
  captain: z.boolean().nullish().default(null),
  photo: mediaRef,
});

type PayloadRosterEntry = z.output<typeof rosterSchema>;

export function adaptRoster(doc: PayloadRosterEntry): RosterEntry {
  return {
    id: doc.id,
    displayName: doc.displayName,
    personId: doc.personId,
    position: doc.position,
    displayOrder: doc.displayOrder ?? 0,
    jerseyNumber: doc.jerseyNumber ?? null,
    captain: doc.captain ?? false,
    photo: doc.photo,
  };
}

export const fetchRoster = (): Promise<RosterEntry[]> =>
  fetchList<PayloadRosterEntry, RosterEntry>({
    collection: "roster",
    schema: rosterSchema,
    sort: "displayName",
    limit: 100,
    authenticated: true,
    revalidate: 300,
    adapt: adaptRoster,
  });
