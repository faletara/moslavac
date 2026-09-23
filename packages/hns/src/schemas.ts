import { z } from "zod";

/**
 * Granica na kojoj HNS-ov odgovor prestaje biti neraščlanjeni JSON.
 *
 * Oblik stavke ne opisujemo ovdje: `packages/types/src/hns.openapi.ts` je
 * generiran iz HNS-ove OpenAPI specifikacije i ona je ugovor. Zod raščlanjuje
 * ono o čemu naš kod odlučuje — je li tijelo goli niz ili `{ result }`
 * ovojnica — pa nijedan pozivatelj to više ne pogađa `typeof` provjerom.
 */

/** Tijelo je sam niz stavki. */
export const bareList = z.array(z.unknown());

/** Tijelo je stranicirana ovojnica; zanima nas samo `result`. */
export const pagedList = z
  .object({ result: z.array(z.unknown()).nullish() })
  .transform((body) => body.result ?? []);

/** Niz stavki, bez obzira koju od dvije ovojnice HNS pošalje. */
export const anyList = z.union([bareList, pagedList]);
