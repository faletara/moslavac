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

/**
 * The club's own HNS team id (as a number), used to decide whether a player
 * belongs to this club. Opponent players are not in our HNS dataset, so linking
 * to their profile page would 404 — callers use this to gate player links.
 */
export function useMoslavacTeamId(): number | null {
  const tenant = useTenant();
  const id = Number(tenant.hns.teamId);
  return Number.isFinite(id) ? id : null;
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
