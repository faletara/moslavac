import type { Metadata } from "next";
import { FadeInView } from "@/components/animations";
import MatchesCalendar from "@/components/features/matches/MatchesCalendar";
import { PageHero } from "@/components/layout/PageHero";
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
    <section className="mx-auto w-full max-w-7xl space-y-16 px-4 pt-16 pb-24 sm:space-y-20 sm:pt-24 lg:px-8">
      <PageHero
        eyebrow="Raspored · Sezona 2025/26"
        title="Utakmice"
        watermark="25/26"
        lineClassName="text-[15vw] sm:text-6xl md:text-7xl lg:text-8xl"
      />
      <FadeInView delay={0.1}>
        <MatchesCalendar matches={matches} />
      </FadeInView>
    </section>
  );
}
