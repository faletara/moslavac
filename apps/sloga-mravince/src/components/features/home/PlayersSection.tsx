import type { RosterEntry } from "@/types/roster";
import PlayersCarousel from "./PlayersCarousel";

/** Sekcija igrača na naslovnici (Monaco stil) — horizontalni scroll kartica. */
export default function PlayersSection({
  players,
}: {
  players: RosterEntry[];
}) {
  const squad = players.filter((p) => p.position !== "trener");
  if (squad.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <h2 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
        Naši igrači
      </h2>
      <div className="mt-8 md:mt-10">
        <PlayersCarousel players={squad} />
      </div>
    </section>
  );
}
