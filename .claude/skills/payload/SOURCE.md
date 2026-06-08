# Source / provenance

Vendored from the **official** Payload Claude plugin:
https://github.com/payloadcms/payload/tree/main/tools/claude-plugin/skills/payload

- License: MIT (Payload, info@payloadcms.com)
- Vendored on: 2026-06-06 (from `main`)

## How to update

Re-download SKILL.md and reference/*.md from the source path above, e.g.:

```sh
BASE="https://raw.githubusercontent.com/payloadcms/payload/main/tools/claude-plugin/skills/payload"
DEST=".claude/skills/payload"
curl -sf "$BASE/SKILL.md" -o "$DEST/SKILL.md"
for f in FIELDS COLLECTIONS HOOKS ACCESS-CONTROL ACCESS-CONTROL-ADVANCED QUERIES ADAPTERS ADVANCED; do
  curl -sf "$BASE/reference/$f.md" -o "$DEST/reference/$f.md"
done
```

This skill covers Payload in general. Project-specific conventions (tenant
scoping, per-club collections, deploy flow) live in `apps/cms/AGENTS.md`.
