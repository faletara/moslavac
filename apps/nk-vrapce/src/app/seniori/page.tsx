import type { Metadata } from "next";
import Image from "next/image";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/animations";
import { PageHero } from "@/components/features/PageHero";
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
  const [roster, page] = await Promise.all([
    fetchRoster(),
    fetchPageByKey({ key: "seniori-info" }),
  ]);

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
    <div className="mx-auto w-full max-w-screen-xl px-6 pt-16 pb-24 sm:pt-24 lg:px-8">
      <PageHero
        eyebrow="Prva momčad"
        title={page?.title ?? "Seniori"}
        description={
          page?.content
            ? undefined
            : "Igrači i stručni stožer naše seniorske momčadi."
        }
      />

      {page?.content && (
        <article
          className="news-content mx-auto mt-12 max-w-2xl text-center sm:mt-16"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}

      {roster.length === 0 ? (
        <p className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Popis igrača uskoro.
        </p>
      ) : (
        <div className="mt-16 space-y-20 sm:mt-24 sm:space-y-24">
          {sections.map((section) => (
            <PlayerSection
              key={section.position}
              title={positionLabels[section.position]}
              players={section.players}
            />
          ))}
          {staff.length > 0 && (
            <PlayerSection
              title={positionLabels.trener}
              players={staff}
              hideNumbers
            />
          )}
        </div>
      )}
    </div>
  );
}

function PlayerSection({
  title,
  players,
  hideNumbers = false,
}: {
  title: string;
  players: RosterEntry[];
  hideNumbers?: boolean;
}) {
  return (
    <section className="space-y-10">
      <div className="flex items-baseline gap-4 border-b border-border/60 pb-5">
        <span className="h-3 w-3 rounded-full bg-brand-yellow" />
        <h2 className="text-2xl font-black uppercase tracking-tighter sm:text-3xl">
          {title}
        </h2>
      </div>
      <StaggerContainer
        className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8"
        staggerChildren={0.04}
      >
        {players.map((player) => (
          <StaggerItem key={player.id}>
            <PlayerCard player={player} hideNumber={hideNumbers} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function PlayerCard({
  player,
  hideNumber,
}: {
  player: RosterEntry;
  hideNumber: boolean;
}) {
  const photoUrl = player.photo?.sizes?.card?.url ?? player.photo?.url ?? null;
  return (
    <FadeInView className="group flex flex-col gap-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface-2">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={player.photo?.alt || player.displayName}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-navy text-4xl font-black text-brand-yellow">
            {player.displayName.charAt(0)}
          </div>
        )}
        {!hideNumber && player.jerseyNumber != null && (
          <span className="absolute left-3 top-3 font-black tabular-nums text-3xl leading-none text-brand-yellow drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {player.jerseyNumber}
          </span>
        )}
        {player.captain && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-blue px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white">
            Kapetan
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="h-px w-6 bg-brand-yellow transition-all duration-300 group-hover:w-12" />
        <h3 className="text-balance text-sm font-bold uppercase leading-tight tracking-tight sm:text-base">
          {player.displayName}
        </h3>
      </div>
    </FadeInView>
  );
}
