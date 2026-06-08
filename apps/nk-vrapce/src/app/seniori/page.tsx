import type { Metadata } from "next";
import Image from "next/image";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/animations";
import { BrandedHero } from "@/components/features/BrandedHero";
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
    </>
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
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
        <div className="flex items-center gap-3.5">
          <span className="size-2.5 rounded-full bg-brand-yellow" />
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl md:text-4xl">
            {title}
          </h2>
        </div>
        <span className="font-bold tabular-nums text-sm tracking-[0.2em] text-muted-foreground sm:text-base">
          {String(players.length).padStart(2, "0")}
        </span>
      </div>
      <StaggerContainer
        className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8"
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
  const initial = player.displayName.charAt(0);
  const ghostMark =
    !hideNumber && player.jerseyNumber != null
      ? String(player.jerseyNumber)
      : initial;

  return (
    <FadeInView className="group">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black ring-1 ring-black/5 transition-all duration-300 group-hover:ring-brand-yellow/50 group-hover:shadow-[0_22px_45px_-20px_rgba(0,0,0,0.55)]">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={player.photo?.alt || player.displayName}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          // Brandirani fallback — golem ghost broj/inicijal (osjećaj dresa)
          <div className="absolute inset-0 bg-gradient-to-br from-black to-brand-navy-700">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,203,5,0.14), transparent 70%)",
              }}
            />
            <span
              aria-hidden
              className="absolute inset-0 flex select-none items-center justify-center text-[7rem] font-black leading-none tracking-tighter text-white/[0.07]"
            >
              {ghostMark}
            </span>
          </div>
        )}

        {/* Gradient na dnu — čitljivost imena (crni, kao Hero) */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/55 to-transparent" />

        {!hideNumber && player.jerseyNumber != null && (
          <span className="absolute left-3 top-3 text-3xl font-black leading-none tabular-nums text-brand-yellow drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
            {player.jerseyNumber}
          </span>
        )}
        {player.captain && (
          <span className="absolute right-3 top-3 bg-brand-blue px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white">
            Kapetan
          </span>
        )}

        {/* Ime preklopljeno preko slike */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4">
          <span className="h-px w-6 bg-brand-yellow transition-all duration-300 group-hover:w-12" />
          <h3 className="text-balance text-sm font-bold uppercase leading-tight tracking-tight text-white sm:text-base">
            {player.displayName}
          </h3>
        </div>
      </div>
    </FadeInView>
  );
}
