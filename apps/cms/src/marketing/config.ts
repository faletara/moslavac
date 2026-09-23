/**
 * Sve što se mijenja bez diranja dizajna: ime, domena, cijena, pravni podaci.
 *
 * Stripe pri verifikaciji poslovanja traži da su na javnom URL-u vidljivi:
 * opis usluge, cijena, kontakt, uvjeti korištenja i pravila otkazivanja.
 * Zato su ti podaci ovdje na jednom mjestu — dopuni ih prije slanja Stripeu.
 */

export const BRAND = {
  name: 'Klubara',
  tagline: 'Web stranica za sportske klubove',
  domain: 'klubara.com',
  /** Bez završne kose crte. Na Vercelu prepiši preko NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://klubara.com',
} as const

/** TODO: dopuni e-poštu i telefon prije Stripe verifikacije. */
export const LEGAL = {
  entity: 'Caps Lock, obrt za računalne djelatnosti, vl. Marko Sandalj',
  address: 'Ulica Lavoslava Švarca 3, 10000 Zagreb',
  oib: '98158982142',
  /** Matični broj obrta (MB). */
  mb: '99203626',
  /** NKD 2007: 62.09 — ostale uslužne djelatnosti u vezi s IT-om i računalima. */
  activity: '62.09 Ostale uslužne djelatnosti u vezi s informacijskom tehnologijom i računalima',
  email: 'kontakt@klubara.com', // TODO
  phone: '+385 91 000 0000', // TODO
  /** Prikazuje se u uvjetima; paušalni obrt nije u sustavu PDV-a. */
  vatRegistered: false,
} as const

export const PRICING = {
  /**
   * Stripe ne traži da iznos bude javan — traži samo jasnu valutu, opis usluge,
   * kontakt i pravila otkazivanja. Postavi na `true` ako ipak želiš iznos na
   * stranici; sve sekcije se same prilagode.
   */
  showPrice: false,
  monthly: 50,
  yearly: 500,
  currency: 'EUR',
  trialDays: 30,
  includes: [
    'Dizajn i izrada stranice po vašem klubu, ne gotov predložak',
    'Automatski rezultati, tablica, raspored i strijelci',
    'Hosting, domena, SSL certifikat i sigurnosne kopije',
    'Pristup CMS-u za novosti, galeriju i dokumente',
    'Ažuriranja, popravci i podrška e-poštom',
  ],
} as const

/**
 * Klubovi koji već koriste platformu — referencije na naslovnici.
 * `image` je snimka naslovnice iz `public/klubovi/`.
 */
export const CLUBS = [
  {
    name: 'HNK Sloga Mravince',
    url: 'https://www.hnkslogamravince.com',
    image: '/klubovi/sloga-mravince.webp',
  },
  {
    name: 'SNK Moslavac',
    url: 'https://snk-moslavac.hr',
    image: '/klubovi/snk-moslavac.webp',
  },
] as const

/**
 * Snimke klupskih stranica na mobitelu — kartice u herou. Srednja je istaknuta.
 */
export const HERO_SHOTS = [
  { src: '/klubovi/moslavac-mobile.webp', alt: 'Naslovnica stranice SNK Moslavac na mobitelu' },
  { src: '/klubovi/sloga-mobile.webp', alt: 'Naslovnica stranice HNK Sloga Mravince na mobitelu' },
  {
    src: '/klubovi/sloga-raspored-mobile.webp',
    alt: 'Rezultati i raspored HNK Sloga Mravince na mobitelu',
  },
] as const

/**
 * Obrazac za upit. Preporuka je Tally (besplatno, neograničen broj odgovora)
 * ili Typeform (besplatni plan: 10 odgovora mjesečno).
 *
 * Kad napraviš obrazac, zalijepi ovdje adresu za ugradnju:
 *   Tally    → https://tally.so/embed/<id>?transparentBackground=1
 *   Typeform → https://form.typeform.com/to/<id>
 *
 * Dok je `embedUrl` prazan, stranica prikazuje kontakt e-poštom.
 */
/** Ugrađeni obrazac za demo; prazan `embedUrl` znači „prikaži e-poštu”. */
export interface DemoForm {
  embedUrl: string
  height: number
}

export const DEMO_FORM: DemoForm = {
  embedUrl: '',
  height: 620,
}

/** Sidro CTA bloka na naslovnici — tamo vode svi gumbi „zatraži demo". */
export const DEMO_ANCHOR = '/#demo'

/**
 * Odredište obrasca. Dok Tally adresa nije postavljena, upit ide e-poštom s
 * unaprijed pripremljenim predmetom i tijelom poruke.
 */
export function demoFormUrl(email?: string): string {
  if (DEMO_FORM.embedUrl) {
    const separator = DEMO_FORM.embedUrl.includes('?') ? '&' : '?'

    return email
      ? `${DEMO_FORM.embedUrl}${separator}email=${encodeURIComponent(email)}`
      : DEMO_FORM.embedUrl
  }

  const subject = encodeURIComponent('Demo stranica za klub')

  const body = encodeURIComponent(
    ['Naziv kluba:', 'Liga:', 'Kontakt osoba:', 'Telefon:', '', 'Poruka:'].join('\n'),
  )

  return `mailto:${LEGAL.email}?subject=${subject}&body=${body}`
}

export const NAV = [
  { label: 'Što dobivate', href: '/#znacajke' },
  { label: 'Kako radi', href: '/#kako-radi' },
  { label: 'Klubovi', href: '/#klubovi' },
  { label: 'Uključeno', href: '/#ukljuceno' },
  { label: 'Pitanja', href: '/#pitanja' },
] as const

/** Payload admin je ujedno prijava za klub — ista domena, ruta /admin. */
export const ADMIN_PATH = '/admin'

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: PRICING.currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
