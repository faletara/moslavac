import type { PayloadMedia } from "./types";

type MediaRef = PayloadMedia | number | string | null | undefined;

/** Vrati glavni URL medija ako je relacija populirana, inače null. */
export function mediaUrl(value: MediaRef): string | null {
  if (!value || typeof value !== "object") return null;
  return value.url ?? null;
}

/** Vrati populirani medij (s alt/sizes) ili null. */
export function mediaObject(value: MediaRef): PayloadMedia | null {
  if (!value || typeof value !== "object") return null;
  return value;
}
