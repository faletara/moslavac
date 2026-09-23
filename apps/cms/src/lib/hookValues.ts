import { z } from 'zod'

/**
 * Payloadovi field hookovi dobivaju `value`, `data` i `originalDoc` kao
 * netipizirane vrijednosti — hook JE granica na kojoj se ulaz raščlanjuje.
 * Ove sheme to rade jednom, umjesto `typeof` provjere u svakom hooku.
 *
 * Koriste se preko `safeParse`, pa `unknown` ostaje u zodovom potpisu i ne ulazi
 * u naš.
 */

/** Neprazan string točno kako je unesen. */
export const rawText = z.string().min(1)

/** Neprazan string bez rubnih razmaka. */
export const trimmedText = z
  .string()
  .transform((text) => text.trim())
  .pipe(z.string().min(1))
