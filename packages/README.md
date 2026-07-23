# Shared packages

The platform layer that every club frontend (`apps/moslavac`, `apps/sloga-mravince`,
`apps/nk-vrapce`, `apps/template`) shares. Previously each app carried a
byte-identical copy of all of this; it now lives here once.

| Package         | Concern                                                              |
| --------------- | ------------------------------------------------------------------- |
| `types/`        | Domain types — single source of truth (`News`, `Equipment`, HNS, …) |
| `payload/`      | Payload CMS data layer (`getNews`, `getTenant`, `getPages`, …)      |
| `hns/`          | HNS (Croatian FA) API client + fetchers (matches, standings, …)     |
| `app-shell/`    | Providers, shell routes, feedback states, club identity, sitemap/robots |
| `lib/`          | Framework-free helpers (date, match, competition, text, slug, …)    |
| `ui/`           | shadcn primitives (`button`, `card`, …) plus shared app-level bits   |
| `pwa/`          | Web app manifest builder                                             |
| `ai/`           | Lexical rich-text helpers                                            |

Dependency direction:

```
payload → types          hns → {types, payload}   (HNS keys come from the tenant)
lib     → types          ui  → hns                (crest URLs)
app-shell → {payload, hns, ui}   (seo/sources reads news + matches)
```

`types → payload` also exists, type-only: the domain types reuse `PayloadMedia`.
That is a type-level cycle with `payload → types` — harmless at runtime (erased at
compile time), but worth knowing before adding a value import in that direction.

## How apps consume these

Apps reference the packages through their existing `@/` import aliases — there is
**no import churn** in app code. Each app's `tsconfig.json` maps the data-layer
subpaths to here:

```jsonc
"paths": {
  "@/types/*":        ["../../packages/types/src/*"],
  "@/lib/payload/*":  ["../../packages/payload/src/*"],
  "@/lib/hns/*":      ["../../packages/hns/src/*"],
  "@/lib/app-shell/*":["../../packages/app-shell/src/*"],
  "@/lib/helpers/*":  ["../../packages/lib/src/helpers/*"],
  "@/*":              ["./src/*"]
}
```

So `import { fetchLatestNews } from "@/lib/payload/getNews"` resolves here, while
everything else (`@/lib/validate`, `@/components/*`, …) stays app-local. Next /
Turbopack honours these paths (turbopack `root` is the monorepo root), and the
package files themselves use `@/types/*` + relative imports, resolved the same way.

A club is now a thin `apps/<club>` (routes, components, club config) over this
shared layer.

## Verification

These are consumed as source (no build step, no `transpilePackages`). Typecheck
covers them transitively per app:

```bash
cd apps/<club> && npx tsc --noEmit -p tsconfig.json
```

## Follow-up (optional)

Promote to formal `@moslavac/*` workspace packages: add a `package.json` per
package, list them as `workspace:*` deps, add `transpilePackages` in each app's
`next.config.ts`, and swap the `@/` aliases for `@moslavac/*` imports. The source
is already cleanly separated, so this is mechanical.
