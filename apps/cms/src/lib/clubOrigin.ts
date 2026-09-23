/**
 * `Tenants.siteUrl` kao https origin klupske stranice.
 *
 * CMS na tu adresu sa servera šalje revalidacijski POST, pa ona ne smije voditi
 * nikamo drugamo: ni na loopback ili interni host, ni na drugu putanju (`#` ili
 * `?` bi odrezali dodani `/api/revalidate`). Isto pravilo vrijedi pri spremanju
 * (validacija polja) i pri slanju (`revalidateFrontend`), gdje se uz to traži i
 * host s popisa dozvoljenih.
 */

export type ClubOrigin = { ok: true; url: URL } | { ok: false; reason: string }

const isIpLiteral = (hostname: string): boolean =>
  hostname.startsWith('[') || /^[\d.]+$/.test(hostname)

// Završna točka (`localhost.`) je isti host kao bez nje, a klupska domena je nema.
const isLocalName = (hostname: string): boolean =>
  hostname === 'localhost' ||
  hostname.endsWith('.localhost') ||
  hostname.endsWith('.') ||
  !hostname.includes('.')

export function parseClubOrigin(value: string): ClubOrigin {
  let url: URL

  try {
    url = new URL(value.trim())
  } catch {
    return { ok: false, reason: 'Neispravna adresa.' }
  }

  if (url.protocol !== 'https:') {
    return { ok: false, reason: 'Adresa mora počinjati s https://.' }
  }

  if (url.username || url.password) {
    return { ok: false, reason: 'Adresa ne smije sadržavati korisničko ime ni lozinku.' }
  }

  if (url.port) return { ok: false, reason: 'Adresa ne smije imati port.' }

  // Prazan `?` ili `#` URL parser ne pamti, pa se gleda i sirovi unos.
  if (url.pathname !== '/' || url.search || url.hash || /[?#]/.test(value)) {
    return {
      ok: false,
      reason: 'Upiši samo adresu stranice (npr. https://www.klub.hr), bez putanje, upita ili #.',
    }
  }

  if (isIpLiteral(url.hostname) || isLocalName(url.hostname)) {
    return { ok: false, reason: 'Adresa mora biti javna domena kluba.' }
  }

  return { ok: true, url }
}
