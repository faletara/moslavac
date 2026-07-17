# Domain Docs

Ova pravila određuju kako engineering skillovi čitaju domensku dokumentaciju repozitorija.

## Prije istraživanja

- Pročitati korijenski `CONTEXT.md`.
- Pročitati ADR-ove iz `docs/adr/` koji se odnose na područje rada.
- Ako neka datoteka ili direktorij ne postoji, nastaviti bez upozorenja i bez preventivnog stvaranja dokumentacije.

## Raspored

Repozitorij koristi single-context raspored:

```text
/
├── CONTEXT.md
├── docs/adr/
└── apps/
```

## Domenski rječnik

Naslovi ticketa, acceptance kriteriji, testovi i prijedlozi trebaju koristiti nazive definirane u `CONTEXT.md`. Ako pojam nije definiran, treba prvo provjeriti uvodi li se nepotreban sinonim ili postoji stvarna praznina u domenskom modelu.

## Sukobi s arhitektonskim odlukama

Ako prijedlog proturječi postojećem ADR-u, sukob treba jasno navesti umjesto tihog prepisivanja odluke.
