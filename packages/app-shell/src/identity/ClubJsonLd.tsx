import type { FrontendTenant } from "@/lib/payload/types";
import { buildClubJsonLd } from "./clubIdentity";

/**
 * The club's schema.org graph. Rendered once per Club app from the Tenant
 * record, so every club emits the same structure without copying the mapping.
 */
export default function ClubJsonLd({
  tenant,
  baseUrl,
}: {
  tenant: FrontendTenant;
  baseUrl: string;
}) {
  const { organization, website } = buildClubJsonLd({ tenant, baseUrl });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
