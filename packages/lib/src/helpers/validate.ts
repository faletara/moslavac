const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** HNS image UUID iz URL parametra. */
export const isUuid = (value: string): boolean => UUID_RE.test(value);

/** Numerički ID iz URL parametra (HNS personId/teamId, Payload id). */
export const isNumericId = (value: string): boolean =>
  /^\d{1,12}$/.test(value);

/**
 * Pozitivan cijeli broj iz segmenta putanje (id, broj stranice). Prihvaća samo
 * kanonski decimalni zapis (`12`, ne `012`, `1e1`, `+12` ni `12.0`), pa ista
 * stranica nema više adresa i iz vrijednosti se uvijek vraća isti segment.
 * Sve ostalo, i broj iznad `Number.MAX_SAFE_INTEGER`, je `null`.
 */
export function parsePositiveInt(value: string | undefined): number | null {
  if (value === undefined || !/^[1-9]\d*$/.test(value)) return null;

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) ? parsed : null;
}

/** Parsira query parametar u cijeli broj unutar [min, max]. */
export function clampInt(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = Number(value ?? fallback);

  if (!Number.isFinite(parsed)) return fallback;

  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}
