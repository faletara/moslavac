import "server-only";

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;

if (!PAYLOAD_API_URL) {
  throw new Error("PAYLOAD_API_URL env var is required");
}

interface PayloadFetchOptions {
  authenticated?: boolean;
  next?: { revalidate?: number; tags?: string[] };
}

export async function payloadFetch<T>(
  path: string,
  { authenticated = false, next }: PayloadFetchOptions = {},
): Promise<T> {
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
