import type { MediaImage } from "@/lib/payload/schemas";

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
  photo: MediaImage | null;
}
