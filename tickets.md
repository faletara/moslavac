# Tickets: Fokusirana početna stranica Moslavca

Ovi ticketi korak po korak usklađuju početnu stranicu sa službenom ulogom kluba: brzo informirati publiku i povećati dolazak na utakmice. Temelje se na product briefu, dizajnerskom sustavu i Impeccable kritici početne stranice.

Work the **frontier**: može se uzeti bilo koji ticket čiji su blokirajući ticketi završeni. Dogovoreni redoslijed rada počinje s herojem i nastavlja se jedan ticket po jedan.

## Sljedeća utakmica postaje primarni put iz heroja

**What to build:** Posjetitelj iz heroja dobiva jedan izravan, vjerodostojan put prema sljedećoj utakmici i informacijama potrebnima za dolazak, dok momčad ostaje dostupna kroz glavnu navigaciju.

**Blocked by:** None — can start immediately.

- [x] Primarna hero akcija glasi „Pogledaj sljedeću utakmicu” i vodi do aktualnog prikaza sljedeće utakmice.
- [x] Kada je utakmica dostupna, posjetitelj bez dodatnog traženja može saznati datum, protivnika i lokaciju.
- [x] Kada sljedeća utakmica nije dostupna, hero prikazuje smisleno stanje bez mrtve ili lažne poveznice.
- [x] Hero ima najviše jednu akciju; put prema momčadi ostaje dostupan kroz glavnu navigaciju.
- [x] Product i design pravila više si ne proturječe oko primarnog puta iz heroja.
- [x] Akcije imaju vidljiv fokus i rade tipkovnicom na mobilnom i desktop prikazu.

## YouTube akcija prikazuje se samo kada postoji odredište

**What to build:** YouTube ostaje završni sadržaj početne stranice, ali poziv na kanal ponaša se iskreno i predvidljivo bez obzira na to je li URL već konfiguriran.

**Blocked by:** None — can start immediately.

- [x] S konfiguriranim URL-om korisnik dobiva ispravnu vanjsku poveznicu prema YouTube kanalu.
- [x] Bez konfiguriranog URL-a ne postoji akcija koja vodi na `#`, vraća korisnika na vrh ili se lažno predstavlja kao aktivna.
- [x] Prazno stanje zadržava vizualni ritam sekcije i jasno komunicira da kanal još nije dostupan.
- [x] YouTube ostaje posljednja sekcija početne stranice.
- [x] Crvena boja ostaje ograničena na YouTube kontekst i ne prelazi u klupske CTA-ove ili dekoraciju.

## Sadržaj ostaje vidljiv bez animacijskog runtimea

**What to build:** Tekst, slike i akcije početne stranice dostupni su i kada se animacijski kod ne izvrši, dok korisnici koji dopuštaju kretanje i dalje dobivaju odmjerene ulazne animacije.

**Blocked by:** None — can start immediately.

- [ ] Osnovno stanje svakog animiranog sadržaja je vidljivo i upotrebljivo bez JavaScripta ili uspješnog pokretanja animacije.
- [ ] Korisnička postavka za smanjeno kretanje uklanja ulazne animacije bez skrivanja ili odgađanja sadržaja.
- [ ] Standardni način rada zadržava postojeći karakter kretanja bez blokiranja interakcije.
- [ ] Tipkovnički fokus ne može završiti na vizualno skrivenom elementu.
- [ ] Automatizirana provjera pokriva standardno stanje, smanjeno kretanje i izostanak animacijskog izvršavanja.

## Mikrotipografija koristi definirane dizajnerske tokene

**What to build:** Kratke navigacijske, statusne i pomoćne oznake koriste jednu čitljivu mikrotipografsku ljestvicu, dok namjerna display-tipografija ostaje izuzetak.

**Blocked by:** None — can start immediately.

- [ ] Pomoćne oznake koriste definirani label token umjesto niza ručno odabranih sitnih veličina.
- [ ] Informativni sadržaj nije prikazan sitnim verzalom niti veličinom rezerviranom za kratke oznake.
- [ ] Dekorativna velika tipografija ostaje vizualno nepromijenjena i skrivena je asistivnoj tehnologiji kada ne nosi značenje.
- [ ] Kontrast, prored i čitljivost oznaka zadovoljavaju WCAG 2.2 AA namjeru dizajnerskog sustava.
- [ ] Statički dizajnerski detektor više ne prijavljuje neobjašnjena odstupanja mikrotipografije na početnoj stranici.

## Početna dobiva jasnu hijerarhiju oko utakmice

**What to build:** Cijela početna stranica vodi posjetitelja od klupskog identiteta i sljedeće utakmice prema vijestima i podršci klubu, bez niza sekcija koje sve traže jednaku pažnju.

**Blocked by:** Sljedeća utakmica postaje primarni put iz heroja; Mikrotipografija koristi definirane dizajnerske tokene.

- [ ] Hero i sljedeća utakmica čine jedinstven primarni uvod umjesto dva konkurentska vrhunca.
- [ ] Najnovije vijesti ostaju jasno prepoznatljiv sekundarni put.
- [ ] Momčad, sezonski podaci, webshop i sadržaj za dolazak ostaju dostupni, ali dobivaju različitu vizualnu težinu prema važnosti.
- [ ] Veliki display tretman nije mehanički ponovljen na svakoj glavnoj sekciji.
- [ ] Redoslijed i razmaci funkcioniraju na uskom mobitelu, tabletu, malom laptopu i širokom desktopu.
- [ ] Ponavljane interakcije nad fotografijama koriste dosljedno ponašanje i poštuju smanjeno kretanje.
- [ ] YouTube ostaje završna sekcija, u skladu s odabranim smjerom.
- [ ] Moslavac plava, navy i kredasto bijela ostaju identitetske boje; crvena se koristi samo semantički.

## Početna poveznica u zaglavlju uvijek ima dostupan naziv

**What to build:** Povratak na početnu stranicu ostaje jasan svim korisnicima čak i kada klupski logotip nije konfiguriran ili se njegova slika ne učita.

**Blocked by:** None — can start immediately.

- [ ] Poveznica prema početnoj uvijek ima programski dostupan naziv.
- [ ] Bez logotipa zaglavlje prikazuje smislen tekstualni ili drugi definirani fallback bez praznog klikabilnog prostora.
- [ ] Fallback ne uzrokuje pomicanje navigacije niti narušava mobilni raspored.
- [ ] Fokus poveznice vidljiv je na svijetloj, tamnoj i prozirnoj varijanti zaglavlja.

## Vijesti imaju pouzdano prazno i fallback stanje

**What to build:** Vijest bez naslovne slike ili klupskog logotipa i dalje izgleda namjerno, čitljivo i službeno, bez pokvarenog ili praznog medijskog prostora.

**Blocked by:** None — can start immediately.

- [ ] Vijest sa slikom zadržava postojeći fotografski prikaz i ispravan alternativni tekst.
- [ ] Vijest bez slike koristi dosljedan neutralni fallback koji ne glumi stvarnu fotografiju.
- [ ] Izostanak i slike i logotipa ne proizvodi pokvarenu sliku, praznu poveznicu ili neobjašnjiv prazan omjer.
- [ ] Naslov, kategorija i datum ostaju čitljivi i pravilno hijerarhijski u svim medijskim stanjima.

## Webshop carousel potpuno je upravljiv na mobitelu

**What to build:** Mobilni posjetitelj može namjerno pregledavati webshop sadržaj, zaustaviti se na željenom proizvodu i koristiti kontrole bez oslanjanja na automatsko pomicanje.

**Blocked by:** None — can start immediately.

- [ ] Mobilni prikaz nudi vidljive i dodirno dovoljno velike kontrole za prethodni i sljedeći sadržaj.
- [ ] Kontrole imaju dostupan naziv, jasan fokus i rade tipkovnicom.
- [ ] Automatsko pomicanje ne pokreće se korisnicima sa smanjenim kretanjem.
- [ ] Ručna interakcija ne bori se s automatskim pomicanjem niti neočekivano mijenja odabrani proizvod.
- [ ] Carousel ostaje upotrebljiv kada postoji jedan proizvod, mnogo proizvoda ili nijedan proizvod.

## Završna provjera cijelog puta kroz početnu

**What to build:** Završena početna stranica potvrđeno informira posjetitelja i vodi ga prema utakmici bez regresija u dostupnosti, responzivnosti, sadržaju ili klupskom identitetu.

**Blocked by:** Sljedeća utakmica postaje primarni put iz heroja; YouTube akcija prikazuje se samo kada postoji odredište; Sadržaj ostaje vidljiv bez animacijskog runtimea; Mikrotipografija koristi definirane dizajnerske tokene; Početna dobiva jasnu hijerarhiju oko utakmice; Početna poveznica u zaglavlju uvijek ima dostupan naziv; Vijesti imaju pouzdano prazno i fallback stanje; Webshop carousel potpuno je upravljiv na mobitelu.

- [ ] Svježi posjetitelj u prvom prolazu može utvrditi kada, gdje i protiv koga Moslavac igra.
- [ ] Primarna i sekundarna akcija odgovaraju product briefu: sljedeća utakmica pa najnovije vijesti.
- [ ] Ključni put radi tipkovnicom i s čitačem zaslona te poštuje smanjeno kretanje.
- [ ] Početna je vizualno i funkcionalno provjerena na mobitelu, tabletu, malom laptopu i širokom desktopu.
- [ ] Statički i browser dizajnerski detektori nemaju neriješene kritične nalaze; namjerni izuzeci su dokumentirani.
- [ ] Nova Impeccable kritika spremljena je kao trend snapshot i uspoređena s početnom ocjenom 29/40.

---

# Produbljivanje platformskog sloja

Ticketi iz arhitektonskog pregleda (23. 7. 2026.). Cilj je pomaknuti logiku koja se
kopirala po Club appovima iza postojećih seamova u `packages/`, kako bi se promjena,
bug i verifikacija koncentrirali na jedno mjesto.

`packages/payload` i `packages/hns` su referentni duboki moduli — mala sučelja,
mapiranje raw → domenski tip skriveno unutra, testirano kroz interface preko
injektiranog transporta. Ticketi ispod primjenjuju isti obrazac na ono što je
ostalo iznad njih.

## Identitet kluba projicira se u &lt;head&gt; iz jednog modula

**What to build:** Metadata i schema.org podaci svakog Club appa izvode se iz Tenant zapisa kroz jedan zajednički modul, umjesto da se iznova grade u svakom `layout.tsx`.

**Blocked by:** None — can start immediately.

- [x] Naziv, opis, OG/twitter podaci i canonical URL svakog kluba izvode se iz Tenanta kroz jedno zajedničko sučelje.
- [x] Organizacijski i website schema.org podaci prisutni su u svakom Club appu, uključujući nk-vrapce.
- [ ] Nijedan app ne sadrži hardkodiran naziv mjesta, županije ili drugog klupskog podatka koji Tenant već nosi.
      <!-- djelomično: mjesto/županija riješeni; klupska imena još su tvrdo kodirana u opisima stranica, alt tekstovima i footerima -->
- [x] Klub bez popunjenog grada ili regije proizvodi valjan izlaz bez praznih ili izmišljenih polja.
- [x] `layout.tsx` po appu zadržava samo ono što je stvarno klupsko: fontove i vizualni omotač.
- [x] Provjera nad izvedbom metapodataka izvodi se jednom i vrijedi za sve klubove.
- [x] Dodavanje novog kluba ne zahtijeva kopiranje logike metapodataka.

## Vrsta utakmičnog događaja određuje se iza hns sučelja

**What to build:** Prepoznavanje vrste događaja iz HNS podataka (žuti karton, crveni karton, izmjena, gol, autogol) živi jednom u podatkovnom sloju, dok Club appovi biraju samo vizualni prikaz.

**Blocked by:** None — can start immediately.

- [x] Domenski tip utakmičnog događaja nosi prepoznatu vrstu, a ne samo sirovi tekstualni naziv iz HNS-a.
- [x] Autogol se u svakom Club appu razlikuje od običnog gola.
- [x] Sve poznate varijante naziva izmjene prepoznaju se kao izmjena, neovisno o appu.
- [x] Nepoznata vrsta događaja proizvodi definirano neutralno stanje umjesto tihog pogrešnog prikaza.
- [x] Club appovi sadrže samo preslikavanje prepoznate vrste u vizualni prikaz; parsiranje teksta u njima više ne postoji.
- [x] Provjera pokriva tablicu naziv → vrsta na jednom mjestu.
- [ ] Vizualni identitet ikona po klubu ostaje nepromijenjen.
      <!-- moslavac: autogol sada dobiva crveni ton (prije se prikazivao kao običan gol) — treba potvrda dizajna -->

## Podatkovni put opisan je onako kako stvarno radi

**What to build:** Dokumentacija i kod slažu se oko toga kako aplikacije dohvaćaju podatke, umjesto da opisuju klijentski put koji nije implementiran.

**Blocked by:** None — can start immediately.

- [x] Opis podatkovnog puta u projektnoj dokumentaciji odgovara onome što kod stvarno radi.
- [x] Ne postoji paket, provider ili pravilo koje opisuje mogućnost bez ijednog korisnika u kodu.
- [x] Pomoćna funkcija za HNS slike živi uz ostatak HNS sloja koji te slike poslužuje.
- [x] Uklanjanje neiskorištene infrastrukture ne mijenja ponašanje nijednog Club appa.
- [x] Novi razvijatelj ili agent iz dokumentacije dobiva jedan točan put, bez proturječja između kopija pravila.
- [x] Ako se klijentski put kasnije uvede, dokumentiran je tek kad postoji zajednički modul koji ga podržava.

## Zajednički helperi žive u platformskom sloju

**What to build:** Pomoćni kod koji je danas identičan u svim Club appovima održava se na jednom mjestu, a appovi zadržavaju samo ono što okvir nužno traži na svojoj putanji.

**Blocked by:** None — can start immediately.

- [x] Pomoćne funkcije koje su danas identične u više appova postoje samo u jednoj izvedbi.
- [x] Datoteke koje Next zahtijeva na točnoj putanji ostaju u appu, ali bez vlastite logike.
- [x] Razlike koje su stvarno klupske i dalje su izražive bez kopiranja cijelog modula.
- [ ] Svi Club appovi nakon promjene ponašaju se jednako kao prije.
      <!-- resolveBaseUrl sada uklanja završnu kosu crtu i za moslavac/nk-vrapce/template (prije samo sloga) — ispravak, ali promjena ponašanja -->
- [x] Zajednički helperi pokriveni su provjerom koja vrijedi za sve klubove.
- [x] Novi klub dobiva ove mogućnosti bez kopiranja datoteka.

## Testna konfiguracija pokriva sve Club appove

**What to build:** Automatizirane provjere obuhvaćaju svaki Club app, tako da razilaženje između klubova više ne može proći neprimijećeno.

**Blocked by:** None — can start immediately.

- [x] Testna konfiguracija uključuje sve postojeće Club appove, ne samo moslavac.
- [x] Dodavanje novog kluba ne zahtijeva ručnu izmjenu testne konfiguracije.
- [x] Postojeće provjere i dalje prolaze i ne usporavaju se neprihvatljivo.
- [x] Provjera koja bi uhvatila razilaženje između klubova postoji barem za jedan zajednički modul.

## nk-vrapce prati istu platformsku razinu kao ostali klubovi

**What to build:** Najstariji Club app dobiva iste platformske mogućnosti koje ostali appovi i scaffold već imaju, a organizacija koda slijedi zajedničku konvenciju.

**Blocked by:** Identitet kluba projicira se u <head> iz jednog modula; Zajednički helperi žive u platformskom sloju.

- [ ] nk-vrapce ima iste platformske mogućnosti kao ostali Club appovi.
- [ ] Raspored značajki u kodu slijedi istu konvenciju kao ostali appovi.
- [ ] Zaostatak koji su riješili prethodni ticketi ne rješava se ponovno ručno.
- [ ] Vizualni identitet i sadržaj nk-vrapca ostaju nepromijenjeni.
- [ ] Scaffold za nove klubove i live appovi opisuju istu razinu mogućnosti.

## Aritmetika oko utakmica i tablice izvodi se jednom

**What to build:** Izvođenje podataka za tablicu, formu i vremensku crtu događaja živi u podatkovnom sloju, dok svaki klub zadržava vlastiti vizualni prikaz.

**Blocked by:** Vrsta utakmičnog događaja određuje se iza hns sučelja.

- [ ] Izvođenje redaka tablice, isticanje vlastite momčadi i grupiranje događaja postoji u jednoj izvedbi.
- [ ] Club appovi troše pripremljene podatke i odlučuju samo o prikazu.
- [ ] Rubni slučajevi (bez tablice, bez događaja, momčad nije u tablici) ponašaju se jednako u svim klubovima.
- [ ] Vizualni identitet prikaza po klubu ostaje nepromijenjen.
- [ ] Izvođenje podataka pokriveno je provjerom na razini podatkovnog sloja.
- [ ] Zajednički JSX se ne uvodi; dijeli se samo izvođenje podataka.

## Sitemap i robots izvode se iz opisa ruta pojedinog kluba

**What to build:** Svaki Club app opisuje samo svoje rute, dok se sam sitemap i pravila za robote grade jednom u platformskom sloju.

**Blocked by:** None — can start immediately.

- [x] Rute, izvori sadržaja i pravila za tražilice pojedinog kluba opisani su podacima, a ne ponovljenim kodom.
- [x] Sitemap svakog kluba obuhvaća statične rute, novosti i utakmice neovisno o tome kako se te rute zovu na hrvatskom.
- [x] Ispad jednog izvora podataka ne ruši cijeli sitemap.
- [x] Pravila za tražilične i AI robote jednaka su u svim klubovima i mijenjaju se na jednom mjestu.
      <!-- nk-vrapce prije nije propuštao /api/images/ ni AI-search robote; sada dobiva istu politiku — konvergencija, ne regresija -->
- [x] Novi klub dobiva ispravan sitemap i robots bez kopiranja datoteka.
- [x] Izvedba je pokrivena provjerom koja vrijedi za sve klubove.

## Schema.org podaci pojedine stranice izvode se iz domenskih tipova

**What to build:** Structured data za novost, utakmicu, igrača i navigacijski trag gradi se kroz jedno zajedničko sučelje, kao što se klupski identitet već gradi za `<head>`.

**Blocked by:** Identitet kluba projicira se u <head> iz jednog modula.

- [ ] Structured data pojedine stranice izvodi se iz domenskih tipova kroz jedno zajedničko sučelje.
- [ ] Novost, utakmica, igrač i navigacijski trag proizvode isti oblik podataka u svakom klubu.
- [ ] Nijedan Club app ne sadrži ručno složen schema.org objekt.
- [ ] Nepotpuni podaci proizvode valjan izlaz bez praznih ili izmišljenih polja.
- [ ] Pokrivenost structured data podacima ne razlikuje se od kluba do kluba.
- [ ] Izvedba je pokrivena provjerom koja se izvodi jednom i vrijedi za sve klubove.

## Stranica pojedine novosti izvodi se jednom, a klubovi biraju samo prikaz

**What to build:** Razrješavanje novosti iz adrese, metapodaci, kanonska adresa i structured data žive u platformskom sloju, dok Club app donosi samo vlastiti vizualni prikaz.

**Blocked by:** Schema.org podaci pojedine stranice izvode se iz domenskih tipova.

- [ ] Razrješavanje novosti iz adrese, provjera pripadnosti klubu i stanje kada novost ne postoji postoje u jednoj izvedbi.
- [ ] Naslov, opis, kanonska adresa i društveni podaci članka izvode se iz iste izvedbe u svakom klubu.
- [ ] Adresa članka ima jedan kanonski oblik, a ostali oblici vode na njega.
- [ ] Club app na toj stranici zadržava samo vlastiti vizualni prikaz.
- [ ] Vizualni identitet stranice novosti po klubu ostaje nepromijenjen.
- [ ] Ponašanje je pokriveno provjerom kroz zajedničko sučelje, a ne kroz pojedini app.

## Preostale stranice značajki slijede isti obrazac

**What to build:** Oprema, popis novosti i statistika igrača koriste istu zajedničku izvedbu dokazanu na stranici novosti, umjesto vlastite kopije po appu.

**Blocked by:** Stranica pojedine novosti izvodi se jednom, a klubovi biraju samo prikaz.

- [ ] Preostale stranice koje dijele isti obrazac koriste zajedničku izvedbu.
- [ ] Klupske razlike u nazivima ruta i prikazu i dalje su izražive bez kopiranja izvedbe.
- [ ] Nijedan Club app ne ponavlja razrješavanje podataka i metapodataka koje zajednička izvedba već nosi.
- [ ] Rubni slučajevi (nema sadržaja, sadržaj drugog kluba, nepostojeća adresa) ponašaju se jednako u svim klubovima.
- [ ] Vizualni identitet svake stranice po klubu ostaje nepromijenjen.
- [ ] Novi klub dobiva te stranice bez kopiranja logike.
