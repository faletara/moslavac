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
- **app-shell** — providers, shell routes, feedback states, and the club
  identity projection (`buildClubMetadata`, `ClubJsonLd`).
- **lib** — framework-free helpers shared by every Club app.
- **ui** — shadcn primitives plus shared app-level components.
- **pwa** — web app manifest builder; **ai** — Lexical rich-text helpers.

## Data layer terms

- **Domain type** — the shape a component consumes (`News`), distinct from the
  raw **Payload doc** / **HNS payload**. Mapping from raw → domain lives inside
  the `payload`/`hns` fetchers (no separate public adapter module).
- **One data path** — server components call `packages/payload` & `packages/hns`
  directly; nothing fetches data from the browser. The single route handler that
  serves the browser is `/api/images/[uuid]`, which proxies HNS crest bytes. See
  each app's `.claude/rules/api-architecture.md`.
