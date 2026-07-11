import { FadeInView } from "@/components/animations";
import StandingsTable from "@/components/features/standings/StandingsTable";
import type { TeamRanking } from "@/types/hns";
import SectionHead from "./SectionHead";

/**
 * Tablica seniorskog natjecanja (HNS) na naslovnici — sekcijski okvir oko
 * dijeljene `StandingsTable`, koju match stranica koristi izravno.
 * Renderira se samo ako ima redaka.
 */
export default function StandingsSection({ rows }: { rows: TeamRanking[] }) {
  if (rows.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHead eyebrow="Seniori · Prvenstvo" title="Tablica" />

      <FadeInView className="mt-12 md:mt-16">
        <StandingsTable rows={rows} />
      </FadeInView>
    </section>
  );
}
