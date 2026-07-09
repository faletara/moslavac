import "server-only";
import { getHnsTeamId, resolveTransport } from "./client";
import { tenantSlug } from "@/lib/payload/getTenant";

// The deep HNS data-fetch module. Every fetcher is a thin declaration over
// `hnsList` / `hnsResource`; the shared shape (teamId lookup → teamIdFilter
// append → cache tag → transport → unwrap → error contract) lives here once.
// The transport is a seam (see context.ts): HTTP in prod, a fake in tests.

interface HnsSpec {
  /** Builds the endpoint. The own-team id is injected for in-path use. */
  path: (teamId: string) => string;
  /** Cache-tag suffix; the full tag is `hns-${tenantSlug}-${tag}`. Omit → no tag. */
  tag?: string;
  revalidate: number;
  /** Append `teamIdFilter=<own teamId>` to the query. Defaults to true. */
  teamFilter?: boolean;
}

async function hnsQuery<T>(spec: HnsSpec): Promise<T | null> {
  const teamId = await getHnsTeamId();
  let endpoint = spec.path(teamId);
  if (spec.teamFilter !== false) {
    endpoint += (endpoint.includes("?") ? "&" : "?") + `teamIdFilter=${teamId}`;
  }
  const tags = spec.tag ? [`hns-${tenantSlug}-${spec.tag}`] : undefined;
  try {
    const raw = await resolveTransport()(endpoint, {
      revalidate: spec.revalidate,
      tags,
    });
    return raw as T;
  } catch (err) {
    console.error(`hnsFetch failed: ${endpoint}`, err);
    return null;
  }
}

/** Fetch a single HNS resource. Resilient: returns null on error. */
export function hnsResource<T>(spec: HnsSpec): Promise<T | null> {
  return hnsQuery<T>(spec);
}

/**
 * Fetch an HNS list and unwrap it. Resilient: returns [] on error/empty.
 * `paginated: true` unwraps the `{ result }` envelope; otherwise the body is
 * treated as the array itself.
 */
export async function hnsList<T>(
  spec: HnsSpec & { paginated?: boolean },
): Promise<T[]> {
  const raw = await hnsQuery<T[] | { result?: T[] }>(spec);
  if (!raw) return [];
  return spec.paginated ? ((raw as { result?: T[] }).result ?? []) : (raw as T[]);
}
