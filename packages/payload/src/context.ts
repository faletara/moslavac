import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import type { JsonValue } from "@/types/json";

// Explicit Payload data-layer context. The frontend resolves its tenant + HTTP
// transport from env (see client.ts / tenant.ts); tests and server-to-server
// callers instead inject them and run the fetchers inside `runWithPayloadContext`.
// Mirrors the HNS context in `packages/hns/src/context.ts`.

/**
 * Rok keša za sadržaj iz CMS-a: 1 dan. Svježinu ne drži ovaj rok nego CMS
 * webhook (`/api/revalidate`), koji pri svakom spremanju poništava tagove i
 * cijeli layout. Kratak rok bi samo tjerao stranice na render svake minute.
 */
export const CMS_CONTENT_TTL = 86_400;

export interface PayloadFetchOptions {
  authenticated?: boolean;
  next?: { revalidate?: number; tags?: string[] };
}

/** Turns a Payload REST path into parsed JSON. Prod = HTTP; tests = in-memory fake. */
export type PayloadTransport = (
  path: string,
  opts?: PayloadFetchOptions,
) => Promise<JsonValue>;

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
