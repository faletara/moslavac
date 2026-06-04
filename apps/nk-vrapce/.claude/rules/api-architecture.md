---
description: API layer architecture pattern for React Query hooks, query keys, and fetch endpoint organization
globs: src/lib/api/**/*.ts
alwaysApply: false
---

# API Architecture Pattern

This rule defines how API endpoints, React Query hooks, query keys, and types are organized. Follow this pattern for ALL new API-related code and when refactoring existing code.

## Stack Context

- **HTTP client**: Native fetch via `src/lib/api/client.ts` (`apiFetch` wrapper with `baseURL` and `X-Tenant-ID`)
- **Server state**: `@tanstack/react-query` v5
- **Query key factory**: `@lukemorales/query-key-factory`
- **Types**: Manually maintained in `src/types/`

## Directory Structure

```
src/lib/api/
├── client.ts                          # apiFetch wrapper (native fetch)
├── errors.ts                          # ApiError class
├── images.ts                          # getCometImageUrl utility
├── queries.ts                         # mergeQueryKeys aggregator
├── api.ts                             # api object aggregator (client hooks)
├── serverApi.ts                       # serverApi object aggregator (server fetch functions)
├── index.ts                           # Package entry point
├── {entity}/
│   ├── api_hooks/
│   │   ├── useGet{Entity}.ts          # Individual hook file per operation
│   │   ├── useGet{Entity}ById.ts
│   │   └── useCreate{Entity}.ts
│   ├── {entity}.queries.ts            # Named fetch functions + createQueryKeys (queryFn calls fetch functions)
│   ├── {entity}.api.ts                # Hook registration only (imports from api_hooks/)
│   ├── {entity}.serverApi.ts          # Server fetch function registration (imports from queries)
│   └── index.ts                       # Barrel export
```

## Core Principles

### 1. No Duplication Between Server and Client

- **Always export** named async fetch functions from `{entity}.queries.ts`
- **queryFn** calls those same functions — no duplicated fetch logic
- **Server Components** use `serverApi.{entity}.fetchX()` (aggregated in `serverApi.ts`)
- **Client Components** use `api.{entity}.useGetX()` hooks (which internally use the same fetch functions via queryFn)

### 2. Centralized Query Keys

- **Always use** `createQueryKeys` from `@lukemorales/query-key-factory` in `{entity}.queries.ts`
- **Always register** entity queries in `src/lib/api/queries.ts` via `mergeQueryKeys`
- **Never define** query keys as raw strings in components
- **Always use** object params `{ matchId }`, never bare primitives

### 3. Hook-Based Client API Access

- **Always export** hooks via entity `{entity}.api.ts` object
- **Always register** entity API in `src/lib/api/api.ts`
- Components use `api.news.useGetLatestNews()` pattern
- Query invalidation uses `queries.news._def`

### 4. Consistent Error Handling

- `apiFetch` throws `ApiError` automatically on non-ok responses
- Let query errors propagate naturally to React Query
- Do NOT catch errors in fetch functions (except boolean-returning checks like `fetchHasVoted`)

## Implementation Pattern

### Step 1: Fetch Functions + Query Definitions (`{entity}.queries.ts`)

Export named async functions first, then create query keys that reference them:

```typescript
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { apiFetch } from "../client";
import type { News, PaginatedNews } from "@/types/news";

export async function fetchLatestNews(): Promise<News[]> {
  return apiFetch.get<News[]>("/api/v1/news/latest");
}

export async function fetchNewsPaginated(params: {
  page: number;
  size: number;
}): Promise<PaginatedNews> {
  return apiFetch.get<PaginatedNews>(
    `/api/v1/news?page=${params.page}&size=${params.size}`,
  );
}

export async function fetchNewsDetail(params: {
  newsId: number;
}): Promise<News> {
  return apiFetch.get<News>(`/api/v1/news/${params.newsId}`);
}

export const newsQueries = createQueryKeys("news", {
  latest: () => ({
    queryKey: ["latest"],
    queryFn: fetchLatestNews,
  }),
  paginated: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [{ page, size }],
    queryFn: () => fetchNewsPaginated({ page, size }),
  }),
  detail: ({ newsId }: { newsId: number }) => ({
    queryKey: [newsId],
    queryFn: () => fetchNewsDetail({ newsId }),
  }),
});
```

**Key points:**
- Fetch functions are exported and reusable (server components, queryFn, anywhere)
- queryFn references the fetch functions — no duplicated API calls
- Use `apiFetch.get<T>()` / `apiFetch.post<T>()` from the native fetch wrapper
- Use object params: `(params: { page: number; size: number })`
- Always annotate return types explicitly
- Do NOT catch errors in fetch functions — let them propagate

### Step 2: Individual Hook Files (`api_hooks/use*.ts`)

Each hook lives in its own file inside `api_hooks/`:

```typescript
// api_hooks/useGetLatestNews.ts
import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetLatestNewsProps = {
  enabled?: boolean;
};

export function useGetLatestNews(props?: UseGetLatestNewsProps) {
  return useQuery({
    ...queries.news.latest(),
    enabled: props?.enabled,
  });
}
```

```typescript
// api_hooks/useGetNewsPaginated.ts
import { useQuery } from "@tanstack/react-query";
import { queries } from "../../queries";

type UseGetNewsPaginatedProps = {
  page: number;
  size: number;
  enabled?: boolean;
};

export function useGetNewsPaginated({ page, size, enabled }: UseGetNewsPaginatedProps) {
  return useQuery({
    ...queries.news.paginated({ page, size }),
    enabled,
  });
}
```

**Key points:**
- One hook per file inside `api_hooks/`
- Hooks spread query options from `queries` object
- Accept a SINGLE object parameter with explicit named type
- Optional `enabled` prop for conditional queries

### Step 2.5: Hook Registration (`{entity}.api.ts`)

The api file only registers hooks — no logic:

```typescript
// news.api.ts
import { useGetLatestNews } from "./api_hooks/useGetLatestNews";
import { useGetNewsPaginated } from "./api_hooks/useGetNewsPaginated";

export const newsApi = {
  useGetLatestNews,
  useGetNewsPaginated,
};
```

### Step 2.6: Server API Registration (`{entity}.serverApi.ts`)

Each entity has a serverApi file that registers fetch functions:

```typescript
// news.serverApi.ts
import {
  fetchLatestNews,
  fetchNewsPaginated,
  fetchNewsDetail,
} from "./news.queries";

export const newsServerApi = {
  fetchLatestNews,
  fetchNewsPaginated,
  fetchNewsDetail,
};
```

### Step 3: Mutation Hooks (`api_hooks/useCreate{Entity}.ts`)

Mutation hooks also live in `api_hooks/`, same as query hooks:

```typescript
// api_hooks/useCreateVote.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../client";
import { queries } from "../../queries";
import type { VoteOutcome } from "@/types/vote";

type UseCreateVoteProps = {
  matchId: number;
};

export function useCreateVote({ matchId }: UseCreateVoteProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { voterId: string; outcome: VoteOutcome }) => {
      return apiFetch.post(`/api/v1/matches/${matchId}/votes`, {
        voterId: params.voterId,
        outcome: params.outcome,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.votes._def,
      });
    },
  });
}
```

### Step 4: Register in Centralized Files

**`src/lib/api/queries.ts`:**
```typescript
import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { newsQueries } from "./news/news.queries";
import { matchesQueries } from "./matches/matches.queries";

export const queries = mergeQueryKeys(newsQueries, matchesQueries);
```

**`src/lib/api/api.ts`** (client hooks):
```typescript
import { newsApi } from "./news/news.api";
import { matchesApi } from "./matches/matches.api";

export const api = {
  news: newsApi,
  matches: matchesApi,
};
```

**`src/lib/api/serverApi.ts`** (server fetch functions — registration only):
```typescript
import { newsServerApi } from "./news/news.serverApi";
import { matchesServerApi } from "./matches/matches.serverApi";

export const serverApi = {
  news: newsServerApi,
  matches: matchesServerApi,
};
```

**`src/lib/api/index.ts`:**
```typescript
export { api } from "./api";
export { queries } from "./queries";
export { serverApi } from "./serverApi";
export { getCometImageUrl } from "./images";
```

## Component Usage

### Client component (hooks):
```typescript
import { api } from "@/lib/api";

function LatestNewsSection() {
  const { data, isLoading } = api.news.useGetLatestNews();
}
```

### Server component (serverApi):
```typescript
import { serverApi } from "@/lib/api";

export default async function NewsDetailPage({ params }: Props) {
  const news = await serverApi.news.fetchNewsDetail({ newsId: Number(id) });
}
```

### Conditional query:
```typescript
import { api } from "@/lib/api";

function MatchDetail({ matchId }: { matchId: number }) {
  const { data } = api.matches.useGetMatchInfo({
    matchId,
    enabled: !!matchId,
  });
}
```

### Query invalidation:
```typescript
import { queries } from "@/lib/api";

queryClient.invalidateQueries({ queryKey: queries.news._def });
```

## Naming Conventions

| Concept | Pattern | Example |
|---|---|---|
| Fetch function | `fetch{Entity}` | `fetchNewsDetail` |
| Queries file | `{entity}Queries` | `newsQueries` |
| API export | `{entity}Api` | `newsApi` |
| Hook name | `useGet{Entity}` / `useCreate{Entity}` | `useGetLatestNews` |
| Mutation file | `{entity}.mutations.ts` | `votes.mutations.ts` |
| Query key param | object form | `{ matchId }` not `matchId` |

## Do

- Export named fetch functions from `{entity}.queries.ts` and register in `serverApi.ts`
- Have queryFn call those same fetch functions (no duplication)
- Use `apiFetch.get<T>()` / `apiFetch.post<T>()` for all HTTP calls
- Use `createQueryKeys` for all query definitions
- Register all entities in `queries.ts`, `api.ts`, and `serverApi.ts`
- Use object params for all hooks, fetch functions, and query factories
- Export explicit named types for hook props
- Let errors propagate (don't catch in fetch functions or queryFn)
- Annotate return types on all fetch functions
- Use `queries.{entity}._def` for broad invalidation
- Keep types in `src/types/` as single source of truth

## Do NOT

- Duplicate fetch logic between server functions and queryFn
- Use Axios — use `apiFetch` (native fetch wrapper) instead
- Define query keys as string arrays in components
- Pass primitive parameters to hooks — use `{ matchId }` not `matchId`
- Put UI logic (toasts, redirects) inside hooks
- Re-export types from entity barrel files — import from `src/types/`
- Catch errors in fetch functions (except boolean-returning checks like `fetchHasVoted`)
- Use `any` for API response types
- Put query configuration (`staleTime`, `refetchInterval`) in query factories unless truly entity-level
- Create custom types that duplicate what's in `src/types/`
- Manually construct query keys outside the factory
- Import fetch functions directly in components — use `serverApi` for server, `api` for client
