import type { Metadata } from "next";
import { FadeInView } from "@/components/animations";
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
      <FadeInView>
        <h1 className="text-center text-3xl font-black uppercase leading-none tracking-tighter md:text-4xl">
          Raspored utakmica
        </h1>
      </FadeInView>
      <FadeInView delay={0.1}>
        <MatchesCalendar matches={matches} />
      </FadeInView>
    </section>
  );
}
