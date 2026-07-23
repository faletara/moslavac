"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TenantProvider } from "@/components/providers/TenantProvider";
import type { FrontendTenant } from "@/lib/payload/types";

export default function Providers({
  tenant,
  children,
}: {
  tenant: FrontendTenant;
  children: React.ReactNode;
}) {
  return (
    <TenantProvider tenant={tenant}>
      <TooltipProvider>
        {children}
        <Toaster position="top-right" richColors />
      </TooltipProvider>
    </TenantProvider>
  );
}
