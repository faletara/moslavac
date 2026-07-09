import "server-only";
import type { SchoolProgram } from "@/types/school";
import { clubFeatureQuery } from "./clubFeatures";
import { fetchList, fetchOne } from "./fetchCollection";
import { mediaObject } from "./media";
import type { PayloadMedia } from "./types";

interface PayloadSchoolProgram {
  id: number;
  name: string;
  ageRange: string | null;
  coach: string | null;
  schedule: string | null;
  description: string | null;
  photo: PayloadMedia | number | null;
  displayOrder: number;
  active: boolean;
}

export function adaptProgram(doc: PayloadSchoolProgram): SchoolProgram {
  return {
    id: doc.id,
    name: doc.name,
    ageRange: doc.ageRange ?? null,
    coach: doc.coach ?? null,
    schedule: doc.schedule ?? null,
    description: doc.description ?? null,
    photo: mediaObject(doc.photo),
    displayOrder: doc.displayOrder ?? 0,
  };
}

const schoolFeature = clubFeatureQuery("school");

export const fetchSchoolPrograms = (): Promise<SchoolProgram[]> =>
  fetchList<PayloadSchoolProgram, SchoolProgram>({
    ...schoolFeature,
    where: { "where[active][equals]": "true" },
    sort: "displayOrder",
    limit: 100,
    adapt: adaptProgram,
  });

export const fetchSchoolProgramById = (params: {
  id: string;
}): Promise<SchoolProgram | null> =>
  fetchOne<PayloadSchoolProgram, SchoolProgram>({
    ...schoolFeature,
    where: {
      "where[id][equals]": params.id,
      "where[active][equals]": "true",
    },
    adapt: adaptProgram,
  });
