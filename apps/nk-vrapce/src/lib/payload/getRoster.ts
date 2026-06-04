import "server-only";
import { payloadFetch } from "./client";
import { tenantSlug } from "./getTenant";
import type { PayloadPaginated } from "./types";
import type { RosterEntry } from "@/types/roster";

const rosterTags = () => [`roster-${tenantSlug}`];

const tenantWhere = (slug: string) => ({
  "where[tenant.slug][equals]": slug,
});

function buildQuery(params: Record<string, string | number>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.append(key, String(value));
  }
  return search.toString();
}

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
