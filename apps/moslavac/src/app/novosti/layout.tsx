import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vijesti",
  description: "Sve vijesti, novosti i obavijesti NK Moslavac.",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
