import { fetchSeniorCompetition } from "@/lib/hns/competitions";
import { resolveCometPhotoUrls } from "@/lib/rosterPhotos";
import { buildCompetitionSlug, buildPlayerSlug } from "@/lib/helpers/slug";
import type { RosterEntry } from "@/types/roster";
import SectionHead from "./SectionHead";
import PlayersCarousel, { type CarouselPlayer } from "./PlayersCarousel";

/**
 * Sekcija igrača — puna crvena pozornica s dijagonalnim rasterom i zrnom,
 * ink kartice s ogromnim ghost brojevima u horizontalnom scrollu.
 */
export default async function PlayersSection({
  players,
}: {
  players: RosterEntry[];
}) {
  const squad = players.filter((p) => p.position !== "trener");
  if (squad.length === 0) return null;

  const [cometPhotos, senior] = await Promise.all([
    resolveCometPhotoUrls(squad),
    fetchSeniorCompetition(),
  ]);
  const competitionSlug = senior ? buildCompetitionSlug(senior) : null;

  const carouselPlayers: CarouselPlayer[] = squad.map((entry) => ({
    id: entry.id,
    displayName: entry.displayName,
    position: entry.position,
    jerseyNumber: entry.jerseyNumber,
    captain: entry.captain,
    photoUrl: entry.photo?.url ?? cometPhotos.get(entry.personId) ?? null,
    href:
      competitionSlug && entry.personId != null
        ? `/statistika/${buildPlayerSlug({
            personId: entry.personId,
            name: entry.displayName,
          })}/${competitionSlug}`
        : null,
  }));

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
          <PlayersCarousel players={carouselPlayers} />
        </div>
      </div>
    </section>
  );
}
