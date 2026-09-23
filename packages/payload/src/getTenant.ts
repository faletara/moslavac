import "server-only";
import { cache } from "react";
import { payloadFetch } from "./client";
import { resolveTenantSlug } from "./tenant";
import { payloadPage, tenantRecordSchema } from "./schemas";
import type { FrontendTenant } from "./schemas";
import { normalizeYouTubeChannelUrl } from "./tenantSocial";

// Re-exported so external callers keep importing `tenantSlug` from here.
export { tenantSlug } from "./tenant";

/**
 * Jedan autentificirani dohvat Tenanta po zahtjevu. Iz njega nastaju javni
 * Tenant (`getTenant`) i HNS ključ (`getHnsApiKey`).
 */
const fetchTenantRecord = cache(async () => {
  const slug = resolveTenantSlug();

  if (!slug) {
    throw new Error("PAYLOAD_TENANT_SLUG env var is required");
  }

  const query = new URLSearchParams({
    "where[slug][equals]": slug,
    depth: "2",
    limit: "1",
  });

  const result = await payloadFetch(
    `/tenants?${query.toString()}`,
    payloadPage(tenantRecordSchema),
    {
      authenticated: true,
      next: { revalidate: 300, tags: [`tenant-${slug}`] },
    },
  );

  const record = result.docs[0];

  if (!record) {
    throw new Error(
      `Tenant with slug "${slug}" not found in Payload. Create one in /admin first.`,
    );
  }

  return record;
});

/** Javni Tenant, bez HNS ključa. Smije se proslijediti client komponenti. */
export const getTenant = cache(async (): Promise<FrontendTenant> => {
  const { tenant } = await fetchTenantRecord();

  return {
    ...tenant,
    social: tenant.social
      ? {
          ...tenant.social,
          youtube: normalizeYouTubeChannelUrl(tenant.social.youtube),
        }
      : tenant.social,
  };
});

/**
 * HNS ključ Tenanta. Treba ga samo serverski HNS klijent
 * (`packages/hns/src/client.ts`) za `API_KEY` zaglavlje. Ključ pripada savezu
 * i ne može se rotirati, pa ga nikad ne prosljeđuj u props ni u Tenant.
 */
export async function getHnsApiKey(): Promise<string> {
  return (await fetchTenantRecord()).hnsApiKey;
}
