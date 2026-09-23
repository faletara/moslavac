import { NextResponse, type NextRequest } from "next/server";
import { suspensionPage } from "./suspensionPage";

/**
 * Prekidač koji cijelu stranicu zamijeni jednom obavijesti. Namijenjen je
 * zastoju u plaćanju: dok stoji `true`, svaki posjetitelj dobiva obavijest
 * umjesto sadržaja.
 *
 * Gasiš tako da ovdje upišeš `true`, commitaš i pushaš — Vercel sagradi novu
 * verziju za dvije do tri minute. Pališ natrag na `false` istim putem.
 */
const SUSPENDED = true;

/**
 * Tajni niz kojim vlasnik i dalje vidi stranicu dok je za druge zaustavljena:
 * otvori `/?pristup=<token>`, dobije kolačić i dalje gleda normalno.
 *
 * Token nije zaporka za podatke — čuva samo ovu obavijest, pa smije stajati u
 * kodu. Promijeni ga ako procuri.
 */
const BYPASS_TOKEN = "7f905df87bbd36ea5e7dedb50b70ae96";

const BYPASS_COOKIE = "moslavac-pristup";

const BYPASS_QUERY = "pristup";

const RETRY_AFTER_SECONDS = 86_400;

/**
 * Odgovor nosi 503, a ne 404 ni 410. Tražilicama 503 znači „vrati se poslije”,
 * pa stranica ostaje u indeksu; 404 bi je s vremenom izbacio i oporavak bi
 * trajao tjednima. `Retry-After` govori za koliko neka se vrate.
 */
function suspensionResponse(): NextResponse {
  return new NextResponse(suspensionPage(), {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": String(RETRY_AFTER_SECONDS),
      // Bez ovoga bi CDN zapamtio obavijest i posluživao je i nakon paljenja.
      "cache-control": "no-store, must-revalidate",
    },
  });
}

/**
 * Sama odluka, s prekidačem kao ulazom. Prekidač je konstanta pa bi ga test
 * inače morao prepisivati; ovako se ista logika provjeri u oba stanja.
 */
export function applySuspension(
  request: NextRequest,
  suspended: boolean,
): NextResponse | null {
  if (!suspended) return null;

  const offered = request.nextUrl.searchParams.get(BYPASS_QUERY);

  // `?pristup=<token>` postavlja kolačić i miče token iz adrese, pa se ne
  // proširi dalje kroz povijest preglednika ni kroz dijeljene poveznice.
  if (offered === BYPASS_TOKEN) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete(BYPASS_QUERY);
    const response = NextResponse.redirect(clean);
    response.cookies.set(BYPASS_COOKIE, BYPASS_TOKEN, {
      httpOnly: true,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  }

  if (request.cookies.get(BYPASS_COOKIE)?.value === BYPASS_TOKEN) return null;

  return suspensionResponse();
}

/**
 * Vrati odgovor kad je stranica zaustavljena, inače `null` — pozivatelj tada
 * nastavlja svojim redoslijedom.
 */
export function suspensionGate(request: NextRequest): NextResponse | null {
  return applySuspension(request, SUSPENDED);
}
