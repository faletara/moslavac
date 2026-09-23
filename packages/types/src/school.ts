import type { MediaImage } from "@/lib/payload/schemas";

export interface SchoolProgram {
  id: number;
  name: string;
  ageRange: string | null;
  coach: string | null;
  schedule: string | null;
  description: string | null;
  photo: MediaImage | null;
  displayOrder: number;
}
