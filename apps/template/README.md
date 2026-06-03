# Template — boilerplate za novi klub

Ova aplikacija je polazište za dodavanje novog kluba u monorepo. **Ne pokreće se u produkciji** — svrha joj je biti kopiran u `apps/<slug>/` i prilagođen.

Template je generička, degeneralizirana kopija referentne aplikacije `apps/moslavac` — sav klub-specifični identitet je uklonjen (tim se prepoznaje preko `tenant.hns.teamId`, ne preko imena), a sve klub-specifične vrijednosti dolaze iz Payload **Tenants** kolekcije.

## Brzi start (preporučeno)

Scaffold skripta odradi kopiranje, postavljanje `package.json` (ime + port) i generiranje `.env.local`:

```bash
bash scripts/new-club.sh <slug> [port]
# npr. bash scripts/new-club.sh nk-primjer 3004
```

Zatim slijedi korake koje skripta ispiše (Tenant u CMS-u, API key, assets, pokretanje).

## Ručni postupak (ako ne koristiš skriptu)

1. **Kopiraj template:** `cp -r apps/template apps/<slug>` (obriši `node_modules`, `.next`, `.turbo`, `.env.local` u kopiji).
2. **`apps/<slug>/package.json`:** `"name": "@moslavac/<slug>"` + zamijeni `-p 3003` svojim portom u `dev`/`dev:clean`/`start`.
3. **Kreiraj Tenant** (`http://localhost:3002/admin/collections/tenants/create`):
   - `slug` (mora odgovarati `PAYLOAD_TENANT_SLUG`), `displayName`, `branding.shortName`/`motto`/`founded`
   - `hns.apiKey`, `hns.teamId`, `hns.seniorCompetitionFilter`
   - `contact.*`, `social.*`, `payment.*`, `legal.*`
4. **`apps/<slug>/.env.local`:**
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:<port>   # u produkciji prava domena (za sitemap/robots/canonical)
   PAYLOAD_TENANT_SLUG=<slug>
   PAYLOAD_API_URL=http://localhost:3002/api
   PAYLOAD_API_KEY=<api-key-iz-payload-admina>
   HNS_API_BASE=https://api-hns.analyticom.de
   ```
5. **Zamijeni placeholder assete** u `apps/<slug>/public/`: `grb.png`, `naslovna.jpg`, `dres.png`, `fans.jpg`, `game.jpg`, `uplatnica.png` te ikone `apps/<slug>/src/app/{icon.png,apple-icon.png}`. (Template isporučuje neutralne placeholdere označene s "zamijeni" da app radi odmah.)
6. **Pokreni:** `pnpm install && pnpm --filter @moslavac/<slug> dev`
7. **Deploy na Vercel:** novi projekt, `Root Directory: apps/<slug>`, postavi env vars (uključ. `NEXT_PUBLIC_SITE_URL` na pravu domenu), spoji domenu.

## Što template uključuje

- **API sloj** (`src/lib/api/**`) — query-key factory pattern (vidi `.claude/rules/api-architecture.md`), `serverApi` za server komponente, `api` hookovi za klijent.
- **HNS integracija** (`src/lib/hns/**`) i **Payload integracija** (`src/lib/payload/**`, tenant resolution preko `PAYLOAD_TENANT_SLUG`).
- **SEO** — `app/sitemap.ts`, `app/robots.ts`, `lib/siteUrl.ts`, schema.org `SportsOrganization` + generičke `clubNameVariants` u `app/layout.tsx`, `next.config.ts` headeri.
- **Slugovi** — `lib/slug.ts` (human-readable URL-ovi `/<slug>-<id>`, `parseTrailingId`).
- **Hrvatske rute** — `novosti`, `utakmice`, `sezona`, `prva-momcad`, `statistika`, `sezonska-iskaznica`, `oprema`, `klub`.

## Dijeljeno s drugim klubovima

Sva klub-specifična konfiguracija (ime, HNS key, kontakti, payment, legal) **dolazi iz Payload Tenants kolekcije**, ne iz koda. Multi-tenant CMS je jedan, klubovi različiti. Vizualni izgled/boje su zajednički default — restyling je per-klub posao i nije dio templatea.
