#!/usr/bin/env node
/**
 * Mjeri kontrast tekstualnih parova jednog Club appa u APCA (0.98G-4g).
 *
 *   node scripts/contrast.mjs apps/nk-garic-garesnica
 *
 * Tokeni se čitaju iz `src/app/globals.css` tog appa, pa mjerenje prati stvarne
 * vrijednosti umjesto prepisanih brojki. Parovi se deklariraju u PAIRS dolje —
 * dodaj redak kad uvedeš novu kombinaciju teksta i podloge.
 *
 * Prag (better-colors): |Lc| >= 75 za tekst tijela, >= 60 za ostali tekst.
 * Izlazi s kodom 1 ako ijedan par padne, pa se može staviti u CI.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const appDir = process.argv[2];

if (!appDir) {
  console.error("Usage: node scripts/contrast.mjs <app-dir>");
  process.exit(2);
}

/** Parovi koje mjerimo. `role: "body"` diže prag na 75. */
const PAIRS = [
  { name: "foreground / background", fg: "foreground", bg: "background", role: "body" },
  { name: "muted-foreground / background", fg: "muted-foreground", bg: "background" },
  { name: "club / background", fg: "club", bg: "background" },
  { name: "white / club", fg: "#fff", bg: "club", role: "body" },
  { name: "white/85 / club", fg: "#fff", alpha: 0.85, bg: "club" },
  { name: "white/75 / navy-deep", fg: "#fff", alpha: 0.75, bg: "navy-deep" },
  { name: "white/85 / navy-deep", fg: "#fff", alpha: 0.85, bg: "navy-deep", role: "body" },
];

const css = readFileSync(join(appDir, "src/app/globals.css"), "utf8");

/** Čita `--ime: oklch(L C H);` deklaracije iz :root bloka. */
function readTokens(source) {
  const root = source.slice(source.indexOf(":root"));
  const out = new Map();
  const re = /--([\w-]+):\s*oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/g;

  for (const [, name, l, c, h] of root.matchAll(re)) {
    if (!out.has(name)) out.set(name, [+l, +c, +h]);
  }

  return out;
}

function oklchToSrgb([L, C, H]) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];

  return linear.map((x) => {
    const v = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(x, 0), 1 / 2.4) - 0.055;

    return Math.min(1, Math.max(0, v));
  });
}

/** APCA 0.98G-4g. Predznak nosi smjer: negativno = svijetli tekst na tamnom. */
function apca(text, background) {
  const luminance = (c) => {
    const f = (x) => Math.pow(x, 2.4);

    return 0.2126729 * f(c[0]) + 0.7151522 * f(c[1]) + 0.072175 * f(c[2]);
  };

  const clampBlack = (y) => (y > 0.022 ? y : y + Math.pow(0.022 - y, 1.414));
  const yText = clampBlack(luminance(text));
  const yBg = clampBlack(luminance(background));
  let contrast;

  if (yBg > yText) {
    const s = (Math.pow(yBg, 0.56) - Math.pow(yText, 0.57)) * 1.14;
    contrast = s < 0.1 ? 0 : s - 0.027;
  } else {
    const s = (Math.pow(yBg, 0.65) - Math.pow(yText, 0.62)) * 1.14;
    contrast = s > -0.1 ? 0 : s + 0.027;
  }

  return contrast * 100;
}

const tokens = readTokens(css);

function resolve(ref) {
  if (ref === "#fff") return [1, 1, 1];
  const token = tokens.get(ref);

  if (!token) throw new Error(`Token --${ref} nije nađen u globals.css`);

  return oklchToSrgb(token);
}

const composite = (fg, alpha, bg) => fg.map((c, i) => alpha * c + (1 - alpha) * bg[i]);

let failed = 0;

console.log(`APCA — ${appDir}\n`);

for (const pair of PAIRS) {
  const bg = resolve(pair.bg);
  const fgBase = resolve(pair.fg);
  const fg = pair.alpha ? composite(fgBase, pair.alpha, bg) : fgBase;
  const lc = apca(fg, bg);
  const threshold = pair.role === "body" ? 75 : 60;
  const pass = Math.abs(lc) >= threshold;

  if (!pass) failed++;
  console.log(
    `${pair.name.padEnd(34)} Lc ${lc.toFixed(1).padStart(7)}  prag ${threshold}  ${pass ? "OK" : "PAO"}`,
  );
}

console.log(failed === 0 ? "\nSvi parovi prolaze." : `\n${failed} par(ova) ispod praga.`);

process.exit(failed === 0 ? 0 : 1);
