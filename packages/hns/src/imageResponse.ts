import "server-only";

import { fetchHnsImageBytes } from "./images";

export const runtime = "nodejs";

const CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const WHITE_BACKGROUND_MIN = 220;
const WHITE_BACKGROUND_DELTA = 35;

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

function isEdgeBackgroundPixel(data: Buffer, pixelIndex: number): boolean {
  const offset = pixelIndex * 4;
  const red = data[offset] ?? 0;
  const green = data[offset + 1] ?? 0;
  const blue = data[offset + 2] ?? 0;
  const alpha = data[offset + 3] ?? 0;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  return (
    alpha > 0 &&
    red > WHITE_BACKGROUND_MIN &&
    green > WHITE_BACKGROUND_MIN &&
    blue > WHITE_BACKGROUND_MIN &&
    max - min < WHITE_BACKGROUND_DELTA
  );
}

async function removeEdgeWhiteBackground(bytes: Buffer): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  const { data, info } = await sharp(bytes)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (channels !== 4) return bytes;

  const seen = new Uint8Array(width * height);
  const queue: number[] = [];

  const push = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const pixelIndex = y * width + x;
    if (seen[pixelIndex] || !isEdgeBackgroundPixel(data, pixelIndex)) return;
    seen[pixelIndex] = 1;
    queue.push(pixelIndex);
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  for (let index = 0; index < queue.length; index += 1) {
    const pixelIndex = queue[index]!;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  for (const pixelIndex of queue) {
    data[pixelIndex * 4 + 3] = 0;
  }

  return sharp(data, {
    raw: {
      width,
      height,
      channels,
    },
  })
    .png()
    .toBuffer();
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
