import "server-only";
import { z } from "zod";
import type { SchoolProgram } from "@/types/school";
import { clubFeatureQuery } from "./clubFeatures";
import { fetchList, fetchOne } from "./fetchCollection";
import { mediaRef } from "./schemas";

export const schoolProgramSchema = z.object({
  id: z.number(),
  name: z.string(),
  ageRange: z.string().nullish().default(null),
  coach: z.string().nullish().default(null),
  schedule: z.string().nullish().default(null),
  description: z.string().nullish().default(null),
  photo: mediaRef,
  displayOrder: z.number().nullish().default(null),
  active: z.boolean().nullish().default(null),
});

type PayloadSchoolProgram = z.output<typeof schoolProgramSchema>;

export function adaptProgram(doc: PayloadSchoolProgram): SchoolProgram {
  return {
    id: doc.id,
    name: doc.name,
    ageRange: doc.ageRange ?? null,
    coach: doc.coach ?? null,
    schedule: doc.schedule ?? null,
    description: doc.description ?? null,
    photo: doc.photo,
    displayOrder: doc.displayOrder ?? 0,
  };
}

const schoolFeature = clubFeatureQuery("school");

export const fetchSchoolPrograms = (): Promise<SchoolProgram[]> =>
  fetchList<PayloadSchoolProgram, SchoolProgram>({
    ...schoolFeature,
    schema: schoolProgramSchema,
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
    schema: schoolProgramSchema,
    where: {
      "where[id][equals]": params.id,
      "where[active][equals]": "true",
    },
    adapt: adaptProgram,
  });
