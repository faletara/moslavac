/**
 * Adrese stranica popisa novosti. Prva je `/novosti`, a sljedeće
 * `/novosti/stranica/<n>`: broj je u putanji, ne u `?page=`, pa je svaka
 * stranica statična (ISR) umjesto rendera na svaki zahtjev.
 */
export function newsPageHref(page: number): string {
  return page === 1 ? "/novosti" : `/novosti/stranica/${page}`;
}

/**
 * Broj stranice iz segmenta `/novosti/stranica/<n>`. Prihvaća samo kanonski
 * oblik (`2`, ne `02` ni `2.5`), tako da ista stranica nema više adresa;
 * sve ostalo je `null`, a ruta tada vraća 404.
 */
export function parseNewsPageSegment(segment: string): number | null {
  return /^[1-9]\d*$/.test(segment) ? Number(segment) : null;
}
