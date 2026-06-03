import type { Metadata } from "next";
import MatchesCalendar from "@/components/features/matches/MatchesCalendar";
import { fetchAllMatches } from "@/lib/hns/matches";

export const metadata: Metadata = {
  title: "Raspored utakmica",
  description:
    "Raspored, rezultati i kalendar svih utakmica. Pratite nadolazeće susrete i odigrane mečeve.",
  alternates: { canonical: "/utakmice" },
};

export const revalidate = 120;

export default async function MatchesPage() {
  const matches = await fetchAllMatches();
  return (
    <section className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12">
      <h1 className="text-center">Raspored utakmica</h1>
      <MatchesCalendar matches={matches} />
    </section>
  );
}
