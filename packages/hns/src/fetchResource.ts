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

/**
 * Runs the query and reports whether it succeeded, separately from the payload.
 * `ok: false` means the transport threw (network/HTTP error) — distinct from a
 * successful fetch that simply returned no data. Callers that must not present a
 * failure as "empty" (e.g. the fixtures page) branch on `ok`.
 */
async function runHnsQuery<T>(
  spec: HnsSpec,
): Promise<{ data: T | null; ok: boolean }> {
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
    return { data: raw as T, ok: true };
  } catch (err) {
    console.error(`hnsFetch failed: ${endpoint}`, err);
    return { data: null, ok: false };
  }
}

async function hnsQuery<T>(spec: HnsSpec): Promise<T | null> {
  return (await runHnsQuery<T>(spec)).data;
}

function unwrapList<T>(
  data: T[] | { result?: T[] } | null,
  paginated?: boolean,
): T[] {
  if (!data) return [];
  return paginated ? ((data as { result?: T[] }).result ?? []) : (data as T[]);
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
  return unwrapList<T>(raw, spec.paginated);
}

/**
 * Like `hnsList`, but also reports whether the fetch itself succeeded so callers
 * can tell "HNS failed" apart from "HNS returned nothing".
 */
export async function hnsListResult<T>(
  spec: HnsSpec & { paginated?: boolean },
): Promise<{ data: T[]; ok: boolean }> {
  const { data, ok } = await runHnsQuery<T[] | { result?: T[] }>(spec);
  return { data: unwrapList<T>(data, spec.paginated), ok };
}
