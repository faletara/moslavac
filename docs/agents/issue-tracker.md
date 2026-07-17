# Issue tracker: Local Markdown

Radni zadaci i PRD-ovi za ovaj repozitorij prate se lokalno u Markdownu.

## `to-tickets`

Kada `to-tickets` objavljuje odobreni plan, zapisuje jedan `tickets.md` u korijen repozitorija. Ticketi su poredani tako da su blokirajući zadaci navedeni prije zadataka koji o njima ovise.

## Ostali issue workflowi

- Jedan feature po direktoriju: `.scratch/<feature-slug>/`
- PRD: `.scratch/<feature-slug>/PRD.md`
- Implementacijski zadaci: `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numerirani od `01`
- Stanje se bilježi retkom `Status:` pri vrhu datoteke.
- Povijest razgovora dodaje se na kraj datoteke pod naslovom `## Comments`.

Kada drugi skill kaže "publish to the issue tracker", stvara datoteku unutar odgovarajućeg `.scratch/<feature-slug>/` direktorija.

## Wayfinding operations

- Mapa: `.scratch/<effort>/map.md`
- Ticket: `.scratch/<effort>/issues/NN-<slug>.md`
- Ovisnosti: redak `Blocked by: NN, NN`
- Ticket je na frontieru kada je otvoren, nije zauzet i svi su mu blokirajući ticketi riješeni.
- Preuzimanje: postaviti `Status: claimed` prije rada.
- Završetak: dodati odgovor pod `## Answer`, postaviti `Status: resolved` i zabilježiti odluku u mapi.
