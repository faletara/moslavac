import type { PayloadMedia } from "@/lib/payload/types";

export interface SchoolProgram {
  id: number;
  name: string;
  ageRange: string | null;
  coach: string | null;
  schedule: string | null;
  description: string | null;
  photo: PayloadMedia | null;
  displayOrder: number;
}
