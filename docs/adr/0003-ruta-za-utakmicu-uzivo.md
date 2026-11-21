---
Status: accepted
---

# Rezultat uživo preglednik dohvaća s jedne zajedničke rute

Vercel je pauzirao sve projekte kad je račun probio mjesečni limit Fluid Active
CPU na Hobby planu. Najveći trošak bila je stranica utakmice: da bi rezultat uživo
bio svjež, sve utakmice sezone renderirale su se na serveru svakih 30 s, iako se
odigrana utakmica više nikad ne mijenja. Svaki bot koji obiđe stare utakmice i
svaki gledatelj tijekom utakmice okidali su novo renderiranje.

Zato stranica utakmice postaje statična, a samo dio koji se mijenja uživo
(**LiveMatch**: rezultat, status, minuta, događaji, postave) preglednik dohvaća s
rute `/api/utakmice/[id]/uzivo`. CDN tu rutu kešira 30 s, zajednički za sve
posjetitelje, pa jedna utakmica košta najviše jedan poziv HNS-u na 30 s, bez
obzira na to koliko je ljudi gleda. Preglednik je zove samo u prozoru oko
utakmice; odigrane i daleke buduće utakmice ne troše ništa.

Ovo je drugi put podataka do preglednika i svjesna iznimka od pravila "One data
path". Pravilo je samo predviđa ("polling that server revalidation cannot
express"): jedan zajednički adapter u `packages/`, ne klijentski data stack po
appu.

## Razmotrene opcije

- **Zadržati `revalidate = 30` i `RefreshWhile`.** Odbačeno: CPU raste s brojem
  utakmica u sezoni, botova i gledatelja, a upravo to je probilo limit.
- **Revalidacija samo za utakmice u tijeku.** Odbačeno: `revalidate` je po ruti,
  ne po utakmici, a server ne zna unaprijed koja će se utakmica igrati kad je bot
  otvori. Svejedno bi svaki gledatelj okidao renderiranje cijele stranice.
- **Klijentski data stack (React Query, SWR).** Odbačeno: jedna ruta i jedan hook
  ne opravdavaju novu ovisnost ni drugi način dohvaćanja u svakom appu.

## Posljedice

- **Ruta je tanki poziv factoryja.** `createLiveMatchRoute` u `packages/hns`
  (po uzoru na `createHnsImageResponse`) radi validaciju, keš zaglavlja i
  statuse; klupski app je izlaže u tri retka. Drugi klub je uključuje istim
  pozivom.
- **Mapiranje ostaje u data layeru.** `fetchLiveMatch` vraća domain tip
  `LiveMatch`; ruta samo serijalizira. Sirovi HNS oblik nikad ne stiže do
  preglednika.
- **ID se provjerava prije HNS-a.** Sve što nije pozitivan cijeli broj vraća 400
  bez poziva HNS-u, pa se ruta ne može iskoristiti za proizvoljne HNS putanje.
- **Greška se ne kešira.** 404 i 502 nose `no-store`. Ako zakaže bilo koji od tri
  HNS poziva (utakmica, događaji, postave), ruta vraća 502 umjesto djelomičnog
  stanja, a preglednik zadržava posljednje ispravno stanje.
- **Kašnjenje rezultata ostaje ~30 s**, kao i prije: 30 s u CDN-u
  (`s-maxage=30`) uz TTL fetcheva od 30 s.
- **HTML bez JavaScripta star je do jednog dana.** Botovi i posjetitelji bez
  JavaScripta i dalje dobivaju potpunu stranicu, ali rezultat uživo vide tek
  nakon idućeg renderiranja.
