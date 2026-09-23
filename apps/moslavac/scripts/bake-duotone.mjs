/**
 * Bakes the club-blue duotone treatment into the photo assets.
 *
 * The look used to be built in the browser: a `grayscale` filter on the <img>
 * plus a `bg-club mix-blend-color` layer on top. `color` is a non-separable
 * blend mode — Safari has to convert every pixel and back, and over a
 * full-viewport photo iOS falls off the GPU path entirely, so first paint takes
 * seconds. Baking it into the JPEG costs nothing at runtime.
 *
 * The maths below is the `color` blend mode from the compositing spec
 * (SetLum(source, Lum(backdrop))), so the output matches what the browser drew.
 *
 * Run: node scripts/bake-duotone.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const PUBLIC_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
);

/** --club from globals.css: oklch(0.46 0.19 262), converted to sRGB. */
const CLUB = [23, 66, 178];

/** Each output is the grayscale source blended `alpha` of the way to club blue. */
const TARGETS = [
  { src: "naslovna.jpg", out: "naslovna-club.jpg", alpha: 1 },
  { src: "game.jpg", out: "game-club.jpg", alpha: 0.6 },
];

const lum = ([r, g, b]) => 0.3 * r + 0.59 * g + 0.11 * b;

/** Shift a colour to the target luminosity, then clip back into gamut. */
function setLum(rgb, target) {
  const d = target - lum(rgb);
  const c = [rgb[0] + d, rgb[1] + d, rgb[2] + d];
  const l = lum(c);
  const min = Math.min(...c);
  const max = Math.max(...c);

  if (min < 0) {
    for (let i = 0; i < 3; i++) c[i] = l + ((c[i] - l) * l) / (l - min);
  }

  if (max > 255) {
    for (let i = 0; i < 3; i++)
      c[i] = l + ((c[i] - l) * (255 - l)) / (max - l);
  }

  return c;
}

/** 256-entry lookup: grayscale level → blended RGB. */
function buildLut(alpha) {
  const lut = new Uint8Array(256 * 3);

  for (let v = 0; v < 256; v++) {
    const blended = setLum(CLUB, v);

    for (let i = 0; i < 3; i++) {
      lut[v * 3 + i] = Math.round(v * (1 - alpha) + blended[i] * alpha);
    }
  }

  return lut;
}

for (const { src, out, alpha } of TARGETS) {
  const { data, info } = await sharp(path.join(PUBLIC_DIR, src))
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const lut = buildLut(alpha);
  const rgb = Buffer.allocUnsafe(info.width * info.height * 3);

  for (let p = 0; p < info.width * info.height; p++) {
    const v = data[p * info.channels] * 3;
    rgb[p * 3] = lut[v];
    rgb[p * 3 + 1] = lut[v + 1];
    rgb[p * 3 + 2] = lut[v + 2];
  }

  await sharp(rgb, {
    raw: { width: info.width, height: info.height, channels: 3 },
  })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(PUBLIC_DIR, out));
  console.log(`${src} → ${out}`);
}
