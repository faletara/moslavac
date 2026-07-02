import "server-only";
import { payloadFetch } from "./client";
import { tenantSlug } from "./getTenant";
import { buildQuery, tenantWhere } from "./query";
import type { PayloadPaginated } from "./types";
import type { RosterEntry } from "@/types/roster";

const rosterTags = () => [`roster-${tenantSlug}`];

export async function fetchRoster(): Promise<RosterEntry[]> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    limit: 100,
    sort: "displayOrder",
    depth: 2,
  });
  const result = await payloadFetch<PayloadPaginated<RosterEntry>>(
    `/roster?${query}`,
    { authenticated: true, next: { revalidate: 300, tags: rosterTags() } },
  );
  return result.docs;
}
