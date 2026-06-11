const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** HNS image UUID iz URL parametra. */
export const isUuid = (value: string): boolean => UUID_RE.test(value);

/** Numerički ID iz URL parametra (HNS personId/teamId, Payload id). */
export const isNumericId = (value: string): boolean =>
  /^\d{1,12}$/.test(value);

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
