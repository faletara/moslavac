---
Status: accepted
---

# CMS admin je namijenjen netehničkim vlasnicima klubova

Payload admin uređuju vlasnici/urednici klubova (netehnički korisnici), ne developeri.
Zato editorska konfiguracija slijedi tri pravila: **hrvatski-first** (svako polje, grupa i
tab ima eksplicitni hrvatski `label`, a opisi su bez tehničkog žargona — nema
"URL-safe identifier", "schema.org addressRegion", "API_KEY header"); **platformska
polja se skrivaju** od vlasnika kluba (`slug`, `active`, `features` i cijeli HNS tab na
`tenants` vidljivi su samo super-adminu, jer njihova promjena razbija razrješavanje
tenanta ili integraciju); i **minimalno trenje pri unosu** (obavezna su samo polja koja
se stvarno prikazuju).

## Posljedice

- **Alt tekst slika je neobavezan** i auto-generira se iz naziva datoteke (`Media.alt`
  više nije `required`; `beforeValidate` hook popuni ga ako je prazan). Kompromis:
  svjesno biramo manje trenja pri uploadu naspram uvijek ručno pisanog alt teksta;
  SEO/pristupačnost se zadržava kroz auto-vrijednost koju editor može prepisati.
- **Polje smije postojati samo ako se prikazuje na frontendu.** Polja koja editor
  popunjava a nigdje se ne renderiraju (bila su: `Equipment.name`, `Equipment.description`,
  `BoardMembers.bio`, `Media.caption`) uklanjaju se. Novo polje u shemi ide zajedno s
  mjestom prikaza, inače je višak koji zbunjuje editora.
- Novi razvoj: kad se dodaje tenant-postavka koju platforma održava (ne klub), gura se
  iza `isSuperAdmin` uvjeta, ne ostavlja vlasniku.
