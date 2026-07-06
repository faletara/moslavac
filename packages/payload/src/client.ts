import "server-only";
import { getActivePayloadContext } from "./context";
import type { PayloadFetchOptions, PayloadTransport } from "./context";

// Resolved lazily rather than thrown at module load: the CMS imports this
// shared data layer (transitively, via the HNS client) but never calls the
// HTTP transport — it talks to Payload through the local API instead.
const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL ?? "";
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

/** Default production transport: the real HTTP call to Payload's REST API. */
export const httpTransport: PayloadTransport = async (path, opts = {}) => {
  const { authenticated = false, next } = opts;

  if (!PAYLOAD_API_URL) {
    throw new Error("PAYLOAD_API_URL env var is required");
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (authenticated) {
    if (!PAYLOAD_API_KEY) {
      throw new Error(
        "PAYLOAD_API_KEY env var is required for authenticated calls",
      );
    }
    headers.Authorization = `users API-Key ${PAYLOAD_API_KEY}`;
  }

  const response = await fetch(`${PAYLOAD_API_URL}${path}`, {
    headers,
    next,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Payload fetch failed (${response.status} ${response.statusText}): ${path} — ${text}`,
    );
  }

  return response.json();
};

/** The transport in effect: an injected one (tests / CMS cron) or the HTTP default. */
export function resolveTransport(): PayloadTransport {
  return getActivePayloadContext()?.transport ?? httpTransport;
}

/** Typed convenience over the active transport; used by getTenant and any direct caller. */
export async function payloadFetch<T>(
  path: string,
  opts?: PayloadFetchOptions,
): Promise<T> {
  return resolveTransport()(path, opts) as Promise<T>;
}
