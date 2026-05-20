import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vijesti",
  description: "Sve vijesti, novosti i obavijesti NK Moslavac.",
  alternates: { canonical: "/novosti" },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
