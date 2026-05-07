"use client";

import { createContext, useContext } from "react";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";

const TenantContext = createContext<FrontendTenant | null>(null);

export function TenantProvider({
  tenant,
  children,
}: {
  tenant: FrontendTenant;
  children: React.ReactNode;
}) {
  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
}

export function useTenant(): FrontendTenant {
  const tenant = useContext(TenantContext);
  if (!tenant) {
    throw new Error("useTenant must be used inside <TenantProvider>");
  }
  return tenant;
}

export function useTenantLogo(): PayloadMedia | null {
  const tenant = useTenant();
  if (
    tenant.branding?.logo &&
    typeof tenant.branding.logo === "object" &&
    "url" in tenant.branding.logo
  ) {
    return tenant.branding.logo;
  }
  return null;
}
