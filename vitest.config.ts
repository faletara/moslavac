import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    // Every Club app is covered by the same glob, so a new club is picked up
    // without editing this file — divergence between clubs cannot hide from CI.
    include: [
      "packages/**/*.test.ts",
      "apps/*/src/**/*.test.ts",
      "apps/*/src/**/*.test.tsx",
    ],
  },
  resolve: {
    // Packages are consumed as raw source via `@/` tsconfig path aliases; mirror
    // those here so vitest resolves the same imports. `server-only` is stubbed
    // because it throws outside a React Server Component.
    alias: [
      { find: "server-only", replacement: here("./test/stubs/server-only.ts") },
      {
        find: "@/components/animations",
        replacement: here("./packages/ui/src/animations/index.ts"),
      },
      {
        find: /^@\/components\/analytics\//,
        replacement: here("./packages/ui/src/analytics/"),
      },
      { find: "@/lib/utils", replacement: here("./packages/ui/src/utils.ts") },
      { find: /^@\/types\//, replacement: here("./packages/types/src/") },
      { find: /^@\/lib\/payload\//, replacement: here("./packages/payload/src/") },
      { find: /^@\/lib\/hns\//, replacement: here("./packages/hns/src/") },
      {
        find: /^@\/lib\/app-shell\//,
        replacement: here("./packages/app-shell/src/"),
      },
      {
        find: /^@\/lib\/helpers\//,
        replacement: here("./packages/lib/src/helpers/"),
      },
      {
        find: /^@\/components\/ui\//,
        replacement: here("./packages/ui/src/"),
      },
    ],
  },
});
