# Template — boilerplate za novi klub

Ova aplikacija je polazište za dodavanje novog kluba u monorepo. **Ne pokreće se u produkciji** — svrha joj je biti kopiran u `apps/<slug>/` i prilagođen.

## Kako kreirati novi klub

1. **Kopiraj template:**
   ```bash
   cp -r apps/template apps/<slug>
   ```

2. **Ažuriraj `apps/<slug>/package.json`:**
   - `"name": "@moslavac/<slug>"`
   - port u `dev`/`start` skriptama (svaki klub na svom dev portu, npr. 3004, 3005, ...)

3. **Kreiraj Tenant zapis u Payload CMS-u** (`http://localhost:3002/admin/collections/tenants/create`):
   - `slug` — mora odgovarati `PAYLOAD_TENANT_SLUG` env varu
   - `displayName` — puno ime kluba (npr. "NK Primjer")
   - `hns.apiKey`, `hns.teamId`, `hns.seniorCompetitionFilter`
   - `branding.motto`, kontakt, payment podaci

4. **Postavi `apps/<slug>/.env.local`:**
   ```env
   PAYLOAD_TENANT_SLUG=<slug>
   PAYLOAD_API_URL=http://localhost:3002/api
   PAYLOAD_API_KEY=<api-key-iz-payload-admina>
   HNS_API_BASE=https://api-hns.analyticom.de
   ```

5. **Dodaj klub-specifične assets u `apps/<slug>/public/`:**
   - `grb.png` — grb kluba
   - `naslovna.jpg` — pozadinska slika hero sekcije
   - `dres.png` — slika dresa za stranicu sezone
   - bilo koji drugi specifični vizuali

6. **Pokreni:**
   ```bash
   pnpm install
   pnpm --filter @moslavac/<slug> dev
   ```

7. **Deploy na Vercel:**
   - Novi Vercel projekt s `Root Directory: apps/<slug>`
   - Postavi env vars u Vercel Dashboard
   - Spoji domenu

## Dijeljeno s drugim klubovima

Sva klub-specifična konfiguracija (boje, ime, HNS key, kontakti) **dolazi iz Payload Tenants kolekcije**, ne iz koda. Multi-tenant CMS je jedan, klubovi različiti.
