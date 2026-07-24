# Domain glossary

Ubiquitous language for the multi-tenant clubs platform. Use these terms in code
and discussion.

## Platform & tenancy

- **Tenant** — one football club's record in the shared Payload CMS (`tenants`
  collection), keyed by `slug` (e.g. `moslavac`, `nk-vrapce`). Holds branding,
  contact, HNS keys, payment, legal, and enabled **ClubFeatures**. Frontends
  resolve their tenant from `PAYLOAD_TENANT_SLUG`.
- **ClubFeature** — a capability flag on a Tenant (`pages`, `documents`, `board`,
  `school`, `gallery`). A club-specific CMS collection declares the feature it
  serves; it appears in that club's admin only when the Tenant has the feature
  enabled. Onboarding a club's gallery is data (toggle `gallery`), not code.
  See `apps/cms/src/access/tenantScopedAdmin.ts`.
- **Club app** — a per-club Next.js frontend under `apps/<club>`: routes,
  components, club config. Thin over the shared platform layer.

## Platform layer (`packages/`)

The deep, shared modules every Club app consumes (see `packages/README.md`):

- **types** — domain types, the single source of truth (`News`, `Equipment`, …).
- **payload** — Payload CMS data layer; fetchers return domain types.
- **hns** — HNS (Croatian Football Federation) API client + fetchers.
- **app-shell** — the root shell (`ClubRootShell`) and its route factories
  (`clubMetadataRoute`, `clubManifestRoute`), providers, shell routes, feedback
  states, and the club identity projection (`buildClubMetadata`, `ClubJsonLd`,
  `buildClubManifest`).
- **config** — shared build config: `clubNextConfig` (security headers incl. CSP,
  image loader, turbopack root). Imported by relative path from an app's
  `next.config.ts`, which loads before the `@/` aliases apply.
- **lib** — framework-free helpers shared by every Club app.
- **ui** — shadcn primitives plus shared app-level components.
- **ai** — Lexical rich-text helpers.

A Club app's own knobs are few and named: `src/lib/siteUrl.ts` (dev port),
`src/lib/theme.ts` (`THEME_COLOR`, mirroring `globals.css` for the PWA chrome
bar), `globals.css`, its Header/Footer, and `app/icon.png` + `app/apple-icon.png`
at 256×256 and 180×180 — the sizes `buildClubManifest` declares.

## Data layer terms

- **Domain type** — the shape a component consumes (`News`), distinct from the
  raw **Payload doc** / **HNS payload**. Mapping from raw → domain lives inside
  the `payload`/`hns` fetchers (no separate public adapter module).
- **One data path** — server components call `packages/payload` & `packages/hns`
  directly; nothing fetches data from the browser. The single route handler that
  serves the browser is `/api/images/[uuid]`, which proxies HNS crest bytes. See
  each app's `.claude/rules/api-architecture.md`.
