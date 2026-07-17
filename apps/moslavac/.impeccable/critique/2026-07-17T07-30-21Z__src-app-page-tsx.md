---
target: početna stranica
total_score: 29
p0_count: 0
p1_count: 3
timestamp: 2026-07-17T07-30-21Z
slug: src-app-page-tsx
---
⚠️ DEGRADED: single-context (Assessment A sub-agents failed to return; design review completed inline, while Assessment B remained independent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Odbrojavanje i stanja carousel kontrola su jasni, ali neki prazni podatkovni blokovi nestaju bez objašnjenja. |
| 2 | Match Between System and Real World | 4 | Hrvatski nogometni jezik, raspored, tablica i rezultat prate očekivani mentalni model navijača. |
| 3 | User Control and Freedom | 3 | Navigacija i carousel kontrole su razumljivi; autoplay i duga stranica nude malo kontrole nad ritmom. |
| 4 | Consistency and Standards | 3 | Paleta i komponente su koherentne, ali gotovo svaka sekcija ponavlja isti golemi verzalni reveal. |
| 5 | Error Prevention | 2 | YouTube CTA pada na `#`, a neki slikovni i logo fallbackovi mogu ostaviti prazne ili lažne akcije. |
| 6 | Recognition Rather Than Recall | 3 | Glavne rute imaju tekstualne oznake, ali „Sezona” skriva velik broj kategorija u jednom izborniku. |
| 7 | Flexibility and Efficiency | 2 | Osnovna tipkovnička podrška postoji; nema skoka na ključni sadržaj, a nekoliko carousela pretpostavlja gestu ili strelice. |
| 8 | Aesthetic and Minimalist Design | 3 | Svaki fold je fokusiran, ali deset velikih modula i ponavljanje istog tretmana stvaraju zamor. |
| 9 | Error Recovery | 2 | Projekt ima error granice, ali početna često rješava nedostupne podatke tihim uklanjanjem cijele sekcije. |
| 10 | Help and Documentation | 4 | Kontakt, klub, pravne informacije i jasne tekstualne rute dobro pokrivaju potrebe službene klupske stranice. |
| **Total** | | **29/40** | **Good — solidna osnova, ali poslovni prioritet i robusnost trebaju jači fokus.** |

## Anti-Patterns Verdict

**LLM assessment:** Stranica ne izgleda kao generičan AI predložak na prvi pogled. Stvarne klupske fotografije, rezultat, grbovi, podaci iz HNS-a i plavo-navy identitet daju joj vjerodostojnost. Najveći AI trag je kompozicijska monotonija: „Vijesti”, „Momčad”, „Sezona”, „Webshop”, „Dođi na utakmicu”, „12. igrač” i „Gledajte utakmice uživo” gotovo svi koriste isti golemi crni verzal, isti `13vw → 8xl` raspon i sličan reveal. Kad svaki trenutak viče istim glasom, nijedan nije vrhunac.

**Deterministic scan:** CLI je vratio 20 advisory nalaza, sve pod pravilom `design-system-font-size`. Grupirani su u `FirstTeamCarousel.tsx` (5), `SeasonDataView.tsx` (5), `CountdownTiles.tsx` (3), `PreviousMatchCard.tsx` (2) te po jedan u `LatestNewsSection.tsx`, `SeasonTicketPromoSection.tsx`, `YouTubePromoSection.tsx`, `NextMatchHero.tsx` i `Header.tsx`. Devetnaest nalaza odnosi se na micro-label veličine `0.5rem–0.6rem`: to nisu automatski WCAG prekršaji, ali jesu nedokumentiran tipografski podskup u odnosu na `0.65rem` label token. Nalaz `SeasonTicketPromoSection.tsx:27` (`10rem`) je lažno pozitivan u smislu čitljivosti jer je riječ o dekorativnom, `aria-hidden` broju 12.

Headless browser detektor prijavio je 16 grupa: 4 upozorenja za predug all-caps tekst, 11 za clipped overflow i jednu body grupu s overused-font, layout-transition i ponovljenim image-hover-transform nalazima. `overused-font` je lažno pozitivan jer DESIGN.md namjerno propisuje Geist kao jedinstveni klupski glas. Većina overflow nalaza odnosi se na image crop, carousel viewport i dekorativne pozadine, pa ih ne treba popravljati bez dokaza da se stvarni interaktivni sadržaj reže. Hover zoom se svodi na tri stvarna izvora: `LatestNewsSection.tsx:58`, `FirstTeamCarousel.tsx:158` i `WebShopView.tsx:71`.

**Visual overlays:** Detektor je uspješno injektiran u headless Chromium i console signal je bio `[impeccable] 16 anti-patterns found`. Budući da nije bio dostupan vidljiv browser tab, ne postoji pouzdan korisnički vidljiv `[Human]` overlay.

## Overall Impression

Prvi dojam je snažan i nedvosmisleno klupski. Hero i match centar stvaraju najbolji dio iskustva: emocija odmah prelazi u stvarni sljedeći događaj. Najveća prilika nije „više dizajna”, nego bolja urednička disciplina — primarni cilj mora biti utakmica, sekundarni moduli trebaju tiši ritam, a semantički fallbackovi ne smiju glumiti valjane akcije.

## What's Working

- **Hero i match centar tvore uvjerljivu cjelinu.** Fotografija, ime kluba, grbovi, countdown i detalji utakmice djeluju kao službeni matchday signal, a ne kao dekorativni sportski predložak (`Hero.tsx:58–188`, `PreviousAndNextMatchSection.tsx:25–45`).
- **Informacijska arhitektura koristi jezik navijača.** Vijesti, utakmice, momčad, sezona, tablica i strijelci odgovaraju očekivanjima publike; nema korporativnog žargona (`Header.tsx:215–238`, `SeasonDataView.tsx:296–369`).
- **Sustav ima stvarne pristupačne temelje.** Semantički linkovi, ARIA oznake, Radix izbornici i reduced-motion grananja prisutni su kroz ključne komponente. To je dobra baza, iako zajednički reveal helper treba ojačati.

## Priority Issues

### [P1] Hero vodi na momčad umjesto na sljedeću utakmicu

**Why it matters:** PRODUCT.md definira dolazak na utakmicu kao primarni ishod i „Pogledaj sljedeću utakmicu” kao primarni CTA. Prvi i najjači CTA trenutačno je „Naša momčad” (`Hero.tsx:170–186`), dok se konkretna utakmica pojavljuje tek nakon punog hero viewporta. To troši najvrjedniji trenutak pažnje na sekundarni cilj.

**Fix:** Primarni hero CTA treba skrolati na `#utakmice` ili voditi ravno na sljedeću utakmicu; „Naša momčad” ostaje sekundarni tekstualni link. Ako postoji sljedeća utakmica, datum/protivnik mogu ući u kratki hero signal bez dupliciranja cijelog match centra.

**Suggested command:** `$impeccable clarify početna stranica`, zatim `$impeccable layout hero`

### [P1] YouTube CTA postaje lažna akcija kada URL nedostaje

**Why it matters:** `tenant.social?.youtube ?? "#"` (`YouTubePromoSection.tsx:8–12`) ostavlja aktivan crveni gumb koji ne vodi nikamo. To izgleda kao kvar, ruši povjerenje u službeni izvor i može vratiti korisnika na vrh stranice.

**Fix:** Ako YouTube URL ne postoji, sakriti cijelu promotivnu sekciju ili prikazati neinteraktivnu, iskrenu poruku. Oznaku „Uživo” prikazivati samo kada postoji stvarni live signal, ne samo kanal.

**Suggested command:** `$impeccable harden YouTube promo`

### [P1] Reveal sadržaj nije vidljiv po zadanim postavkama

**Why it matters:** `FadeInView` postavlja `opacity: 0` i za reduced-motion korisnike, a vidljivost ovisi o `whileInView` okidanju (`packages/ui/src/animations/FadeInView.tsx:39–53`). Skriven tab, usporena hidracija ili zastoj observera mogu ostaviti cijele sekcije praznima. Animacija time kontrolira dostupnost sadržaja umjesto da samo poboljšava već vidljiv sadržaj.

**Fix:** Server-renderirani/default sadržaj mora biti vidljiv. Animacijsko početno stanje treba se primijeniti tek nakon potvrđene hidracije ili kroz progressive-enhancement klasu; reduced-motion varijanta treba biti trenutno vidljiva ili koristiti nenametljiv crossfade bez translacije.

**Suggested command:** `$impeccable animate FadeInView`, zatim `$impeccable harden animacije`

### [P2] Početna je preduga i previše sekcija koristi isti vizualni vrhunac

**Why it matters:** `page.tsx:34–43` slaže hero i devet velikih blokova. Najmanje sedam sekcija koristi gotovo isti `font-black uppercase`, `leading-[0.85]` i `text-[13vw] ... lg:text-8xl` tretman. Ponavljanje slabi emocionalni luk: hero i sljedeća utakmica su vrhunac, sredina postaje niz jednakih najava, a završetak odlazi na vanjski YouTube umjesto da vrati publiku stadionu.

**Fix:** Uspostaviti tri razine sekcija. Hero i sljedeća utakmica ostaju monumentalni; vijesti i sezona koriste srednju hijerarhiju; webshop, momčad i YouTube postaju kompaktniji. Spojiti ili pomaknuti barem jedan promotivni blok te završiti stranicu stadionom ili sljedećom utakmicom.

**Suggested command:** `$impeccable layout početna stranica` ili `$impeccable distill početna stranica`

### [P2] Micro-label tipografija driftala je izvan dokumentiranog sustava

**Why it matters:** Dvadeset CLI nalaza ne predstavlja dvadeset zasebnih kvarova, ali pokazuje da se kroz header, tablice, carousel i match chipove nakupio paralelni raspon od `0.5rem`, `0.55rem` i `0.6rem`. Na mobilnom i slabijim ekranima široki prored dodatno smanjuje čitljivost, posebno u `SeasonDataView.tsx:301,335`, `FirstTeamCarousel.tsx:190,202` i `CountdownTiles.tsx:36–37`.

**Fix:** Ili formalno dokumentirati jednu micro-label iznimku i stroga mjesta uporabe, ili konsolidirati oznake na `0.65rem/0.75rem`. Sve micro-label kombinacije provjeriti na kontrast i 200% zoom; nikad ih ne koristiti za opisni sadržaj.

**Suggested command:** `$impeccable typeset početna stranica`, zatim `$impeccable audit početna stranica`

## Persona Red Flags

**Jordan (prvi posjetitelj):** U prvih pet sekundi vidi snažan klupski identitet, ali jedina jasna akcija je „Naša momčad”. Ako želi saznati kada je utakmica, mora pretpostaviti da treba skrolati. Šest desktop stavki i veliki „Sezona” izbornik dodatno traže poznavanje klupske strukture (`Header.tsx:215–238`).

**Riley (stress tester):** Uklanjanje YouTube URL-a ostavlja klikabilni `#`; nestanak logotipa ostavlja praznu home poveznicu u headeru (`Header.tsx:198–213`); vijest bez thumbnaila i tenant logotipa može proslijediti prazan image source (`LatestNewsSection.tsx:85–95`). To su mali edge slučajevi koji službenu stranicu čine krhkom.

**Casey (mobilni korisnik u pokretu):** Ključna utakmica je ispod `min-h-svh` heroja, a stranica zatim učitava više fotografskih sekcija i carousela. Oznake od 8–10px s velikim trackingom otežavaju skeniranje, dok su webshop strelice skrivene na mobilnom i swipe nije eksplicitno objašnjen (`WebShopView.tsx:43–94`).

## Minor Observations

- Header home link nema tekstualni ili inicijalni fallback kada logo nije dostupan (`Header.tsx:198–213`), iako footer već ima bolji obrazac.
- Crvena je pravilno semantička u YouTube i statusnim kontekstima; ne treba je širiti kao klupski akcent.
- Tri hover-zoom implementacije nisu pojedinačno problem, ali ponavljanje istog hover trika pridonosi predvidljivosti.
- `10rem` broj 12 u sezonskoj promociji je namjerna dekorativna iznimka, ne tipografski kvar.
- Autoplay webshopa poštuje reduced motion, ali vidljiva pauza ili stop povećala bi kontrolu korisnika.

## Questions to Consider

- Što ako hero odmah pokaže protivnika i vrijeme sljedeće utakmice, a „Naša momčad” postane sekundarna poveznica?
- Koja su četiri homepage modula bez kojih službena stranica ne može ispuniti svoju svrhu — i mogu li ostali biti kompaktniji ili na podstranicama?
- Treba li emocionalni završetak stranice biti YouTube pretplata ili povratak na stadion i sljedeću utakmicu?
- Smije li oznaka „Uživo” postojati kada kanal postoji, ali stvarni prijenos trenutačno nije aktivan?
