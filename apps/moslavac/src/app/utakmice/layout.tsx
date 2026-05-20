import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utakmice",
  description: "Raspored i rezultati utakmica NK Moslavac.",
};

export default function MatchesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
