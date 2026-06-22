import "server-only";
import type { SchoolProgram } from "@/types/school";
import { payloadFetch } from "./client";
import { tenantSlug } from "./getTenant";
import { mediaObject } from "./media";
import { buildQuery, tenantWhere } from "./query";
import type { PayloadMedia, PayloadPaginated } from "./types";

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

const schoolTags = () => [`school-${tenantSlug}`];

function adaptProgram(doc: PayloadSchoolProgram): SchoolProgram {
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

export async function fetchSchoolPrograms(): Promise<SchoolProgram[]> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    "where[active][equals]": "true",
    limit: 100,
    sort: "displayOrder",
    depth: 2,
  });
  try {
    const result = await payloadFetch<PayloadPaginated<PayloadSchoolProgram>>(
      `/school-programs?${query}`,
      { next: { revalidate: 60, tags: schoolTags() } },
    );
    return result.docs.map(adaptProgram);
  } catch {
    return [];
  }
}

export async function fetchSchoolProgramById(params: {
  id: string;
}): Promise<SchoolProgram | null> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    "where[id][equals]": params.id,
    "where[active][equals]": "true",
    limit: 1,
    depth: 2,
  });
  try {
    const result = await payloadFetch<PayloadPaginated<PayloadSchoolProgram>>(
      `/school-programs?${query}`,
      { next: { revalidate: 60, tags: schoolTags() } },
    );
    const doc = result.docs[0];
    return doc ? adaptProgram(doc) : null;
  } catch {
    return null;
  }
}
