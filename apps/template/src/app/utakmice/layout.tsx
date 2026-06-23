import type { Metadata } from "next";
import { getTenant } from "@/lib/payload/getTenant";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  return {
    title: "Utakmice",
    description: `Raspored i rezultati utakmica ${tenant.displayName}.`,
    alternates: { canonical: "/utakmice" },
  };
}

export default function MatchesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
