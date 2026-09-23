"use client";

import { createContext, useContext } from "react";
import type { FrontendTenant, MediaImage } from "@/lib/payload/types";

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
export function useOurTeamId(): number | null {
  const tenant = useTenant();
  const id = Number(tenant.hns.teamId);

  return Number.isFinite(id) ? id : null;
}

export function useTenantLogo(): MediaImage | null {
  return useTenant().branding?.logo ?? null;
}
