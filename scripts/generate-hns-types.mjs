// Generates packages/types/src/hns.openapi.ts from the live HNS OpenAPI spec.
//
// Run: pnpm generate:hns-types
// Re-run whenever HNS may have changed their API — `git diff` on the generated
// file is our change alarm. The generated file is spec-faithful and must NOT be
// hand-edited.
//
// KNOWN SPEC BUGS: the published `live` spec disagrees with the actual API
// response in exactly one place (verified field-by-field against live data on
// 2026-07-09). We patch the fetched spec before codegen so the generated types
// match reality. Each entry below should also be reported upstream to Analyticom.
//   • Match.dateTimeUTC — spec says string(date-time); the API returns an
//     epoch-milliseconds number (e.g. 1780822800000). The whole app treats it
//     as a number (date arithmetic, sorting), so we generate it as int64.

import openapiTS, { astToString } from "openapi-typescript";
import { writeFile } from "node:fs/promises";

const SPEC_URL = "https://api-hns.analyticom.de/v3/api-docs/live";
const OUT = new URL("../packages/types/src/hns.openapi.ts", import.meta.url);

const KNOWN_SPEC_BUGS = [
  {
    path: ["components", "schemas", "Match", "properties", "dateTimeUTC"],
    // Keep the spec's description; only correct the type.
    patch: (node) => ({
      ...node,
      type: "integer",
      format: "int64",
    }),
  },
];

const res = await fetch(SPEC_URL, {
  headers: { "User-Agent": "moslavac-codegen", Accept: "application/json" },
});
if (!res.ok) {
  throw new Error(`HNS spec fetch failed: ${res.status} ${res.statusText}`);
}
const spec = await res.json();

for (const { path, patch } of KNOWN_SPEC_BUGS) {
  const parent = path.slice(0, -1).reduce((o, k) => o?.[k], spec);
  const key = path.at(-1);
  if (parent == null || !(key in parent)) {
    throw new Error(
      `Spec-bug patch target no longer exists: ${path.join(".")}. ` +
        `The upstream spec changed — re-verify against the live API and update KNOWN_SPEC_BUGS.`,
    );
  }
  parent[key] = patch(parent[key]);
}

// rootTypes emits spec-named aliases (`export type Match = components['schemas']['Match']`)
// so consumers import faithful spec names (`Match`, `Team`, `TeamRanking`) instead of the
// raw `components['schemas'][…]` indexing. These names come straight from the spec — not a
// hand-curated domain layer.
const ast = await openapiTS(spec, {
  rootTypes: true,
  rootTypesNoSchemaPrefix: true,
});
await writeFile(OUT, astToString(ast));
console.log(`Wrote ${OUT.pathname} (${KNOWN_SPEC_BUGS.length} spec-bug patch(es) applied)`);
