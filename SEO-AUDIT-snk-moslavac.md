# SEO Audit — SNK Moslavac

- **Stranica:** https://www.snk-moslavac.hr
- **Datum:** 25.6.2026.
- **Stack:** Next.js (App Router) na Vercelu, slike na Cloudflare R2
- **Tip:** Lokalni nogometni klub (Popovača), `SportsOrganization`
- **Alat:** claude-seo (8 specijalista, besplatni tier — bez Google/Moz API ključeva)

## Ukupni SEO Health Score: **~50 / 100**

| Kategorija | Težina | Ocjena | Doprinos |
|---|---|---|---|
| Technical SEO | 22% | 71 | 15.6 |
| Content Quality (E-E-A-T) | 23% | 32 | 7.4 |
| On-Page SEO | 20% | 45 | 9.0 |
| Schema / Structured Data | 10% | 45 | 4.5 |
| Performance (CWV) | 10% | 60 | 6.0 |
| AI Search (GEO) | 10% | 45 | 4.5 |
| Images | 5% | 55 | 2.8 |

> **Napomena o lažnoj uzbuni:** GEO agent je prijavio "noindex na svim stranicama" kao kritično. **Provjereno — nije točno.** Homepage i ključne stranice **nemaju** noindex; agent je pročitao Next.js 404 stranicu (`/llms.txt`) koja ima noindex. Indeksiranje radi normalno.

---

## TL;DR — Glavni zaključci

Tehnička osnova je solidna (Vercel edge, HTTPS, prerender, sitemap od 205 URL-ova, lang=hr, canonical). **Najveći problem je sadržaj, ne tehnika:** vijesti su ekstremno tanke (35–84 riječi), nedostaju meta podaci na člancima, telefon je placeholder, a slike nisu optimizirane. Klub je gotovo nevidljiv u lokalnom i AI pretraživanju jer fali GBP, geo koordinate i citabilan sadržaj.

---

## KRITIČNO (popraviti odmah)

| # | Nalaz | Dokaz | Fix |
|---|---|---|---|
| 1 | **Placeholder telefon** posvuda (schema + /klub + tel: link) | `"385 1 234 5678"`, `href="tel:385 1 234 5678"` (bez `+`) | Unijeti pravi broj u CMS; format `+385...`; tel-link `tel:+385...` |
| 2 | **Vijesti ekstremno tanke** — 35–84 riječi po članku | Najveći članak 84 rič.; optimum za citaciju 150+ | Match report template: rezultat, strijelci, ključni momenti, citat, kontekst tablice → min. 300 riječi |
| 3 | **Članci vijesti nemaju `<title>` ni meta description** | `generateMetadata` za `/novosti/[slug]` nije implementiran — svi dijele isti title | Implementirati `generateMetadata` (title, description, og:title, og:image, `NewsArticle` schema) |
| 4 | **`/kontakt` vraća 404** | HTTP 404 | Dodati `/kontakt` rutu ili redirect na `/klub` (važno za GBP NAP konzistentnost) |

---

## VISOKO (unutar tjedna)

| # | Nalaz | Dokaz | Fix |
|---|---|---|---|
| 5 | **Nema `og:image`** (homepage + sve stranice) | `og_image: null` | Default OG slika (grb/stadion), 1200×630, u Next.js `metadata` |
| 6 | **OG title uvijek "SNK Moslavac"** na svim stranicama | identičan `og:title` | Dinamičan OG title po stranici |
| 7 | **Slike neoptimizirane** — custom image loader zaobilazi Next.js, servira raw JPEG/PNG | srcSet 640/1080/1920w svi pokazuju na isti `.jpg`; `grb.png` = 694 KB | Vratiti Next.js loader ili pre-generirati WebP/AVIF na R2; logo u WebP (<20 KB) |
| 8 | **CLS = 0.126** (iznad praga 0.1) | hero slike bez `width`/`height` | `<Image>` s dimenzijama / `fill` + `sizes` na `naslovna.jpg`, `game.jpg`, `fans.jpg` |
| 9 | **LCP animacija** — hero slika ide `opacity 0→1` (framer-motion), blokira paint | `Hero.tsx` ~75 | Maknuti opacity s LCP wrappera; animirati overlay/sadržaj, ne sliku; `priority` na `<Image>` |
| 10 | **Nema geo koordinata u schemi** | `geo` property odsutan | `"geo": {"@type":"GeoCoordinates","latitude":45.57,"longitude":16.62}` (5 decimala) |
| 11 | **Nema Google Maps embed / GBP signala** | `mapEmbedUrl: null`, nema place_id ni review widgeta | Verificirati/kreirati GBP; embed Maps iframe na /klub; GBP URL u `sameAs` |
| 12 | **Nedostaju schema tipovi:** `SportsEvent` (utakmice), `Person` (igrači), `SportsTeam`, `WebSite`+`SearchAction` | samo 1 JSON-LD blok (homepage) | Vidi snippete u prilogu |
| 13 | **Nema author bylinea** ni u schema ni vizualno | svi članci anonimni | `author` u `NewsArticle` + vidljivi potpis ("Urednik kluba") |
| 14 | **`/novosti` nije statički prerenderiran** | `cache-control: private, no-cache, no-store` | Provjeriti zašto je dynamic; `revalidate` ili `force-static` ako nema razloga |
| 15 | **Stranice igrača `/statistika/[playerId]/[competitionId]` nisu u sitemapu** | route postoji, `sitemap.ts` ih ne gradi | Dodati blok u `sitemap.ts` |

---

## SREDNJE (unutar mjesec dana)

| # | Nalaz | Fix |
|---|---|---|
| 16 | `postalCode` (44317) je unutar `streetAddress` | Razdvojiti u zasebno `postalCode` polje |
| 17 | Meta description je slogan "Ovdje nitko nije normalan" | Informativan opis: "SNK Moslavac, nogometni klub iz Popovače, osnovan 1933." |
| 18 | `<title>` prekratak ("SNK Moslavac") | "SNK Moslavac Popovača – Raspored, Rezultati, Vijesti" |
| 19 | "NK Moslavac" umjesto "SNK" u /prva-momcad meta | Ispraviti naziv |
| 20 | Tap targeti premali (nav 16px, social ikone 18px, hamburger 40px) | min. 44–48px (padding `py-3`, social wrapper `w-12 h-12`) |
| 21 | Adresa stadiona prazna na /klub ("...,  Popovača") | Popuniti ulicu u CMS-u |
| 22 | Igrači bez biografija (samo pozicija) | Dob, pozicija, prethodni klub — 2-3 rečenice |
| 23 | Samo 3 vijesti u sitemapu | Provjeriti `fetchNewsPaginated` (bug ili stvarno 3 objave?) |
| 24 | `twitter:card` = `summary` | `summary_large_image` |
| 25 | Nema CSP header; HSTS bez `includeSubDomains` | Dodati CSP i `; includeSubDomains; preload` |
| 26 | JS bundle 664 KB (12 chunkova) | `@next/bundle-analyzer`; tree-shake framer-motion / lucide-react |
| 27 | INP rizik: `onPointerMove` bez throttlinga (Hero) | rAF throttle |
| 28 | Nema `BreadcrumbList` na podstranicama (ima na člancima) | Globalni breadcrumb |
| 29 | `/llms.txt` ne postoji (404 HTML) | `public/llms.txt` s opisom kluba i ključnim linkovima |

---

## NISKO / GEO bonus

- Wikipedia/Wikidata članak (klub od 1933.) — najjači AI brand signal
- `sameAs` proširiti: GBP, Wikidata, Transfermarkt, Sofascore, HNS
- HTML cache `max-age=0` → `s-maxage=300, stale-while-revalidate=86400`
- Eksplicitni `Allow` za GPTBot/ClaudeBot/PerplexityBot (sad pod wildcardom — radi, ali konzervativno bolje)
- `@id` u JSON-LD (`#organization`)
- `changefreq`/`priority` u sitemapu — Google ih ignorira (može se maknuti)
- Stranica o povijesti kluba (narativ, uspjesi)

---

## Prioritetni redoslijed (dependency-aware)

1. **Pravi telefon + /kontakt** → blokira NAP konzistentnost i GBP
2. **`generateMetadata` za članke** (title, desc, og, NewsArticle schema) → otključava 5, 6, 13
3. **Slike: WebP + dimenzije + makni LCP animaciju** → otključava 7, 8, 9 (CLS+LCP)
4. **Schema paket** (SportsEvent, Person, SportsTeam, WebSite) → 12
5. **GBP + geo + Maps embed** → 10, 11, lokalna vidljivost
6. **Sadržajni rad:** match reportovi 300+ riječi, biografije igrača, povijest → dugoročno najveći ROI

---

## Prilog — JSON-LD snippeti

### SportsOrganization (ispravak telefona + adrese)
```json
{
  "@context": "https://schema.org",
  "@type": ["SportsOrganization", "SportsClub"],
  "@id": "https://www.snk-moslavac.hr/#organization",
  "name": "SNK Moslavac",
  "alternateName": ["Moslavac"],
  "sport": "Football",
  "url": "https://www.snk-moslavac.hr",
  "logo": "https://pub-35bc4cccae554273b4931967f1b01ba9.r2.dev/grb.png",
  "image": "https://pub-35bc4cccae554273b4931967f1b01ba9.r2.dev/grb.png",
  "foundingDate": "1933",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Trg Grofa Erdődyja b. b.",
    "addressLocality": "Popovača",
    "postalCode": "44317",
    "addressRegion": "Sisačko-moslavačka županija",
    "addressCountry": "HR"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 45.57, "longitude": 16.62 },
  "email": "snkmoslavac@gmail.com",
  "telephone": "+385XXXXXXXXX",
  "sameAs": [
    "https://www.facebook.com/SNKMoslavacPopovaca",
    "https://www.youtube.com/@SNKMoslavacPopovaca"
  ]
}
```
> Geo koordinate provjeriti za stvarni stadion.

### SportsEvent (na svaku `/utakmice/[matchId]`)
```json
{
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "SNK Moslavac vs NK Metalac",
  "startDate": "2026-06-06T18:00:00+02:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Stadion SNK Moslavac",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Trg Grofa Erdődyja b. b.",
      "addressLocality": "Popovača",
      "postalCode": "44317",
      "addressCountry": "HR"
    }
  },
  "homeTeam": { "@type": "SportsTeam", "name": "SNK Moslavac", "url": "https://www.snk-moslavac.hr" },
  "awayTeam": { "@type": "SportsTeam", "name": "NK Metalac" }
}
```
> Za odigrane: `eventStatus: "EventCompleted"` + rezultat.

### Person / Athlete (na svaku stranicu igrača)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ime Prezime",
  "url": "https://www.snk-moslavac.hr/...",
  "jobTitle": "Nogometaš",
  "affiliation": {
    "@type": "SportsTeam",
    "name": "SNK Moslavac",
    "sport": "Football",
    "memberOf": { "@type": "SportsOrganization", "name": "SNK Moslavac" }
  },
  "nationality": { "@type": "Country", "name": "Croatia" }
}
```

### WebSite + SearchAction (homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SNK Moslavac",
  "url": "https://www.snk-moslavac.hr",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://www.snk-moslavac.hr/pretraga?q={search_term_string}" },
    "query-input": "required name=search_term_string"
  }
}
```
> Dodati samo ako postoji funkcionalna pretraga.

---

## Ograničenja audita

- Bez Google API ključeva → nema CrUX field podataka (CWV su lab/heuristika), nema GSC indeksacije ni GA4 prometa.
- Bez DataForSEO/Moz → nema backlink profila, live SERP pozicija, niti potvrde postoji li verificiran GBP.
- Screenshotovi: `/Users/adrianofaletar/screenshots_moslavac/`
