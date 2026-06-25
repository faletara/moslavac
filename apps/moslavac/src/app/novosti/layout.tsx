import type { Metadata } from "next";
import { getTenant } from "@/lib/payload/getTenant";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  return {
    title: "Vijesti",
    description: `Sve vijesti, novosti i obavijesti kluba ${tenant.displayName}.`,
    alternates: { canonical: "/novosti" },
  };
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
