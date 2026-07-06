import "server-only";
import { getActivePayloadContext } from "./context";

// Empty when unset rather than throwing at module load: the CMS (which serves
// many tenants) imports the shared data layer without a single tenant slug.
// Kept free of `react`/`cache` so the fetch hot path (fetchCollection) can be
// imported and tested without a React runtime.
const ENV_TENANT_SLUG = process.env.PAYLOAD_TENANT_SLUG ?? "";

/** The build-time tenant slug (env). Re-exported from getTenant for callers. */
export const tenantSlug = ENV_TENANT_SLUG;

/** The tenant slug in effect: an injected context wins over the env default. */
export function resolveTenantSlug(): string {
  return getActivePayloadContext()?.tenantSlug ?? ENV_TENANT_SLUG;
}
