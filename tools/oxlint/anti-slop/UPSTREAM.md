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
- No findings were fixed at install time. Cleanup was not requested.

## Dependencies

`oxlint@1.85.0` and `@oxlint/plugins@1.85.0`, both pinned exactly as root dev
dependencies. Upgrade them together.
