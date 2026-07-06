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

/**
 * Card-sized image URL (fallback na originalni URL) + alt. Prazan string kad
 * relacija nije populirana. Jedinstvena zamjena za per-fetcher `pickImageUrl`.
 */
export function mediaCardImage(value: MediaRef): { url: string; alt: string } {
  if (!value || typeof value !== "object") return { url: "", alt: "" };
  return { url: value.sizes?.card?.url ?? value.url ?? "", alt: value.alt ?? "" };
}
