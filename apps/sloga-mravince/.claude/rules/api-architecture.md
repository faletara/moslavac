---
description: How data reaches a component — the single server data path and the two browser route handlers (HNS images, live match)
globs: src/app/**/*.tsx,src/app/api/**/*.ts,src/components/**/*.tsx
alwaysApply: false
---

# Data architecture

How data reaches a component in a Club app. This describes what the code does —
keep it that way: if you build something new here, update this file in the same
change.

## One data path

Server Components call the data layer directly.

```
RSC ──► @/lib/payload/* | @/lib/hns/* ──► Payload CMS / HNS
```

- `packages/payload` and `packages/hns` are `server-only`. They own the fetch
  **and** the mapping from the raw Payload doc / HNS payload to a domain type in
  `packages/types`. A component never sees a raw shape.
- No React Query, no client data stack, and no HTTP round-trip from server code
  to this app's own route handlers. The one sanctioned browser fetch is the
  live-match route below.
- Server data stays fresh through `next: { revalidate }`, not a client cache.
  The live score on the match page is the one exception: it comes from the
  live-match route below, not from re-rendering the page.

Two route handlers exist to serve the browser:

- `app/api/images/[uuid]` proxies `fetchHnsImageBytes`, because HNS crest bytes
  cannot be fetched from the browser. Build its URL with `getCometImageUrl` from
  `@/lib/hns/imageUrl` — that module is deliberately free of `server-only` so
  client components can use it too.
- `app/api/utakmice/[id]/uzivo` returns a `LiveMatch` — see
  [The live-match path](#the-live-match-path-browser-polling).

## The live-match path: browser polling

The second data path to the browser, and the deliberate exception that
[If a client-side path is ever needed](#if-a-client-side-path-is-ever-needed)
allows. Why it exists: `docs/adr/0003-ruta-za-utakmicu-uzivo.md` (Vercel Fluid
Active CPU — re-rendering every match page every 30 s for a live score).

```
browser ──► GET /api/utakmice/[id]/uzivo ──► fetchLiveMatch ──► HNS
              (CDN: s-maxage=30, shared by all visitors)
```

- `LiveMatch` (`packages/types/src/hns.ts`) is only what changes during a match:
  score, `liveStatus`, minute, events, lineups. Teams, standings, referees,
  JSON-LD and metadata stay server-rendered.
- `fetchLiveMatch` (`packages/hns/src/matches.ts`) does the fetch **and** the
  mapping, with a 30 s TTL. It returns `null` for an unknown match and throws
  `HnsUnavailableError` when any HNS call fails — never a partial state.
- The route handler is three lines; the logic is **one** shared factory
  (`createLiveMatchRoute` in `packages/hns/src/liveMatchRoute.ts`):
  - 200 + `LiveMatch` JSON with
    `Cache-Control: public, s-maxage=30, stale-while-revalidate=30`;
  - 400 for an id that is not a positive integer, without calling HNS;
  - 404 for an unknown match, 502 when HNS fails — both `no-store`.
- Exposed by `sloga-mravince`. Another club opts in by adding the same
  three-line `route.ts`; it never writes its own handler or mapping.
- The browser side is **one** shared hook, `useLiveMatch` in
  `packages/ui/src/use-live-match.ts`: it starts from the server-rendered
  `LiveMatch`, and polls the route every 30 s only while `liveFetchPlan`
  (`packages/hns/src/livePolling.ts`, pure and tested) says so — from 60 min
  before kick-off until `PLAYED`, at most 3 h after. Past that window, a page
  whose cached HTML is not `PLAYED` fetches once — unless `liveStatus` is
  `null` (HNS does not track the match, so it never turns `PLAYED`): such a
  match polls in the window but fetches nothing after it. Played, called-off
  and distant matches fetch nothing. Paused on a hidden tab; a failed fetch
  keeps the last state.
- The match page (`raspored-i-rezultati/[slug]`) is static (`revalidate =
  86400`) and passes the same 1-day TTL to every HNS fetcher it calls, so a
  short fetcher default cannot cap it.

## The CMS-to-app path: cache revalidation

`app/api/revalidate` is an **inbound** webhook, not a round-trip: the CMS calls
it, this app never calls itself.

```
Payload afterChange ──► apps/cms/src/lib/revalidateFrontend
                          ──► POST <tenant.siteUrl>/api/revalidate
                                ──► revalidateTag / revalidatePath
```

- Without it, content refreshes only when its TTL expires, and Next serves the
  stale page until then — a published article stayed invisible until somebody
  hard-refreshed.
- The route handler is three lines; the logic is **one** shared factory
  (`packages/app-shell/src/cache/revalidateRoute.ts`).
- Tag names come from `collectionCacheTag`
  (`packages/payload/src/cacheTags.ts`) — the same module the CMS calls — so the
  two sides cannot drift apart silently.
- `REVALIDATE_SECRET` must match the CMS. An unset secret closes the route.

## Adding a fetch

1. Add or extend a fetcher in `packages/payload/src/*` or `packages/hns/src/*`.
2. Return a domain type from `packages/types` — do the mapping inside the
   fetcher, never in a route handler or a component.
3. Call it directly from the Server Component that needs it.
4. A page-facing HNS fetcher accepts `HnsCacheOptions`
   (`packages/hns/src/fetchResource.ts`) and the page passes its own
   `revalidate` (or `ONE_DAY_TTL` from `@/lib/helpers/cacheTtl` for a 1-day
   page). Next caches a page for the shortest TTL on it, so a fetcher's short
   default would otherwise cap the page's `revalidate`.

Both packages are tested through their interface with an injected transport
(`context.ts`), so a new fetcher gets a test without touching the network.

## If a client-side path is ever needed

The live-match route above is the only browser data fetch in the platform. If
another feature genuinely requires one (optimistic writes, polling that server
revalidation cannot express), build **one** shared adapter in `packages/`,
record why in an ADR, and document it here — do not add a per-app client data
stack.

## Do NOT

- Round-trip from server code through this app's own `app/api/*`.
- Map Payload/HNS shapes inside route handlers or components — map in the data
  layer so it returns domain types.
- Duplicate a fetcher or a mapping into an app; it belongs in `packages/`.
- Use `any` for a response, or declare a type that duplicates `packages/types`.
