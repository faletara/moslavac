import { createHash, timingSafeEqual } from "node:crypto";

const sha256 = (value: string): Buffer => createHash("sha256").update(value).digest();

/**
 * Provjerava `Authorization: Bearer <tajna>` bez vremenskog kanala: obje
 * strane se prvo hashiraju, pa `timingSafeEqual` uvijek uspoređuje jednako
 * duge buffere i ne otkriva ni duljinu tajne. Usporedba se izvrši i kad tajna
 * nije postavljena, pa pozivatelj koji provjerava više tajni ne otkriva
 * vremenom koja je pala. Nepostavljena ili prazna tajna nikad ne prolazi.
 *
 * Dijele je CMS (cron) i klupska `/api/revalidate` ruta.
 */
export function matchesBearerSecret(
  header: string | null,
  secret: string | undefined,
): boolean {
  const matches = timingSafeEqual(
    sha256(header ?? ""),
    sha256(`Bearer ${secret ?? ""}`),
  );

  return Boolean(secret) && matches;
}
