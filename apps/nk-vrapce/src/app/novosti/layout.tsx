import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vijesti i obavijesti",
  description: "Sve vijesti, novosti i obavijesti NK Vrapče.",
  alternates: { canonical: "/novosti" },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
