/**
 * Type guard za `[a, cond && b, c ?? null].filter(...)` obrazac.
 *
 * `filter(Boolean)` u TypeScriptu ne sužava tip, pa je takav niz dosad završavao
 * s `as X[]`. Ovaj guard to kaže tipu umjesto da se tvrdi.
 */
export function isPresent<T>(
  value: T | null | undefined | false | "" | 0,
): value is T {
  return Boolean(value);
}
