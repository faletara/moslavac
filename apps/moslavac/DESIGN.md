---
name: "SNK Moslavac"
description: "Službena klupska stranica koja izravno informira navijače i vodi ih prema sljedećoj utakmici."
colors:
  club: "oklch(0.46 0.19 262)"
  signal-red: "oklch(0.55 0.21 27)"
  navy: "oklch(0.17 0.045 262)"
  navy-deep: "oklch(0.135 0.04 263)"
  chalk: "oklch(0.975 0.004 250)"
  ink: "oklch(0.19 0.035 262)"
  surface: "oklch(0.99 0.002 250)"
  muted-surface: "oklch(0.945 0.008 252)"
  muted-ink: "oklch(0.5 0.025 258)"
  border: "oklch(0.9 0.012 254)"
  destructive: "oklch(0.577 0.245 27.325)"
  category-seniors: "#013f6b"
  category-juniors: "#01497d"
  category-cadets: "#015a99"
  category-older-pioneers: "#026cb6"
  category-younger-pioneers: "#1f7bbf"
  category-limaci: "#3389c7"
  category-prstici: "#4a98cf"
typography:
  display:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(3rem, 13vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.85
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 7vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "normal"
  body:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.3em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  pill: "9999px"
spacing:
  gutter-mobile: "16px"
  gutter-content: "24px"
  control-x: "32px"
  section-mobile: "80px"
  section-wide: "112px"
  section-event: "160px"
components:
  button-primary:
    backgroundColor: "{colors.club}"
    textColor: "{colors.chalk}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-light:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.navy-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-utility:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
  chip-category:
    backgroundColor: "{colors.category-seniors}"
    textColor: "{colors.chalk}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  navigation:
    textColor: "{colors.muted-ink}"
    typography: "{typography.label}"
    height: "80px"
  match-panel:
    backgroundColor: "{colors.navy-deep}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.lg}"
    padding: "32px"
  news-story:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
---

# Design System: SNK Moslavac

## 1. Overview

**Creative North Star: "Reflektori domaćeg terena"**

Sustav treba djelovati kao trenutak prije početka domaće utakmice: reflektori su upaljeni, informacije su jasne, a energija dolazi iz stvarnih klupskih fotografija, momčadi i događaja. Vizual je borben, domaći i ponosan, ali nikad agresivan ili kaotičan.

Velika sportska tipografija, duboke plave površine i ritam nalik prijenosu daju stranici autoritet službenog izvora. Svijetle stranice služe čitanju i podacima; tamne, fotografske dionice nose emociju utakmice. Sustav izričito odbija generičnu korporativnu prezentaciju, hladan statistički portal i prenatrpan portal za klađenje.

**Key Characteristics:**

- Službena informacija prije dekoracije.
- Stvarne klupske fotografije kao glavni emocionalni materijal.
- Plava, navy i kredasto bijela kao identitet; crvena samo kao semantički signal.
- Veliki, zbijeni naslovi i miran, čitljiv tekst.
- Pokret koji podsjeća na sportski prijenos i uvijek poštuje smanjeno kretanje.

## 2. Colors

Paleta je hladna, klupska i jasno hijerarhijska: Moslavac plava privlači akciju, navy nosi atmosferu, a kredasto bijele i hladne neutralne površine čuvaju čitljivost.

### Primary

- **Moslavac plava** (`colors.club`): primarna akcija, aktivna stanja, naglasci i klupsko toniranje fotografija.
- **Ponoć pod reflektorima** (`colors.navy-deep`, `colors.navy`): tamne hero dionice, paneli utakmica i kontrastne sekcije koje nose atmosferu.

### Secondary

- **Signalna crvena** (`colors.signal-red`): isključivo YouTube, status uživo i negativan rezultat. Nije klupska boja i nikad nije dekorativni akcent.
- **Destruktivna crvena** (`colors.destructive`): pogreške i destruktivne radnje. Ne zamjenjuje signalnu crvenu niti ulazi u brand kompozicije.

### Tertiary

- **Plava dobna skala** (`colors.category-seniors` do `colors.category-prstici`): razlikuje natjecateljske i dobne kategorije od najtamnije seniorske do najsvjetlije kategorije prstića.

### Neutral

- **Stadionska kreda** (`colors.chalk`): svijetla pozadina i tekst na navy površinama.
- **Klupska tinta** (`colors.ink`): primarni tekst i najjači neutralni kontrast.
- **Čista površina** (`colors.surface`): izdvojeni sadržaj, izbornici i kontrole.
- **Tiha tribina** (`colors.muted-surface`, `colors.muted-ink`): sekundarne površine, pomoćni tekst i neaktivna stanja.
- **Hladna linija** (`colors.border`): razdjelnici i strukturni obrubi.

### Named Rules

**The Blue Identity Rule.** Moslavac plava, navy i kredasto bijela jedine su identitetske boje.

**The Signal Red Rule.** Crvena je dopuštena samo za YouTube, uživo, poraz i grešku; nikad za dekoraciju, klupske CTA-ove ili pozadinsku atmosferu.

**The Contrast Rule.** Tekst mora zadovoljiti WCAG 2.2 AA; sivi tekst na obojenoj površini je zabranjen — koristi nijansu iste plave obitelji ili prozirnost boje teksta.

## 3. Typography

**Display Font:** Geist (s Arial i sans-serif fallbackom)
**Body Font:** Geist (s Arial i sans-serif fallbackom)
**Label Font:** Geist (s Arial i sans-serif fallbackom)

**Character:** Jedna obitelj stvara osjećaj jedinstvenog klupskog glasa. Razliku ne proizvodi dekorativno uparivanje fontova, nego radikalna promjena težine, mjerila, proreda i ritma.

### Hierarchy

- **Display** (`typography.display`): naslovi sekcija, kratki sportski iskazi i ključne poruke; uvijek uravnoteženi i bez prelijevanja na uskim ekranima.
- **Headline** (`typography.headline`): naslovi podstranica i velikih sadržajnih blokova.
- **Title** (`typography.title`): vijesti, igrači, utakmice i naslovi kartica ili redaka.
- **Body** (`typography.body`): opisni i informativni tekst, s preporučenom duljinom retka od 65–75 znakova.
- **Label** (`typography.label`): kratke navigacijske oznake, kategorije i CTA-ovi. Velika slova i široki prored dopušteni su samo za kratke oznake.

### Named Rules

**The Matchday Scale Rule.** Jedna poruka po velikom naslovu; mjerilo smije biti dramatično, ali gornja granica u redovnim sekcijama je 6rem, a razmak slova nikad nije uži od -0.04em.

**The Readability Rule.** Informativni sadržaj nikad nije pisan sitnim verzalom. Tekst manji od 0.75rem rezerviran je za kratke pomoćne oznake, ne za objašnjenja.

## 4. Elevation

Sustav je ravan po zadanim postavkama. Dubinu stvaraju tonalne navy površine, fotografije, preklapanje tipografije i jasni obrubi; sjena se pojavljuje samo kada element stvarno pluta, otvara se iznad sadržaja ili nosi statusni trenutak.

### Shadow Vocabulary

- **Plutajući izbornik** (`0 12px 40px -12px rgb(0 0 0 / 0.18)`): samo dropdown, popover i slični slojevi iznad stranice.
- **Grb iznad terena** (`0 8px 30px -10px rgb(0 0 0 / 0.5)`): grb ili mali svijetli element na tamnoj fotografskoj površini.
- **Klupski sjaj** (`0 20px 60px -20px var(--club)`): rijedak hover naglasak na fotografskoj kartici igrača.
- **Signal uživo** (`0 0 60px -12px var(--club-red)`): samo status uživo ili odbrojavanje; ne smije postati dekorativni glow.

### Named Rules

**The Flat Home Ground Rule.** Površine su ravne u mirovanju. Ako kartica istodobno ima obrub i široku mekanu sjenu, ukloni jedno.

## 5. Components

Komponente trebaju djelovati izravno, sportski i samouvjereno. Primarne akcije su snažne i kratke; sadržajne površine izbjegavaju generičnu mrežu jednakih kartica.

### Buttons

- **Shape:** klupski CTA je puni pill (`rounded.pill`); uslužni gumb koristi kontrolirani srednji radijus (`rounded.md`).
- **Primary:** Moslavac plava na kredasto bijeloj, s prostranim vodoravnim paddingom (`components.button-primary`).
- **Hover / Focus:** hover mijenja ton bez dekorativnog sjaja; fokus koristi jasan trostruki ring u boji primarnog fokusa.
- **Light:** kredasto bijeli CTA na navy ili fotografiji (`components.button-light`).
- **Utility / Outline:** kompaktna kontrola za kartu, navigaciju i pomoćne radnje (`components.button-utility`).

### Chips

- **Style:** puni pill, kratka verzalna oznaka i boja iz plave dobne skale (`components.chip-category`).
- **State:** crveni chip dopušten je samo za poraz ili status uživo; aktivno stanje inače koristi Moslavac plavu.

### Cards / Containers

- **Corner Style:** brendirani fotografski paneli uglavnom ostaju oštri ili blago zaobljeni; zajedničke uslužne kartice završavaju na `rounded.xl`.
- **Background:** svijetle površine koriste čistu ili prigušenu neutralnu; događaji i sljedeća utakmica koriste navy.
- **Shadow Strategy:** ravno po zadanim postavkama; vidi Elevation.
- **Border:** tanka hladna linija služi strukturi, ne dekoraciji.
- **Internal Padding:** kompaktno za podatke, velikodušno za ključne događaje (`components.match-panel`).

### Inputs / Fields

- **Style:** visina 36px, hladni obrub, prozirna ili čista površina i srednji radijus (`components.input-default`).
- **Focus:** boja obruba prelazi u fokusnu plavu uz vidljiv 3px ring.
- **Error / Disabled:** greška koristi samo destruktivnu semantiku; onemogućeno stanje zadržava čitljivost i ne reagira na pokazivač.

### Navigation

- **Style:** kratke verzalne poveznice, 0.2em proreda i jasna razlika između aktivne i prigušene stavke.
- **Desktop:** sticky zaglavlje je prozirno na vrhu tamnog heroja, a pri povratku kroz sadržaj dobiva čvrstu površinu i suptilan blur.
- **Mobile:** navigacija ulazi u bočni sheet; meta i kategorije ostaju grupirane, a fokus i zatvaranje moraju biti dostupni tipkovnicom.

### Matchday Hero

Fotografija preko cijele površine, navy toniranje, golemo ime kluba i godina osnutka čine potpis naslovnice. Parallax i tipografski reveal stvaraju energiju samo kada korisnik nije zatražio smanjeno kretanje. Primarni put iz heroja vodi prema sljedećoj utakmici, dok momčad ostaje sekundarna akcija. Kada sljedeća utakmica nije dostupna, primarna akcija vodi prema rasporedu bez mrtvog sidra.

## 6. Do's and Don'ts

### Do:

- **Do** koristi Moslavac plavu, navy i kredasto bijelu kao jedine identitetske boje.
- **Do** koristi signalnu crvenu samo za YouTube, uživo, poraz i sličan nedvosmislen status.
- **Do** daje prednost stvarnim klupskim fotografijama, stvarnim rezultatima i službenim HNS podacima.
- **Do** čini sljedeću utakmicu vidljivom bez traženja i vodi prema dolasku na stadion.
- **Do** drži redovne display naslove na najviše 6rem i provjerava svaku dugu hrvatsku riječ na mobilnom prikazu.
- **Do** osigurava tipkovničku navigaciju, jasne fokuse, WCAG 2.2 AA kontrast i alternativu za smanjeno kretanje.
- **Do** koristi najviše jedan kratki eyebrow u heroju stranice; nemoj ga ponavljati iznad svake sekcije.

### Don't:

- **Don't** pretvarati stranicu u generičnu korporativnu prezentaciju.
- **Don't** pretvarati stranicu u hladan statistički portal.
- **Don't** pretvarati stranicu u prenatrpan portal za klađenje.
- **Don't** koristiti signalnu crvenu kao klupski akcent, dekorativnu pozadinu ili opći CTA.
- **Don't** slagati beskrajne mreže jednakih kartica s ikonom, naslovom i tekstom.
- **Don't** koristiti gradientni tekst, dekorativni glassmorphism ili bočne obojene trake na karticama.
- **Don't** uparivati tanki obrub i široku mekanu sjenu na istom elementu.
- **Don't** koristiti verzal za opisni tekst ili prigušenu boju teksta koja ne zadovoljava kontrast.
