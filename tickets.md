# Tickets: Fokusirana početna stranica Moslavca

Ovi ticketi korak po korak usklađuju početnu stranicu sa službenom ulogom kluba: brzo informirati publiku i povećati dolazak na utakmice. Temelje se na product briefu, dizajnerskom sustavu i Impeccable kritici početne stranice.

Work the **frontier**: može se uzeti bilo koji ticket čiji su blokirajući ticketi završeni. Dogovoreni redoslijed rada počinje s herojem i nastavlja se jedan ticket po jedan.

## Sljedeća utakmica postaje primarni put iz heroja

**What to build:** Posjetitelj iz heroja dobiva izravan, vjerodostojan put prema sljedećoj utakmici i informacijama potrebnima za dolazak, dok se momčad zadržava kao sekundarna destinacija.

**Blocked by:** None — can start immediately.

- [ ] Primarna hero akcija glasi „Pogledaj sljedeću utakmicu” i vodi do aktualnog prikaza sljedeće utakmice.
- [ ] Kada je utakmica dostupna, posjetitelj bez dodatnog traženja može saznati datum, protivnika i lokaciju.
- [ ] Kada sljedeća utakmica nije dostupna, hero prikazuje smisleno stanje bez mrtve ili lažne poveznice.
- [ ] Put prema momčadi ostaje dostupan kao sekundarna akcija bez konkuriranja primarnoj konverziji.
- [ ] Product i design pravila više si ne proturječe oko primarnog puta iz heroja.
- [ ] Akcije imaju vidljiv fokus i rade tipkovnicom na mobilnom i desktop prikazu.

## YouTube akcija prikazuje se samo kada postoji odredište

**What to build:** YouTube ostaje završni sadržaj početne stranice, ali poziv na kanal ponaša se iskreno i predvidljivo bez obzira na to je li URL već konfiguriran.

**Blocked by:** None — can start immediately.

- [ ] S konfiguriranim URL-om korisnik dobiva ispravnu vanjsku poveznicu prema YouTube kanalu.
- [ ] Bez konfiguriranog URL-a ne postoji akcija koja vodi na `#`, vraća korisnika na vrh ili se lažno predstavlja kao aktivna.
- [ ] Prazno stanje zadržava vizualni ritam sekcije i jasno komunicira da kanal još nije dostupan.
- [ ] YouTube ostaje posljednja sekcija početne stranice.
- [ ] Crvena boja ostaje ograničena na YouTube kontekst i ne prelazi u klupske CTA-ove ili dekoraciju.

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
