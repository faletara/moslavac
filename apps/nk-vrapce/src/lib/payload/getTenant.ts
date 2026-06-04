import "server-only";
import { cache } from "react";
import { payloadFetch } from "./client";
import type { FrontendTenant, PayloadPaginated } from "./types";

const TENANT_SLUG = process.env.PAYLOAD_TENANT_SLUG;

if (!TENANT_SLUG) {
  throw new Error("PAYLOAD_TENANT_SLUG env var is required");
}

export const tenantSlug = TENANT_SLUG;

export const getTenant = cache(async (): Promise<FrontendTenant> => {
  const slug = TENANT_SLUG;
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
