import "server-only";
import { hnsResource } from "./fetchResource";

interface HnsImagePayload {
  uuid: string;
  value: string | null;
}

export async function fetchHnsImageBytes(uuid: string): Promise<Buffer | null> {
  const result = await hnsResource<HnsImagePayload>({
    path: () => `/api/live/images/${uuid}`,
    tag: `image-${uuid}`,
    revalidate: 86_400,
  });
  if (!result?.value) return null;
  return Buffer.from(result.value, "base64");
}
