import "server-only";
import type { RosterEntry, RosterPosition } from "@/types/roster";
import { fetchList } from "./fetchCollection";
import { mediaObject } from "./media";
import type { PayloadMedia } from "./types";

interface PayloadRosterEntry {
  id: number;
  displayName: string;
  personId: number;
  position: RosterPosition;
  displayOrder: number | null;
  jerseyNumber: number | null;
  captain: boolean | null;
  photo: PayloadMedia | number | null;
}

export function adaptRoster(doc: PayloadRosterEntry): RosterEntry {
  return {
    id: doc.id,
    displayName: doc.displayName,
    personId: doc.personId,
    position: doc.position,
    displayOrder: doc.displayOrder ?? 0,
    jerseyNumber: doc.jerseyNumber ?? null,
    captain: doc.captain ?? false,
    photo: mediaObject(doc.photo),
  };
}

export const fetchRoster = (): Promise<RosterEntry[]> =>
  fetchList<PayloadRosterEntry, RosterEntry>({
    collection: "roster",
    sort: "displayOrder",
    limit: 100,
    authenticated: true,
    revalidate: 300,
    adapt: adaptRoster,
  });
