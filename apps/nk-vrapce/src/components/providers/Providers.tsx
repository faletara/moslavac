"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * App-wide client providers. Holds the React Query client so the `api.*`
 * hooks (HNS data fetching) work in client components.
 *
 * Tenant context is intentionally NOT wired here so the empty template boots
 * without a configured Payload tenant. Wrap subtrees that need it with
 * <TenantProvider tenant={...}> once you build tenant-dependent pages.
 */
export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
