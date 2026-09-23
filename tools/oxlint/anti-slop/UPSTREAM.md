# anti-slop — provenance

- **Source repository:** https://github.com/dmmulroy/anti-slop
- **Source revision:** `c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b`
  Recorded from the `install-anti-slop` skill that shipped these assets
  (`/Users/adrianofaletar/.claude/skills/install-anti-slop`, source comment at the
  end of its `SKILL.md`). The copied files were not diffed against that commit, so
  treat the revision as the skill's declared source rather than a verified match.
- **Installed:** 2026-09-22
- **Copied by:** `node <skill>/scripts/install.mjs` (no `--force`, no pre-existing copy)

## Installed paths

- `tools/oxlint/anti-slop/index.ts` — generic plugin entry point (registered as `anti-slop`)
- `tools/oxlint/anti-slop/rules/` — 18 generic rules
- `tools/oxlint/anti-slop/shared/` — shared AST/scope helpers
- `tools/oxlint/anti-slop/effect/` — opt-in Effect plugin (**not registered**)
- `tools/oxlint/anti-slop/vendor/eslint-stylistic/` — vendored readability rule, with its
  own `LICENSE` and `UPSTREAM.md`

## Intentional deviations

- The Effect plugin is copied but **not** registered. This repo declares no direct
  `effect` dependency in any package manifest.
- `.oxlintrc.json` (repo root) adds repo-specific ignores beyond the skill's list:
  `.turbo/**`, `**/.next/**`, `**/dist/**`, and three generated files —
  `packages/types/src/hns.openapi.ts`, `apps/cms/src/payload-types.ts`,
  `apps/cms/src/app/(payload)/admin/importMap.js`.
- Root script `lint:oxlint` runs Oxlint. The existing `lint` script (`turbo run lint`,
  ESLint per app) is unchanged; Oxlint runs alongside it, not instead of it.

## Cleanup (2026-09-23)

Run on request: **1483 findings → 8**. `require-readable-spacing` (1193) was fixed
with `oxlint --fix`; everything else by hand. The largest structural change was a
zod parse layer at the two I/O boundaries — `packages/payload/src/schemas.ts` and
`packages/hns/src/schemas.ts` — which normalises Payload media and tenant
relations into `MediaImage` and removes ~30 representation checks from components.
`zod@^4.6.5` was added as a direct dependency of every app plus the workspace root.

## Remaining findings (8)

Each is imposed by a third-party type; none can be fixed without breaking a
contract this repo does not own. Every site carries a comment naming the rule
and the constraint.

- `packages/ai/src/lexical.ts` — 5× `no-unsafe-dictionary-type`. Payload's
  generated `payload-types.ts` types the `content` richText column as
  `{ [k: string]: unknown; root: { … children: { [k: string]: unknown; … }[] } }`.
  Removing the index signatures was tried and breaks `seed-news.ts` and
  `matchReportsStore.ts` at compile time.
- `apps/cms/src/lib/hnsDispatcher.ts` — 2× `no-runtime-typeof`. Node's
  `dns.lookup` has two overloads whose only difference is whether the second
  argument is the callback.
- `apps/cms/src/factories/clubFeatureCollection.ts` — 1× `no-runtime-typeof`.
  Payload types `admin.hidden` as `((args) => boolean) | boolean` with no
  discriminator.

`pnpm lint:oxlint` therefore still exits 1.

## Dependencies

`oxlint@1.85.0` and `@oxlint/plugins@1.85.0`, both pinned exactly as root dev
dependencies. Upgrade them together.
