import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";

export interface HnsFetchOptions {
  revalidate?: number;
  tags?: string[];
}

/** Turns an HNS endpoint into parsed JSON. Prod = HTTP; tests = in-memory fake. */
export type HnsTransport = (
  endpoint: string,
  opts?: HnsFetchOptions,
) => Promise<unknown>;

// Explicit HNS tenant context. The frontend resolves tenant config from the
// `PAYLOAD_TENANT_SLUG` env var via getTenant(); server-to-server callers (the
// CMS cron, which iterates many tenants in one process) instead provide the
// config explicitly and run the HNS fetchers inside `runWithHnsContext`.
export interface HnsContext {
  // The transport seam that varies: an injected fake in tests, else HTTP.
  transport?: HnsTransport;
  apiKey: string;
  teamId: string;
  seniorCompetitionFilter?: string | null;
  // Optional undici dispatcher. The CMS server resolves the HNS host via a
  // custom DNS dispatcher; server-to-server callers pass it through here.
  dispatcher?: unknown;
}

const store = new AsyncLocalStorage<HnsContext>();

export function runWithHnsContext<T>(
  ctx: HnsContext,
  fn: () => Promise<T>,
): Promise<T> {
  return store.run(ctx, fn);
}

export function getActiveHnsContext(): HnsContext | undefined {
  return store.getStore();
}
