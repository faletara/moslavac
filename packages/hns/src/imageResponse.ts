import "server-only";

import { fetchHnsImageBytes, removeEdgeWhiteBackground } from "./images";

export const runtime = "nodejs";

const CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function detectContentType(bytes: Buffer): string {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    return "image/jpeg";
  }
  return "application/octet-stream";
}

export async function createHnsImageResponse(
  req: Request,
  uuid: string,
): Promise<Response> {
  if (!UUID_RE.test(uuid)) {
    return new Response("Invalid image id", { status: 400 });
  }

  const bytes = await fetchHnsImageBytes(uuid);
  if (!bytes) {
    return new Response("Image not found", { status: 404 });
  }

  const transparent = new URL(req.url).searchParams.get("transparent") === "1";

  if (transparent) {
    const transparentBytes = await removeEdgeWhiteBackground(bytes);
    return new Response(new Uint8Array(transparentBytes), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": CACHE_CONTROL,
      },
    });
  }

  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": detectContentType(bytes),
      "Cache-Control": CACHE_CONTROL,
    },
  });
}
