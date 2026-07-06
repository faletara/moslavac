import "server-only";
import { resolveTransport } from "./client";
import type { PayloadFetchOptions } from "./context";
import { buildQuery, tenantWhere } from "./query";
import { resolveTenantSlug } from "./tenant";
import type { PayloadPaginated } from "./types";

// The deep data-fetch module. Every club-content fetcher is a thin declaration
// over one of `fetchList` / `fetchOne` / `fetchPage`; the shared shape
// (tenant filter → query → transport → cache tags → error contract) lives here
// once. The transport is a seam (see context.ts): HTTP in prod, a fake in tests.

/** Mapped, page-shaped result. Structurally matches domain `Paginated*` types. */
export interface Paginated<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

interface QueryOptions {
  collection: string;
  where?: Record<string, string | number>;
  sort?: string;
  limit?: number;
  page?: number;
  depth?: number;
  authenticated?: boolean;
  revalidate?: number;
  tags?: string[];
  tagPrefix?: string;
}

async function queryCollection<Raw>(
  o: QueryOptions,
): Promise<PayloadPaginated<Raw>> {
  const slug = resolveTenantSlug();

  const params: Record<string, string | number> = {
    ...tenantWhere(slug),
    ...(o.where ?? {}),
    depth: o.depth ?? 2,
  };
  if (o.sort) params.sort = o.sort;
  if (o.limit != null) params.limit = o.limit;
  if (o.page != null) params.page = o.page;

  const opts: PayloadFetchOptions = {
    authenticated: o.authenticated,
    next: {
      revalidate: o.revalidate ?? 60,
      tags: o.tags ?? [`${o.tagPrefix ?? o.collection}-${slug}`],
    },
  };

  const raw = await resolveTransport()(`/${o.collection}?${buildQuery(params)}`, opts);
  return raw as PayloadPaginated<Raw>;
}

interface BaseSpec<Raw, Domain> {
  collection: string;
  where?: Record<string, string | number>;
  depth?: number;
  authenticated?: boolean;
  adapt: (doc: Raw) => Domain;
  revalidate?: number;
  tags?: string[];
  /** Cache-tag prefix when it differs from the collection name (e.g. board-members → board). */
  tagPrefix?: string;
  /** Opt out of the resilient default and surface transport errors. */
  throwOnError?: boolean;
}

export interface ListSpec<Raw, Domain> extends BaseSpec<Raw, Domain> {
  sort?: string;
  limit?: number;
}

export interface OneSpec<Raw, Domain> extends BaseSpec<Raw, Domain> {
  where: Record<string, string | number>;
}

export interface PageSpec<Raw, Domain> extends BaseSpec<Raw, Domain> {
  sort?: string;
  page: number;
  size: number;
}

/** Fetch a tenant-scoped list and map each doc. Resilient: returns [] on error. */
export async function fetchList<Raw, Domain>(
  spec: ListSpec<Raw, Domain>,
): Promise<Domain[]> {
  try {
    const result = await queryCollection<Raw>({
      collection: spec.collection,
      where: spec.where,
      sort: spec.sort,
      limit: spec.limit,
      depth: spec.depth,
      authenticated: spec.authenticated,
      revalidate: spec.revalidate,
      tags: spec.tags,
      tagPrefix: spec.tagPrefix,
    });
    return result.docs.map(spec.adapt);
  } catch (err) {
    if (spec.throwOnError) throw err;
    console.error(`fetchList(${spec.collection}) failed:`, err);
    return [];
  }
}

/** Fetch a single tenant-scoped doc (limit 1). Resilient: returns null on error/empty. */
export async function fetchOne<Raw, Domain>(
  spec: OneSpec<Raw, Domain>,
): Promise<Domain | null> {
  try {
    const result = await queryCollection<Raw>({
      collection: spec.collection,
      where: spec.where,
      limit: 1,
      depth: spec.depth,
      authenticated: spec.authenticated,
      revalidate: spec.revalidate,
      tags: spec.tags,
      tagPrefix: spec.tagPrefix,
    });
    const doc = result.docs[0];
    return doc ? spec.adapt(doc) : null;
  } catch (err) {
    if (spec.throwOnError) throw err;
    console.error(`fetchOne(${spec.collection}) failed:`, err);
    return null;
  }
}

/** Fetch a tenant-scoped page and map it into the domain `Paginated` shape. */
export async function fetchPage<Raw, Domain>(
  spec: PageSpec<Raw, Domain>,
): Promise<Paginated<Domain>> {
  try {
    const result = await queryCollection<Raw>({
      collection: spec.collection,
      where: spec.where,
      sort: spec.sort,
      page: spec.page,
      limit: spec.size,
      depth: spec.depth,
      authenticated: spec.authenticated,
      revalidate: spec.revalidate,
      tags: spec.tags,
      tagPrefix: spec.tagPrefix,
    });
    return {
      content: result.docs.map(spec.adapt),
      totalElements: result.totalDocs,
      totalPages: result.totalPages,
      number: result.page - 1,
      size: result.limit,
    };
  } catch (err) {
    if (spec.throwOnError) throw err;
    console.error(`fetchPage(${spec.collection}) failed:`, err);
    return { content: [], totalElements: 0, totalPages: 0, number: spec.page - 1, size: spec.size };
  }
}
