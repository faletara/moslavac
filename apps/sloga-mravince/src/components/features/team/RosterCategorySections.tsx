import Image from "next/image";
import Link from "next/link";
import { buildPlayerSlug } from "@/lib/helpers/slug";
import type { RosterEntry, RosterPosition } from "@/types/roster";

export interface RosterCategoryGroup {
  position: RosterPosition;
  label: string;
  players: RosterEntry[];
}

const POSITION_LABEL: Record<RosterPosition, string> = {
  vratar: "Vratar",
  obrambeni: "Branič",
  vezni: "Vezni red",
  napadac: "Napadač",
  trener: "Stožer",
};

function getPhotoSrc(
  player: RosterEntry,
  cometPhotos: Map<number, string>,
): string | null {
  return (
    player.photo?.sizes?.card?.url ??
    player.photo?.url ??
    cometPhotos.get(player.personId) ??
    null
  );
}

function splitName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return { first: "", last: parts[0] ?? name };
  const last = parts.pop() as string;
  return { first: parts.join(" "), last };
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function PlayerImage({
  player,
  crestSrc,
  photoSrc,
}: {
  player: RosterEntry;
  crestSrc: string;
  photoSrc: string | null;
}) {
  if (photoSrc) {
    return (
      <Image
        src={photoSrc}
        alt={player.displayName}
        fill
        sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_38%,#ffffff_0%,#f2f3f5_62%,#e4e7ec_100%)]">
      <Image
        src={crestSrc}
        alt=""
        width={140}
        height={140}
        className="h-24 w-auto object-contain opacity-80 drop-shadow-[0_14px_28px_rgba(0,0,0,0.18)] sm:h-32"
      />
      <span className="absolute bottom-5 right-5 font-display text-5xl uppercase leading-none text-ink-deep/10">
        {initials(player.displayName)}
      </span>
    </div>
  );
}

function PlayerCard({
  player,
  crestSrc,
  cometPhotos,
  href,
}: {
  player: RosterEntry;
  crestSrc: string;
  cometPhotos: Map<number, string>;
  href: string | null;
}) {
  const { first, last } = splitName(player.displayName);
  const photoSrc = getPhotoSrc(player, cometPhotos);

  const cardClass =
    "group relative block w-[min(82vw,17rem)] shrink-0 snap-start overflow-hidden bg-ink-deep text-chalk clip-corner outline-none ring-club-red transition-shadow focus-visible:ring-2 sm:w-auto";

  const body = (
    <>
      <div className="relative aspect-4/5 overflow-hidden bg-white">
        <PlayerImage player={player} crestSrc={crestSrc} photoSrc={photoSrc} />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/82 via-black/10 to-transparent" />
        {/* Ghost broj samo kad nema fotke — inače smeta preko lica */}
        {!photoSrc && player.jerseyNumber != null && (
          <span
            aria-hidden
            className="[--text-stroke-color:rgba(255,255,255,0.18)] absolute -right-3 -top-4 select-none font-display text-[8rem] leading-none text-stroke transition-transform duration-500 group-hover:-translate-y-1"
          >
            {player.jerseyNumber}
          </span>
        )}
      </div>

      <div className="relative min-h-40 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-[0.6rem] font-black uppercase text-chalk/45">
            {POSITION_LABEL[player.position]}
          </span>
          {player.captain && (
            <span className="border border-club-gold px-2 py-1 text-[0.55rem] font-black uppercase text-club-gold">
              C
            </span>
          )}
        </div>

        <div className="flex items-start gap-4">
          {player.jerseyNumber != null && (
            <span className="font-display text-5xl leading-none tabular-nums text-club-red">
              {String(player.jerseyNumber).padStart(2, "0")}
            </span>
          )}
          <div className="min-w-0 pt-1">
            {first && (
              <p className="text-xs font-semibold uppercase text-chalk/55">
                {first}
              </p>
            )}
            <h3 className="mt-1 text-balance font-display text-3xl uppercase leading-tight text-chalk">
              {last}
            </h3>
          </div>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`Statistika — ${player.displayName}`}
        className={cardClass}
      >
        {body}
      </Link>
    );
  }

  return <article className={cardClass}>{body}</article>;
}

function playerHref(
  player: RosterEntry,
  competitionSlug: string | null,
): string | null {
  if (!competitionSlug || player.position === "trener" || player.personId == null)
    return null;
  return `/statistika/${buildPlayerSlug({
    personId: player.personId,
    name: player.displayName,
  })}/${competitionSlug}`;
}

export function RosterCategorySections({
  groups,
  crestSrc,
  cometPhotos,
  competitionSlug,
}: {
  groups: RosterCategoryGroup[];
  crestSrc: string;
  cometPhotos: Map<number, string>;
  competitionSlug: string | null;
}) {
  return (
    <div className="space-y-20">
      {groups.map((group) => (
        <section key={group.position}>
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-foreground/10 pb-6">
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">
                {String(group.players.length).padStart(2, "0")} članova
              </p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-none text-foreground sm:text-6xl">
                {group.label}
              </h2>
            </div>
          </div>

          <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {group.players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                crestSrc={crestSrc}
                cometPhotos={cometPhotos}
                href={playerHref(player, competitionSlug)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
