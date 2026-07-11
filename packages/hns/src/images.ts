import "server-only";
import { hnsResource } from "./fetchResource";

interface HnsImagePayload {
  uuid: string;
  value: string | null;
}

const WHITE_BACKGROUND_MIN = 220;
const WHITE_BACKGROUND_DELTA = 35;

export async function fetchHnsImageBytes(uuid: string): Promise<Buffer | null> {
  const result = await hnsResource<HnsImagePayload>({
    path: () => `/api/live/images/${uuid}`,
    tag: `image-${uuid}`,
    revalidate: 86_400,
  });
  if (!result?.value) return null;
  return Buffer.from(result.value, "base64");
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

/**
 * Many HNS crests ship as a logo on an opaque white square. Flood-filling the
 * white in from the edges knocks that square out while leaving white *inside*
 * the crest (a shirt, a star) intact — a plain "all white pixels are
 * transparent" pass would eat those too.
 */
export async function removeEdgeWhiteBackground(bytes: Buffer): Promise<Buffer> {
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

  return sharp(data, { raw: { width, height, channels } })
    .png()
    .toBuffer();
}

/**
 * A crest ready to drop into an `ImageResponse`. `next/og` cannot fetch remote
 * images itself, so the bytes are inlined as a data URI — and the white plate
 * is knocked out first, since these posters sit on a dark background where an
 * opaque white square around every crest is glaring.
 *
 * Returns null rather than throwing: a poster missing one crest still reads,
 * a poster that failed to render does not.
 */
export async function fetchHnsCrestDataUri(
  uuid: string | null | undefined,
): Promise<string | null> {
  if (!uuid) return null;
  try {
    const bytes = await fetchHnsImageBytes(uuid);
    if (!bytes) return null;
    const transparent = await removeEdgeWhiteBackground(bytes);
    return `data:image/png;base64,${transparent.toString("base64")}`;
  } catch {
    return null;
  }
}
