import { createHash, timingSafeEqual } from 'node:crypto'

/**
 * Provjerava `Authorization: Bearer <tajna>` bez vremenskog kanala: obje
 * strane se prvo hashiraju, pa `timingSafeEqual` uvijek uspoređuje jednako
 * duge buffere i ne otkriva ni duljinu tajne.
 */
export function matchesBearerSecret(
  header: string | null,
  secret: string | undefined,
): boolean {
  if (!secret || !header) return false

  const digest = (value: string) => createHash('sha256').update(value).digest()

  return timingSafeEqual(digest(header), digest(`Bearer ${secret}`))
}
