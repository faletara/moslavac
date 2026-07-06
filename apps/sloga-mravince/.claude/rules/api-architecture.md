---
description: API layer architecture pattern for React Query hooks, query keys, and data fetching organization
globs: src/lib/api/**/*.ts
alwaysApply: false
---

# API Architecture Pattern

This rule defines how data fetching, React Query hooks, query keys, and route handlers are organized. Follow this pattern for ALL new API-related code and when refactoring existing code.

## Two data paths

There are exactly two ways data reaches a component. Keep them separate.

1. **Server Components** call the data layer in `src/lib/payload/*` and `src/lib/hns/*` **directly**. No HTTP, no React Query, no indirection. These `lib/` modules are `server-only` and return domain types from `src/types/`.
2. **Client Components** call React Query hooks (`api.{entity}.useGetX()`). The hook's `queryFn` does an `apiFetch` HTTP call to a route handler under `app/api/*`, which in turn calls the same `lib/` function and returns the domain type as JSON.

> The browser cannot import `server-only` `lib/` code, so client data must go over HTTP through a route handler. Server code has no such constraint — it must NOT round-trip through its own route handlers.

```
Server:  RSC ──────────────────────────────► lib/payload | lib/hns ──► CMS / HNS
Client:  use{X}() ─► React Query ─► apiFetch ─► app/api/* route ─► lib/payload | lib/hns
```

## Stack Context

- **HTTP client (browser)**: native fetch via `src/lib/api/client.ts` (`apiFetch` wrapper)
- **Server state**: `@tanstack/react-query` v5
- **Query key factory**: `@lukemorales/query-key-factory`
- **Domain types**: manually maintained in `src/types/` — single source of truth
- **Data layer**: `src/lib/payload/*` (Payload CMS) and `src/lib/hns/*` (HNS API). These own the fetch + domain mapping and return domain types.

## Directory Structure

One file per entity. No per-entity directories, no barrels, no `serverApi`.

```
src/lib/api/
├── client.ts             # apiFetch wrapper (native fetch)
├── errors.ts             # ApiError class
├── images.ts             # getCometImageUrl utility
├── queries.ts            # mergeQueryKeys aggregator (merges every {entity}Queries)
├── api.ts                # api object aggregator (client hooks)
├── index.ts              # entry point — exports { api, queries, getCometImageUrl }
└── {entity}.client.ts    # one file per entity: HTTP fetchers + query keys + hooks + {entity}Api
```

## Core Principles

### 1. Server calls lib directly; client goes over HTTP

- **Server Components** import the fetch function straight from `@/lib/payload/*` or `@/lib/hns/*`.
- **Client Components** use `api.{entity}.useGetX()`.
- The HTTP fetchers in `{entity}.client.ts` are **private** — only the query-key `queryFn` uses them. Do not export them; do not call them from server code.

### 2. The route handler is the browser's only entry to the data layer

- Each `app/api/*` route handler is thin: parse/validate params, call the `lib/` function, `return Response.json(...)`.
- The `lib/` function returns the domain type, so the route handler does no mapping.

### 3. Single source for query keys

- **Always use** `createQueryKeys` from `@lukemorales/query-key-factory` in `{entity}.client.ts`.
- **Always register** `{entity}Queries` in `src/lib/api/queries.ts` via `mergeQueryKeys`.
- Hooks reference the **local** `{entity}Queries` (same file) — never import the merged `queries` back into a `{entity}.client.ts` (it would create an import cycle). Keys are identical either way.
- **Never** define query keys as raw strings in components. Use `{ matchId }` object params, never bare primitives.

### 4. Consistent error handling

- `apiFetch` throws `ApiError` automatically on non-ok responses.
- Let query errors propagate naturally to React Query.
- Do NOT catch errors in fetch functions (except boolean-returning checks).

## Implementation Pattern

### Entity module (`{entity}.client.ts`)

Private HTTP fetchers, then query keys that reference them, then hooks, then the `{entity}Api` object:

```typescript
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { News, PaginatedNews } from "@/types/news";

// Private — browser → route handler. Server components call lib/ directly.
async function fetchLatestNews(): Promise<News[]> {
  return apiFetch.get<News[]>("/api/news/latest");
}

async function fetchNewsPaginated(params: {
  page: number;
  size: number;
}): Promise<PaginatedNews> {
  return apiFetch.get<PaginatedNews>(
    `/api/news?page=${params.page}&size=${params.size}`,
  );
}

export const newsQueries = createQueryKeys("news", {
  latest: () => ({ queryKey: ["latest"], queryFn: fetchLatestNews }),
  paginated: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [{ page, size }],
    queryFn: () => fetchNewsPaginated({ page, size }),
  }),
});

export function useGetLatestNews(props?: { enabled?: boolean }) {
  return useQuery({ ...newsQueries.latest(), enabled: props?.enabled });
}

export function useGetNewsPaginated({
  page,
  size,
  enabled,
}: {
  page: number;
  size: number;
  enabled?: boolean;
}) {
  return useQuery({ ...newsQueries.paginated({ page, size }), enabled });
}

export const newsApi = {
  useGetLatestNews,
  useGetNewsPaginated,
};
```

### Route handler (`app/api/{...}/route.ts`)

Thin. Validate, call lib, serialize. The lib function already returns the domain type.

```typescript
import { fetchLatestNews } from "@/lib/payload/getNews";

export async function GET() {
  return Response.json(await fetchLatestNews());
}
```

```typescript
import type { NextRequest } from "next/server";
import { fetchNewsById } from "@/lib/payload/getNews";
import { tenantSlug } from "@/lib/payload/getTenant";
import { isNumericId } from "@/lib/validate";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/news/[id]">,
) {
  const { id } = await ctx.params;
  if (!isNumericId(id)) return new Response("News not found", { status: 404 });
  const news = await fetchNewsById({ id });
  if (!news || news.tenantId !== tenantSlug) {
    return new Response("News not found", { status: 404 });
  }
  return Response.json(news);
}
```

### Mutation hook (in `{entity}.client.ts`)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { VoteOutcome } from "@/types/vote";

export function useCreateVote({ matchId }: { matchId: number }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { voterId: string; outcome: VoteOutcome }) =>
      apiFetch.post(`/api/matches/${matchId}/votes`, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchesQueries._def });
    },
  });
}
```

### Central registration

**`src/lib/api/queries.ts`:**
```typescript
import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { newsQueries } from "./news.client";
import { matchesQueries } from "./matches.client";

export const queries = mergeQueryKeys(newsQueries, matchesQueries);
```

**`src/lib/api/api.ts`:**
```typescript
import { newsApi } from "./news.client";
import { matchesApi } from "./matches.client";

export const api = {
  news: newsApi,
  matches: matchesApi,
};
```

**`src/lib/api/index.ts`:**
```typescript
export { api } from "./api";
export { queries } from "./queries";
export { getCometImageUrl } from "./images";
```

## Component Usage

### Server component — call lib directly:
```typescript
import { fetchNewsBySlug } from "@/lib/payload/getNews";

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const news = await fetchNewsBySlug({ slug: id });
}
```

### Client component — hooks:
```typescript
"use client";
import { api } from "@/lib/api";

function LatestNewsSection() {
  const { data, isLoading } = api.news.useGetLatestNews();
}
```

### Conditional query:
```typescript
const { data } = api.matches.useGetMatchInfo({ matchId, enabled: !!matchId });
```

### Query invalidation:
```typescript
import { queries } from "@/lib/api";

queryClient.invalidateQueries({ queryKey: queries.news._def });
```

## Naming Conventions

| Concept | Pattern | Example |
|---|---|---|
| Entity module | `{entity}.client.ts` | `news.client.ts` |
| Private HTTP fetcher | `fetch{Entity}` | `fetchLatestNews` |
| Query store | `{entity}Queries` | `newsQueries` |
| Hooks object | `{entity}Api` | `newsApi` |
| Hook name | `useGet{Entity}` / `useCreate{Entity}` | `useGetLatestNews` |
| Query key param | object form | `{ matchId }` not `matchId` |

## Do

- Server components: import data functions directly from `@/lib/payload/*` / `@/lib/hns/*`.
- Keep route handlers thin: validate → call lib → `Response.json`.
- Keep domain mapping in the `lib/` layer so it returns domain types.
- Use `createQueryKeys` for all query definitions; register in `queries.ts`.
- Hooks reference the local `{entity}Queries`.
- Use object params for all hooks, fetch functions, and query factories.
- Let errors propagate (don't catch in fetch functions or queryFn).
- Annotate return types on all fetch functions.
- Use `queries.{entity}._def` for broad invalidation.
- Keep types in `src/types/` as single source of truth.

## Do NOT

- Call route handlers (`apiFetch`) from server components — call `lib/` directly. Server code must never HTTP round-trip to its own `app/api/*`.
- Re-introduce a `serverApi` facade, per-entity directories, `api_hooks/`, or barrel `index.ts` files.
- Export the private HTTP fetchers from `{entity}.client.ts`.
- Import the merged `queries` into a `{entity}.client.ts` (import cycle) — use the local `{entity}Queries`.
- Map Payload/HNS shapes inside route handlers or components — do it in `lib/`.
- Use Axios — use `apiFetch` (native fetch wrapper).
- Define query keys as string arrays in components, or construct keys outside the factory.
- Pass primitive parameters to hooks — use `{ matchId }` not `matchId`.
- Put UI logic (toasts, redirects) inside hooks.
- Use `any` for API response types, or create types that duplicate `src/types/`.
