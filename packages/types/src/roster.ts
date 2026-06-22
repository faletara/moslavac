import type { PayloadMedia } from "@/lib/payload/types";

export type RosterPosition =
  | "vratar"
  | "obrambeni"
  | "vezni"
  | "napadac"
  | "trener";

export interface RosterEntry {
  id: number;
  displayName: string;
  personId: number;
  position: RosterPosition;
  displayOrder: number;
  jerseyNumber: number | null;
  captain: boolean;
  photo: PayloadMedia | null;
}
