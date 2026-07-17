# Template — boilerplate za novi klub

Ova aplikacija je polazište za dodavanje novog kluba u monorepo. **Ne pokreće se u produkciji** — svrha joj je biti kopiran u `apps/<slug>/` i prilagođen.

Template je **prazan Next.js app-shell** + kompletan data-sloj. Frontend (stranice, UI komponente, vizualni identitet) je namjerno prazan — gradiš ga od nule za svaki klub. Ostaje sve bitno za dohvat podataka: API rute, HNS i Payload integracija, te `api`/`serverApi` hookovi. Sve klub-specifične vrijednosti (ime, HNS key, kontakti…) dolaze iz Payload **Tenants** kolekcije. Referentnu, gotovu implementaciju frontenda imaš u `apps/moslavac`.

## Brzi start (preporučeno)

Scaffold skripta odradi kopiranje, postavljanje `package.json` (ime + port) i generiranje `.env.local`:

```bash
bash scripts/new-club.sh <slug> [port]
# npr. bash scripts/new-club.sh nk-primjer 43110
```

Zatim slijedi korake koje skripta ispiše (Tenant u CMS-u, API key, pokretanje).

## Ručni postupak (ako ne koristiš skriptu)

1. **Kopiraj template:** `cp -r apps/template apps/<slug>` (obriši `node_modules`, `.next`, `.turbo`, `.env.local` u kopiji).
2. **`apps/<slug>/package.json`:** `"name": "@moslavac/<slug>"` + zamijeni `-p 43103` svojim portom u `dev`/`dev:clean`/`start`.
3. **Kreiraj Tenant** (`http://localhost:43102/admin/collections/tenants/create`):
   - `slug` (mora odgovarati `PAYLOAD_TENANT_SLUG`), `displayName`, `branding.shortName`/`motto`/`founded`
   - `hns.apiKey`, `hns.teamId`, `hns.seniorCompetitionFilter`
   - `contact.*`, `social.*`, `payment.*`, `legal.*`
4. **`apps/<slug>/.env.local`:**
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:<port>   # u produkciji prava domena (za sitemap/robots/canonical)
   PAYLOAD_TENANT_SLUG=<slug>
   PAYLOAD_API_URL=http://localhost:43102/api
   PAYLOAD_API_KEY=<api-key-iz-payload-admina>
   HNS_API_BASE=https://api-hns.analyticom.de
   ```
5. **Pokreni:** `pnpm install && pnpm --filter @moslavac/<slug> dev`
6. **Gradi frontend** u `apps/<slug>/src/app/` (prazan je): stranice, komponente, assete u `public/`, ikone. Podatke dohvaćaš preko `api.*` (klijent) / `serverApi.*` (server).
7. **Deploy na Vercel:** novi projekt, `Root Directory: apps/<slug>`, postavi env vars (uključ. `NEXT_PUBLIC_SITE_URL` na pravu domenu), spoji domenu.

## Što template uključuje

- **API sloj** (`src/lib/api/**`) — query-key factory pattern (vidi `.claude/rules/api-architecture.md`), `serverApi` za server komponente, `api` hookovi za klijent.
- **HNS integracija** (`src/lib/hns/**`) i **Payload integracija** (`src/lib/payload/**`, tenant resolution preko `PAYLOAD_TENANT_SLUG`).
- **SEO baseline** — `app/sitemap.ts` (samo naslovnica — proširi kako dodaješ rute), `app/robots.ts`, `lib/siteUrl.ts`, `next.config.ts` headeri. Per-page metadata i schema.org gradiš sam.
- **Slugovi** — `lib/slug.ts` (human-readable URL-ovi `/<slug>-<id>`, `parseTrailingId`).
- **Minimalni app-shell** — `app/layout.tsx` (`QueryClientProvider` da hookovi rade) + prazna `app/page.tsx`. `TenantProvider` (`useTenant`/`useOurTeamId`/`useTenantLogo`) stoji spreman u `components/providers/` — uključi ga kad zatreba.

## Što NIJE u templateu (gradiš sam)

Stranice/rute, UI komponente, vizualni identitet, assete (`public/`), favicone. Gotov primjer svega toga je `apps/moslavac`.

## Dijeljeno s drugim klubovima

Sva klub-specifična konfiguracija (ime, HNS key, kontakti, payment, legal) **dolazi iz Payload Tenants kolekcije**, ne iz koda. Multi-tenant CMS je jedan, klubovi različiti.
