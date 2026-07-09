import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["packages/**/*.test.ts", "apps/cms/src/access/**/*.test.ts"],
  },
  resolve: {
    // Packages are consumed as raw source via `@/` tsconfig path aliases; mirror
    // those here so vitest resolves the same imports. `server-only` is stubbed
    // because it throws outside a React Server Component.
    alias: [
      { find: "server-only", replacement: here("./test/stubs/server-only.ts") },
      { find: /^@\/types\//, replacement: here("./packages/types/src/") },
      { find: /^@\/lib\/payload\//, replacement: here("./packages/payload/src/") },
      { find: /^@\/lib\/hns\//, replacement: here("./packages/hns/src/") },
    ],
  },
});
