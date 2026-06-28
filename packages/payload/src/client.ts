import "server-only";

// Resolved lazily rather than thrown at module load: the CMS imports this
// shared data layer (transitively, via the HNS client) but never calls
// payloadFetch — it talks to Payload through the local API instead.
const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL ?? "";
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

interface PayloadFetchOptions {
  authenticated?: boolean;
  next?: { revalidate?: number; tags?: string[] };
}

export async function payloadFetch<T>(
  path: string,
  { authenticated = false, next }: PayloadFetchOptions = {},
): Promise<T> {
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

  return response.json() as Promise<T>;
}
