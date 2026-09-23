# Ticketi: sigurnosni popravci (security audit run-1)

Izvor: security audit `~/security-audit-skill/moslavac/run-1/` (`REPORT.md`, `findings.json`). Svaki ticket navodi fingerprint nalaza radi traga. Ticketi su poredani tako da blokirajući dolaze prije ovisnih.

Ograničenje: HNS API, HNS podaci i HNS ključevi nisu naši i ne mogu se mijenjati ni rotirati. Svi ticketi mijenjaju samo naš kod.

---

## 01: Platformska polja Tenanta može mijenjati samo super-admin

**What to build:** Vlasnik kluba (tenant-admin) više ne može kroz REST ili admin promijeniti platformska polja svog Tenanta: `slug`, `siteUrl`, `active`, cijelu `hns` grupu i `contact.mapEmbedUrl`. Njegov pokušaj se tiho ignorira, isto kao danas kod `features`. Super-admin ih i dalje mijenja normalno. Tako se ostvaruje ono što ADR 0001 već propisuje.

**Blocked by:** None (can start immediately)

**Status:** resolved

Fingerprint: `apps/cms/src/collections/Tenants.ts:platform-fields-without-field-update-access`

- [ ] Tenant-admin update navedenih polja na vlastitom Tenantu ostavlja spremljene vrijednosti nepromijenjene.
- [ ] Super-admin update istih polja uspijeva.
- [ ] `hns.apiKey` zadržava postojeći read access.
- [ ] Regresijski test radi kroz Local API s `overrideAccess: false` (tenant-admin i super-admin).

## Answer

Riješeno. Platformska polja Tenanta imaju `superAdminOnlyField` za update. `hns.matchPagePath` (preseljeno iz 11) prihvaća samo `^[a-z0-9/-]+$`.

Ljudski korak: prije deploya provjeriti ima li u produkciji Tenant s `matchPagePath` koji ne prolazi novo pravilo, jer bi blokirao spremanje.

---

## 02: `siteUrl` je provjereni https origin, a revalidacijski poziv ne slijedi preusmjeravanja

**What to build:** CMS šalje revalidacijski POST samo na https origin kluba koji je na popisu dozvoljenih hostova. Poziv ide uvijek na `/api/revalidate` tog origina i ne slijedi preusmjeravanja. `siteUrl` s putanjom, upitom, fragmentom, loopback ili nepoznatim hostom se odbija pri spremanju i preskače pri slanju. Time se zatvara blind SSRF iz CMS-a.

**Blocked by:** 01

**Status:** resolved

Fingerprint: `apps/cms/src/lib/revalidateFrontend.ts:unvalidated-siteUrl-outbound-post`

- [ ] Validacija polja odbija `http:`, putanju, `?`, `#` i credentials u `siteUrl`.
- [ ] Revalidacijski poziv se ne šalje za host izvan popisa dozvoljenih (popis dolazi iz env varijable).
- [ ] Poziv koristi `redirect: 'manual'`.
- [ ] Test: `siteUrl` na loopback ne proizvodi nijedan odlazni zahtjev, a dozvoljeni origin proizvodi točno jedan.

## Answer

Riješeno. `siteUrl` se na spremanju provjerava kao https origin. Slanje ide samo na hostove iz `REVALIDATE_ALLOWED_HOSTS`, s `redirect: 'manual'`.

Ljudski korak: postaviti `REVALIDATE_ALLOWED_HOSTS` na CMS-u. Bez te varijable CMS ne šalje revalidaciju.

---

## 03: Revalidacijska tajna vrijedi samo za jedan klub

**What to build:** Tajna koju primi jedan Club app ne može revalidirati cache drugog kluba. CMS svakom klubu šalje vlastitu vjerodajnicu, na primjer HMAC nad slugom Tenanta i tagovima ili zasebnu tajnu po Tenantu. `/api/revalidate` svakog kluba prihvaća samo vjerodajnicu vezanu uz svoj Tenant i uspoređuje je u konstantnom vremenu.

**Blocked by:** 02

**Status:** resolved

Fingerprint: `apps/cms/src/lib/revalidateFrontend.ts:shared-revalidate-secret-sent-to-tenant-writable-siteUrl`

- [ ] Vjerodajnica izdana za klub A vraća 401 na revalidacijskoj ruti kluba B.
- [ ] Ispravna vjerodajnica i dalje revalidira tagove kluba.
- [ ] Usporedba koristi constant-time compare.
- [ ] Upute za deploy (env varijable po klubu) ažurirane su u `docs/NEW-CLUB.md`.
- [ ] Nakon deploya zamijeniti stari zajednički `REVALIDATE_SECRET` (ljudski korak, zabilježiti u Answer).

## Answer

Riješeno. Tajna kluba je HMAC-SHA256(CMS `REVALIDATE_SECRET`, slug), a ruta je uspoređuje u konstantnom vremenu. `REVALIDATE_SECRET_PREVIOUS` služi samo za prelazak.

Ljudski korak (redoslijed je u `docs/NEW-CLUB.md`):
1. Na klubovima postaviti novi `REVALIDATE_SECRET` i `REVALIDATE_SECRET_PREVIOUS` = stara zajednička tajna. Deployati klubove.
2. Na CMS-u postaviti NOVU master tajnu i `REVALIDATE_ALLOWED_HOSTS`. Deployati CMS.
3. Maknuti `REVALIDATE_SECRET_PREVIOUS` s klubova i ponovno ih deployati.

Stara tajna mora biti zamijenjena, inače vrijednosti klubova ostaju izračunljive.

---

## 04: HNS ključ ostaje na serveru

**What to build:** Nijedna stranica Club appa više ne šalje `hns.apiKey` u browser. Client komponente (Providers, Header, Hero) dobivaju javnu projekciju Tenanta bez ključa. Ključ čita samo serverski HNS klijent. Ključ nije naš i ne može se rotirati, pa curenje mora prestati u kodu.

**Blocked by:** None (can start immediately)

**Status:** resolved

Fingerprint: `packages/payload/src/getTenant.ts:authenticated-tenant-hns-apiKey-to-client-component`

- [ ] Domain type koji ide u client komponente nema `hns.apiKey`.
- [ ] Serverski HNS klijent i dalje dobiva ključ i HNS pozivi rade.
- [ ] Regresijski test serijalizira props client komponenti (RSC flight) i potvrđuje da ključ nije u izlazu.
- [ ] Vrijedi za svih 5 Club appova, uključujući `template`.

## Answer

Riješeno. Javni `FrontendTenant` nema `hns.apiKey`. Ključ čita samo serverski `getHnsApiKey()`. RSC flight test potvrđuje da ključ ne ide u browser.

Ljudski korak: nakon deploya redeployati ili revalidirati sve Club appove, da stari cache ne servira ključ. Ključ se ne može rotirati jer je HNS-ov.

---

## 05: API ključ može izdati samo super-admin

**What to build:** Tenant-admin više ne može sam sebi postaviti `apiKey`. Njegov zapis se ignorira i ne nastaje `apiKeyIndex`, pa se takvim ključem ne može prijaviti. Super-admin i dalje izdaje ključeve za frontende.

**Blocked by:** None (can start immediately)

**Status:** resolved

Fingerprint: `apps/cms/src/collections/Users.ts:apiKey-field-access:tenant-admin-self-mint`

- [ ] Tenant-admin update s `{ apiKey }` ostavlja `apiKeyIndex` prazan, a `users API-Key <ključ>` ne autentificira.
- [ ] Super-admin može postaviti ključ, i on radi.
- [ ] Postoji skripta ili upit koji izlista korisnike s postavljenim `apiKeyIndex`, da super-admin ukloni ključeve koje nije izdala platforma.

## Answer

Riješeno. Polje `apiKey` je `superAdminOnlyField`, pa tenant-admin ne može postaviti `apiKeyIndex`.

Ljudski korak: u produkciji pokrenuti `cd apps/cms && pnpm payload run scripts/list-api-key-users.ts` i ukloniti ključeve koje nije izdala platforma.

---

## 06: Zaključavanja dokumenata vezana su uz tenant i korisnika

**What to build:** Tenant-admin kluba A više ne može kroz REST `payload-locked-documents` čitati, mijenjati, brisati ni stvarati zaključavanja na dokumentima kluba B. Zaključavanje uvijek pripada korisniku koji ga stvara, i to samo za dokument koji smije uređivati.

**Blocked by:** None (can start immediately)

**Status:** resolved

Fingerprint: `payload-locked-documents-defaultAccess-no-tenant-scope`

- [ ] Tenant-admin A dobiva 403 pri stvaranju zaključavanja na dokumentu kluba B.
- [ ] Tenant-admin A ne vidi niti briše zaključavanja kluba B.
- [ ] Polje `user` na zaključavanju uvijek je trenutni korisnik.
- [ ] Nakon pokušaja kluba A, update kluba B i dalje uspijeva.

## Answer

Riješeno. Kolekcija `payload-locked-documents` se nakon `buildConfig` mijenja tako da:
- korisnik čita, mijenja i briše samo svoja zaključavanja;
- create uvijek postavlja trenutnog korisnika;
- create prolazi samo ako korisnik smije uređivati dokument.

Svjesno prihvaćeno: korisnici ne vide tuđa zaključavanja. Svaki klub danas ima jedan račun. Ako klubovi dobiju više urednika, dozvoliti čitanje zaključavanja unutar istog Tenanta.

---

## 07: Admin `form-state` zaključava samo dokumente koje korisnik smije uređivati

**What to build:** Admin server funkcija `form-state` stvara ili obnavlja zaključavanje samo ako pozivatelj ima update pravo na taj dokument. Za tuđi dokument vraća form state bez zaključavanja. Ovo je odvojeno od ticketa 06: ovaj put piše izravno u bazu i zaobilazi access kolekcije.

**Blocked by:** None (can start immediately)

**Status:** resolved

Fingerprint: `payloadcms-ui-handleFormStateLocking-db-create-no-document-access-check`

- [ ] `form-state` od tenant-admina A za vijest ili Tenant kluba B ne stvara red u `payload-locked-documents`.
- [ ] Nakon toga update i delete kluba B uspijevaju bez `overrideLock`.
- [ ] Vlasnik dokumenta i dalje normalno dobiva zaključavanje u adminu.
- [ ] Problem je prijavljen upstream Payloadu (link zabilježen u Answer).

## Answer

Riješeno. `form-state` je omotan u `layout.tsx` (`formStateLockGuard`). Zaključavanje nastaje samo ako korisnik može uređivati dokument, a provjeru dijeli s ticketom 06 (`canEditDocument`).

Ljudski korak: prijaviti problem Payloadu kroz njihov privatni kanal za ranjivosti. Nacrt je u `~/security-audit-skill/moslavac/run-1/payload-upstream-report-draft.md`. Ovdje zabilježiti link.

---

## 08: Siguran JSON-LD serializer u svim Club appovima

**What to build:** Svi JSON-LD `<script>` blokovi (NewsArticle, Breadcrumb, Organization, SportsEvent, Person…) koriste jedan zajednički helper. Helper escapea `<`, `>`, `&`, U+2028 i U+2029. Tekst iz CMS-a ili HNS-a (npr. naslov MatchReporta) tako ne može zatvoriti skriptu.

**Blocked by:** None (can start immediately)

**Status:** resolved

Fingerprint: `club-apps/json-ld/JSON.stringify-inline-script-breakout`

- [ ] Nijedan JSON-LD sink u `packages/app-shell` i Club appovima više ne koristi goli `JSON.stringify`.
- [ ] Test: vrijednost `</script><script>…` renderira se bez `</script` unutar elementa, a `JSON.parse` vraća originalni tekst.
- [ ] Lint pravilo ili test sprječava novi goli `JSON.stringify` u `dangerouslySetInnerHTML`.

## Answer

Riješeno. Svi JSON-LD blokovi idu kroz `<JsonLdScript>` (`serializeJsonLd`). Oxlint pravilo `moslavac/no-raw-json-in-html` sprječava povratak na goli `JSON.stringify`.

---

## 09: Kanonski HNS id-jevi u rutama

**What to build:** `/api/images/[uuid]` pretvara UUID u mala slova prije poziva HNS-a i prije izrade cache taga, pa varijante velikih i malih slova dijele jedan dohvat. `parseTrailingId` odbija `NaN`, `Infinity` i predugačke brojeve, a takve rute vraćaju 404 bez ijednog HNS poziva.

**Blocked by:** None (can start immediately)

**Status:** resolved

Fingerprint: `hns-unscoped-id-routes-upstream-fanout` (dio)

- [ ] Tri varijante velikih i malih slova istog UUID-a daju jedan HNS dohvat i jedan cache tag.
- [ ] Slug bez znamenki ili s nekonačnim ili predugim brojem daje 0 HNS poziva.
- [ ] Postojeći testovi `slug` i `imageResponse` su prošireni.

## Answer

Riješeno. UUID se pretvara u mala slova. `parseTrailingId` vraća `null` za neispravne ili predugačke id-jeve, a rute tada vraćaju 404 bez HNS poziva.

---

## 10: HNS id rute prihvaćaju samo id-jeve kluba

**What to build:** Rute za utakmice, sezone i statistiku (moslavac, sloga-mravince i njihove opengraph-image rute) prije skupog fan-outa provjeravaju pripada li id utakmici, natjecanju ili igraču kluba. Strani id vraća 404 bez fan-outa na HNS s ključem kluba.

**Blocked by:** 09

**Status:** resolved

Fingerprint: `hns-unscoped-id-routes-upstream-fanout`

- [ ] Strani `competitionId` na `/sezona/*/kartoni` daje najviše jedan HNS poziv (provjera pripadnosti), ne 40+.
- [ ] Strani `matchId` na stranici utakmice i opengraph-image ruti vraća 404 bez scorer i standings fan-outa.
- [ ] Vlastite utakmice i natjecanja kluba rade kao prije.
- [ ] Test s lažnim HNS transportom broji pozive za strane i vlastite id-jeve.

## Answer

Riješeno. Rute za natjecanja i utakmice rade kroz `fetchClubCompetition` i `fetchClubMatch`. sloga-mravince statistika provjerava roster kluba. moslavac statistika namjerno nije ograničena na roster, jer linka i protivničke igrače.

Promjena ponašanja: `/sezona/*` za natjecanja iz prošlih sezona sada vraća 404.

Ljudski korak: smoke test u pravom buildu za vlastitu, protivničku i stranu utakmicu te za OG slike.

---

## 11: Hardening paket

**What to build:** Skup sitnih popravaka niskog rizika iz audita. Nijedan zasebno nije ranjivost, ali zajedno smanjuju površinu napada.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [ ] CMS postavlja `serverURL` i `csrf` listu na admin origin. Auth cookie je `secure` u produkciji.
- [ ] `matchReportsCron` bearer usporedba koristi constant-time compare.
- [ ] Korijenski `.gitignore` ignorira `.env*` (osim `.env.example`).
- [ ] `payload` i `@payloadcms/*` u CMS-u pinani su na točnu verziju umjesto `latest`.
- [ ] Zastarjeli `apps/moslavac/package-lock.json` je obrisan.
- [ ] `hns.matchPagePath` prihvaća samo `^[a-z0-9/-]+$`.
- [ ] Club appovi deklariraju `@payloadcms/richtext-lexical` >= 3.90.1 tamo gdje se koristi.

## Answer

Riješeno:
- `serverURL` i `csrf` iz `PAYLOAD_SERVER_URL`, a ako nije postavljen, iz Vercel URL-ova;
- `secure` cookie;
- zajednička constant-time provjera bearer tokena u `packages/lib`;
- `.env*` u `.gitignore`;
- Payload pinan na 3.90.1;
- obrisan `apps/moslavac/package-lock.json`;
- club appovi na `richtext-lexical` 3.90.1.

Ljudski korak: postaviti `PAYLOAD_SERVER_URL` na CMS-u. Admin se u devu mora otvarati na `http://localhost:43102`.

---

## 12: Provjera povijesti `.env.example`

**What to build:** Potvrda da `apps/cms/.env.example` ni u jednoj reviziji ne sadrži stvarnu tajnu. Audit ovo nije smio pročitati.

**Blocked by:** None (can start immediately)

**Status:** ready-for-human

- [ ] Pregledati `git log -p -- apps/cms/.env.example cms/.env.example`.
- [ ] Sve vrijednosti su placeholderi. Ako se nađe stvarna tajna (koja nije HNS), zamijeniti je.
