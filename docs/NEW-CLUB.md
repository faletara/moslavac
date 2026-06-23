# Dodavanje novog kluba

Vodič za pokretanje nove klupske stranice na platformi. Novi klub = tanki
`apps/<slug>` (rute + komponente + skin) nad dijeljenim slojem u `packages/`
(podaci, UI, tipovi). `apps/template` je potpun, generički "golden-path" klub —
sve standardne stranice rade odmah; treba samo postaviti podatke i boje.

> Sažetak: scaffold → Tenant u CMS-u → env → install/dev → re-skin → deploy.

---

## 1. Scaffold

```bash
bash scripts/new-club.sh <slug> [port]
# npr. bash scripts/new-club.sh nk-primjer 3005
```

Radi: kopira `apps/template` → `apps/<slug>`, postavi `package.json`
(`name` = `@moslavac/<slug>`, dev/start port), generira `apps/<slug>/.env.local`.
`<slug>` = mala slova, brojevi, crtice (mora odgovarati `Tenants.slug` u CMS-u).

## 2. Tenant zapis u CMS-u

U Payload adminu (`http://localhost:3002/admin` → **Tenants → Create**):

| Polje | Obavezno | Opis |
| --- | --- | --- |
| `slug` | ✅ | = `PAYLOAD_TENANT_SLUG` (npr. `nk-primjer`) |
| `displayName` | ✅ | Puni naziv (npr. `NK Primjer`) |
| `active` | — | Uključeno (default) |
| `features` | — | Klupske rubrike: `pages`, `documents`, `board`, `school`, `gallery` (uključi samo što klub koristi — gate-a vidljivost tih kolekcija u adminu) |
| `hns.apiKey` | ✅ | HNS API ključ |
| `hns.teamId` | ✅ | HNS ID kluba (highlight vlastitog tima, roster, rezultati) |
| `hns.seniorCompetitionFilter` | — | Filter naziva seniorskog natjecanja |
| `branding.shortName` / `motto` / `founded` / `logo` | — | Kratko ime, moto, godina, grb (logo se koristi za favicon/OG/header) |
| `contact.email` / `phone` / `address` / `city` / `region` / `mapEmbedUrl` | — | Kontakt; `city`+`region` idu u schema.org (lokalni SEO) i footer |
| `social.facebook` / `youtube` / `webshop` | — | Linkovi |
| `payment.iban` / `recipient` / `seasonTicketPrice` | — | Plaćanja |
| `legal.oib` / `registryNumber` / `registryAuthority` | — | Pravni podaci |

> `features` i shema kolekcija su dijeljeni CMS — promjene polja traže postgres
> migraciju (`pnpm --filter @moslavac/cms payload migrate:create`) i
> `pnpm generate:types`.

## 3. Env (`apps/<slug>/.env.local`)

`new-club.sh` generira većinu; ručno upiši `PAYLOAD_API_KEY`.

| Var | Opis |
| --- | --- |
| `PAYLOAD_TENANT_SLUG` | = tenant `slug` |
| `PAYLOAD_API_URL` | REST CMS-a (npr. `http://localhost:3002/api`) |
| `PAYLOAD_API_KEY` | API-key korisnik iz Payloada (za autenticirane pozive) |
| `HNS_API_BASE` | HNS endpoint (default `https://api-hns.analyticom.de`) |
| `NEXT_PUBLIC_SITE_URL` | Bazni URL (prod domena; lokalno `http://localhost:<port>`) |

## 4. Install + dev

```bash
pnpm install
pnpm --filter @moslavac/<slug> dev
```

Stranica se ne renderira bez Tenant zapisa (`getTenant()` ga traži po slugu).

## 5. (Opcionalno) seed sadržaja

```bash
SEED_TENANT_SLUG=<slug> pnpm --filter @moslavac/cms payload run scripts/seed-news.ts
SEED_TENANT_SLUG=<slug> pnpm --filter @moslavac/cms payload run scripts/seed-equipment.ts
```

## 6. Re-skin (vizualni identitet)

Sve klupske ručice su na malo mjesta:

- **Boje / oblik** — `apps/<slug>/src/app/globals.css`, blok `:root` (i `.dark`):
  - brand: `--club`, `--club-red`, `--navy`, `--navy-deep`, `--chalk`
  - semantika: `--primary` (+ `--primary-foreground`), `--ring`, `--accent`, `--secondary`, `--muted`, `--background`, `--foreground`
  - oblik: `--radius` (0 = oštri kutovi)
  - dobne kategorije (chipovi): `--cat-seniors … --cat-prstici` (tamno → svijetlo)
- **Font** — default Geist (tijelo + naslovi). Za zaseban display font: importaj
  drugi `next/font` u `app/layout.tsx`, izloži `--font-<x>` na `<html>`, pa u
  `globals.css` `@theme inline` postavi `--font-display: var(--font-<x>)`.
- **public/** — zamijeni placeholdere stvarnim materijalima kluba (grb se inače
  vuče iz CMS `branding.logo`; favicon/OG se generiraju iz tenanta —
  `app/icon.tsx`, `app/opengraph-image.tsx` — ili ih nadjačaj stvarnim datotekama).

Stranice/komponente su generičke i tenant-driven — sadržaj (vijesti, oprema,
roster, utakmice) dolazi iz CMS-a i HNS-a po tenantu, bez diranja koda.

## 7. Deploy (Vercel)

- Novi projekt, **Root Directory** = `apps/<slug>`.
- Env vars: `PAYLOAD_TENANT_SLUG`, `PAYLOAD_API_URL`, `PAYLOAD_API_KEY`,
  `HNS_API_BASE`, `NEXT_PUBLIC_SITE_URL` (= prava domena).
- Ako su mijenjana CMS polja: pokreni postgres migraciju prije/uz deploy CMS-a.

---

### Arhitektura (podsjetnik)

- Dijeljeni sloj: `packages/{types,payload,hns,api,ui}` (vidi `packages/README.md`).
- Dohvat podataka: server komponente zovu `@/lib/payload/*` i `@/lib/hns/*`
  izravno; klijent koristi `api.*` hookove → route handler → isti lib
  (vidi `apps/<slug>/.claude/rules/api-architecture.md`).
- Domenski pojmovi: `CONTEXT.md` (Tenant, ClubFeature, …).
