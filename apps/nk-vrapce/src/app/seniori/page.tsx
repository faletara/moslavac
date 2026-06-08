import type { Metadata } from "next";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { BrandedHero } from "@/components/features/BrandedHero";
import { PlayerCard } from "@/components/features/seniori/PlayerCard";
import { fetchSeniorCompetition } from "@/lib/hns/competitions";
import { fetchPageByKey } from "@/lib/payload/getPages";
import { fetchRoster } from "@/lib/payload/getRoster";
import type { RosterEntry, RosterPosition } from "@/types/roster";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageByKey({ key: "seniori-info" });
  return {
    title: page?.title ?? "Seniori",
    description:
      page?.seoDescription ??
      "Seniorska momčad NK Vrapče — igrači i stručni stožer.",
    alternates: { canonical: "/seniori" },
  };
}

const playerOrder: RosterPosition[] = [
  "vratar",
  "obrambeni",
  "vezni",
  "napadac",
];

const positionLabels: Record<RosterPosition, string> = {
  vratar: "Vratari",
  obrambeni: "Obrana",
  vezni: "Vezni red",
  napadac: "Napad",
  trener: "Stručni stožer",
};

export default async function SenioriPage() {
  const [roster, page, competition] = await Promise.all([
    fetchRoster(),
    fetchPageByKey({ key: "seniori-info" }),
    fetchSeniorCompetition(),
  ]);
  const competitionId = competition?.id ?? null;

  const sections = playerOrder
    .map((position) => ({
      position,
      players: roster
        .filter((p) => p.position === position)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    }))
    .filter((section) => section.players.length > 0);

  const staff = roster
    .filter((p) => p.position === "trener")
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <>
      <BrandedHero
        eyebrow="Prva momčad"
        title={page?.title ?? "Seniori"}
        description={
          page?.content
            ? null
            : "Naša seniorska momčad — igrači i stručni stožer koji nose boje Vrapča na svakoj utakmici."
        }
      />

      <div className="mx-auto w-full max-w-screen-xl px-6 pb-24 lg:px-8">
        {page?.content && (
          <article
            className="news-content mx-auto mt-16 max-w-2xl sm:mt-20"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}

        {roster.length === 0 ? (
          <p className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Popis igrača uskoro.
          </p>
        ) : (
          <div className="mt-20 space-y-20 sm:mt-28 sm:space-y-24">
            {sections.map((section) => (
              <PlayerSection
                key={section.position}
                title={positionLabels[section.position]}
                players={section.players}
                competitionId={competitionId}
              />
            ))}
            {staff.length > 0 && (
              <PlayerSection
                title={positionLabels.trener}
                players={staff}
                hideNumbers
                competitionId={null}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

function PlayerSection({
  title,
  players,
  competitionId,
  hideNumbers = false,
}: {
  title: string;
  players: RosterEntry[];
  competitionId: number | null;
  hideNumbers?: boolean;
}) {
  return (
    <section className="space-y-10">
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
        <div className="flex items-center gap-3.5">
          <span className="size-2.5 rounded-full bg-brand-yellow" />
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl md:text-4xl">
            {title}
          </h2>
        </div>
      </div>
      <StaggerContainer
        className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8"
        staggerChildren={0.04}
      >
        {players.map((player) => (
          <StaggerItem key={player.id}>
            <PlayerCard
              player={player}
              hideNumber={hideNumbers}
              competitionId={competitionId}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
