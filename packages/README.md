# Shared packages

The platform layer that every club frontend (`apps/moslavac`, `apps/nk-vrapce`,
`apps/template`) shares. Previously each app carried a byte-identical copy of all
of this; it now lives here once.

| Package         | Concern                                                              |
| --------------- | ------------------------------------------------------------------- |
| `types/`        | Domain types — single source of truth (`News`, `Equipment`, HNS, …) |
| `payload/`      | Payload CMS data layer (`getNews`, `getTenant`, `getPages`, …)      |
| `hns/`          | HNS (Croatian FA) API client + fetchers (matches, standings, …)     |
| `api/`          | Client-side React Query hooks + query keys (`api`, `queries`)       |
| `ui/`           | shadcn UI primitives (`button`, `card`, …); radius is theme-driven   |

Dependency direction: `types ← {payload, hns, api}`, plus `hns → payload`
(HNS keys come from the tenant config). No cycles between concerns.

## How apps consume these

Apps reference the packages through their existing `@/` import aliases — there is
**no import churn** in app code. Each app's `tsconfig.json` maps the data-layer
subpaths to here:

```jsonc
"paths": {
  "@/types/*":        ["../../packages/types/src/*"],
  "@/lib/payload/*":  ["../../packages/payload/src/*"],
  "@/lib/hns/*":      ["../../packages/hns/src/*"],
  "@/lib/api":        ["../../packages/api/src/index"],
  "@/lib/api/*":      ["../../packages/api/src/*"],
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
