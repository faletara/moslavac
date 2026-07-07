import type { RosterEntry } from "@/types/roster";
import SectionHead from "./SectionHead";
import PlayersCarousel from "./PlayersCarousel";

/**
 * Sekcija igrača — puna crvena pozornica s dijagonalnim rasterom i zrnom,
 * ink kartice s ogromnim ghost brojevima u horizontalnom scrollu.
 */
export default function PlayersSection({
  players,
}: {
  players: RosterEntry[];
}) {
  const squad = players.filter((p) => p.position !== "trener");
  if (squad.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden bg-club-red py-20 md:py-28">
      {/* Dijagonalni raster + tamni gradijent pri dnu + zrno */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent,transparent_44px,rgba(255,255,255,0.05)_44px,rgba(255,255,255,0.05)_88px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-transparent via-transparent to-black/25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.07] mix-blend-overlay"
      />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHead
          dark
          eyebrow="Prva momčad"
          title="Naši igrači"
          link={{ href: "/momcad", label: "Svi igrači" }}
        />
        <div className="mt-12 md:mt-16">
          <PlayersCarousel players={squad} />
        </div>
      </div>
    </section>
  );
}
