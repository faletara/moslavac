/**
 * Adrese stranica popisa novosti. Prva je `/novosti`, a sljedeće
 * `/novosti/stranica/<n>`: broj je u putanji, ne u `?page=`, pa je svaka
 * stranica statična (ISR) umjesto rendera na svaki zahtjev.
 */
export function newsPageHref(page: number): string {
  return page === 1 ? "/novosti" : `/novosti/stranica/${page}`;
}

