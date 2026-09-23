import type { FrontendTenant } from "@/lib/payload/types";
import type { Facility } from "@/types/hns";
import { serializeJsonLd } from "@/lib/helpers/jsonLd";
import { buildClubJsonLd } from "./clubIdentity";

/**
 * The club's schema.org graph. Rendered once per Club app from the Tenant
 * record, so every club emits the same structure without copying the mapping.
 */
export default function ClubJsonLd({
  tenant,
  baseUrl,
  facility,
}: {
  tenant: FrontendTenant;
  baseUrl: string;
  /** Stadion iz HNS-a; izostaje kad je HNS nedostupan. */
  facility?: Facility | null;
}) {
  const { organization, website } = buildClubJsonLd({
    tenant,
    baseUrl,
    facility,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(website) }}
      />
    </>
  );
}
