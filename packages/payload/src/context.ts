import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";

// Explicit Payload data-layer context. The frontend resolves its tenant + HTTP
// transport from env (see client.ts / tenant.ts); tests and server-to-server
// callers instead inject them and run the fetchers inside `runWithPayloadContext`.
// Mirrors the HNS context in `packages/hns/src/context.ts`.

export interface PayloadFetchOptions {
  authenticated?: boolean;
  next?: { revalidate?: number; tags?: string[] };
}

/** Turns a Payload REST path into parsed JSON. Prod = HTTP; tests = in-memory fake. */
export type PayloadTransport = (
  path: string,
  opts?: PayloadFetchOptions,
) => Promise<unknown>;

export interface PayloadContext {
  transport?: PayloadTransport;
  tenantSlug?: string;
}

const store = new AsyncLocalStorage<PayloadContext>();

export function runWithPayloadContext<T>(
  ctx: PayloadContext,
  fn: () => Promise<T>,
): Promise<T> {
  return store.run(ctx, fn);
}

export function getActivePayloadContext(): PayloadContext | undefined {
  return store.getStore();
}
