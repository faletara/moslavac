import "server-only";
import { cache } from "react";
import { payloadFetch } from "./client";
import { tenantSlug } from "./tenant";
import type { FrontendTenant, PayloadPaginated } from "./types";

// Re-exported so external callers keep importing `tenantSlug` from here.
export { tenantSlug } from "./tenant";

export const getTenant = cache(async (): Promise<FrontendTenant> => {
  const slug = tenantSlug;
  if (!slug) {
    throw new Error("PAYLOAD_TENANT_SLUG env var is required");
  }
  const query = new URLSearchParams({
    "where[slug][equals]": slug,
    depth: "2",
    limit: "1",
  });
  const result = await payloadFetch<PayloadPaginated<FrontendTenant>>(
    `/tenants?${query.toString()}`,
    {
      authenticated: true,
      next: { revalidate: 300, tags: [`tenant-${slug}`] },
    },
  );

  const tenant = result.docs[0];
  if (!tenant) {
    throw new Error(
      `Tenant with slug "${slug}" not found in Payload. Create one in /admin first.`,
    );
  }
  return tenant;
});
