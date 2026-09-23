---
description: How data reaches a component — the single server data path and the one image route handler
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
- No React Query, no client-side data fetching, and no HTTP round-trip from
  server code to this app's own route handlers.
- Live data stays fresh through server re-fetching (`next: { revalidate }` plus
  `<RefreshWhile>` from `@/components/ui/refresh-while`), not a client cache.

There is exactly one route handler that exists to serve the browser:
`app/api/images/[uuid]` proxies `fetchHnsImageBytes`, because HNS crest bytes
cannot be fetched from the browser. Build its URL with `getCometImageUrl` from
`@/lib/hns/imageUrl` — that module is deliberately free of `server-only` so
client components can use it too.

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
- `REVALIDATE_SECRET` is this club's own secret, not the CMS's: the CMS derives
  it as HMAC-SHA256(its `REVALIDATE_SECRET`, tenant slug) and sends it as the
  bearer. The route compares it in constant time. A credential issued to
  another club gets 401, and an unset secret closes the route. How to compute
  it: `docs/NEW-CLUB.md`.
- The CMS only calls an https origin whose host is in its
  `REVALIDATE_ALLOWED_HOSTS`, always at `/api/revalidate`, and does not follow
  redirects. A club missing from that list is skipped.

## Adding a fetch

1. Add or extend a fetcher in `packages/payload/src/*` or `packages/hns/src/*`.
2. Return a domain type from `packages/types` — do the mapping inside the
   fetcher, never in a route handler or a component.
3. Call it directly from the Server Component that needs it.

Both packages are tested through their interface with an injected transport
(`context.ts`), so a new fetcher gets a test without touching the network.

## If a client-side path is ever needed

Nothing in the platform fetches data from the browser today. If a feature
genuinely requires it (optimistic writes, polling that server revalidation
cannot express), build **one** shared adapter in `packages/` and document it
here — do not add a per-app client data stack.

## Do NOT

- Round-trip from server code through this app's own `app/api/*`.
- Map Payload/HNS shapes inside route handlers or components — map in the data
  layer so it returns domain types.
- Duplicate a fetcher or a mapping into an app; it belongs in `packages/`.
- Use `any` for a response, or declare a type that duplicates `packages/types`.
