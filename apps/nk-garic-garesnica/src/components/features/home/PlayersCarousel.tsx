"use client";

import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { getCometImageUrl } from "@/lib/hns/imageUrl";
import type { RosterEntry, RosterPosition } from "@/types/roster";

const POSITION_LABEL: Record<Exclude<RosterPosition, "trener">, string> = {
  vratar: "Vratar",
  obrambeni: "Obrana",
  vezni: "Vezni red",
  napadac: "Napad",
};

/** Ime razdvojeno na dio ispred prezimena i samo prezime. */
interface SplitName {
  first: string;
  last: string;
}

function splitName(name: string): SplitName {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) return { first: "", last: parts[0] };
  const last = parts.pop() ?? name;

  return { first: parts.join(" "), last };
}

/**
 * Kartica igrača. S fotografijom iz Cometa slika nosi karticu, a broj dresa
 * stoji kao iscrtani žig preko nje; bez fotografije broj preuzima cijelu
 * plohu i na hover se "izveze" (stroke → puna boja).
 */
function PlayerCard({
  player,
  photo,
}: {
  player: RosterEntry;
  photo: string | null;
}) {
  const { first, last } = splitName(player.displayName);

  const position =
    player.position !== "trener" ? POSITION_LABEL[player.position] : null;

  const number =
    player.jerseyNumber !== null
      ? String(player.jerseyNumber).padStart(2, "0")
      : "-";

  if (photo) {
    return (
      <article className="group relative flex h-100 w-64 shrink-0 snap-start flex-col overflow-hidden rounded-[28px] bg-background shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_36px_-22px_rgba(15,23,42,0.35)] transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0 sm:h-112 sm:w-72">
        {player.captain && (
          <span className="absolute right-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-club">
            Kapetan
          </span>
        )}

        <div className="relative flex-1 overflow-hidden bg-secondary">
          <Image
            src={getCometImageUrl(photo)}
            alt={player.displayName}
            fill
            sizes="272px"
            className="object-cover object-[center_28%] ring-1 ring-inset ring-black/10 transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
          />
          {/* Blagi scrim prema dnu da broj dresa ostane čitljiv na svakoj fotki. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, oklch(0.14 0.05 262 / 0.55), transparent 42%)",
            }}
          />
          <span
            aria-hidden
            className="text-stroke pointer-events-none absolute bottom-2 left-4 font-display text-[4.5rem] leading-none tabular-nums opacity-80"
            // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
            // standardna svojstva, pa ga inline stil ovdje mora proširiti.
            style={{ "--text-stroke-color": "#ffffff" } as React.CSSProperties}
          >
            {number}
          </span>
        </div>

        <div className="relative border-t border-border p-5">
          {position && (
            <p className="font-mono text-[13px] uppercase tracking-widest text-muted-foreground">
              {position}
            </p>
          )}
          <div className="mt-3 h-0.5 w-8 rounded-full bg-club transition-[width] duration-300 ease-out group-hover:w-14 motion-reduce:group-hover:w-8" />
          {first && <p className="mt-4 text-base text-muted-foreground">{first}</p>}
          <h3 className="mt-1 font-display text-[2rem] uppercase leading-[1.02] tracking-wide text-foreground">
            {last}
          </h3>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-100 w-64 shrink-0 snap-start flex-col overflow-hidden rounded-[28px] bg-background shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_36px_-22px_rgba(15,23,42,0.35)] transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0 sm:h-112 sm:w-72">
      {player.captain && (
        <span className="absolute right-4 top-4 z-10 rounded-full bg-club/10 px-3 py-1 font-mono text-xs font-semibold tracking-[0.08em] text-club uppercase">
          Kapetan
        </span>
      )}

      {/* Broj dresa — kao na leđima: iscrtan uvijek, izvezen (puna boja) na hover. */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <span
          aria-hidden
          className="halftone halftone-fade-t pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-20"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute font-display text-[7rem] leading-none tabular-nums text-club opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-[8rem]"
        >
          {number}
        </span>
        <span
          aria-hidden
          className="text-stroke pointer-events-none relative font-display text-[7rem] leading-none tabular-nums transition-opacity duration-300 group-hover:opacity-0 sm:text-[8rem]"
          // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
          // standardna svojstva, pa ga inline stil ovdje mora proširiti.
          style={{ "--text-stroke-color": "var(--club)" } as React.CSSProperties}
        >
          {number}
        </span>
      </div>

      <div className="relative border-t border-border p-5">
        {position && (
          <p className="font-mono text-[13px] tracking-widest text-muted-foreground uppercase">
            {position}
          </p>
        )}
        <div className="mt-3 h-0.5 w-8 rounded-full bg-club transition-[width] duration-300 ease-out group-hover:w-14 motion-reduce:group-hover:w-8" />
        {first && (
          <p className="mt-4 text-base text-muted-foreground">{first}</p>
        )}
        <h3 className="mt-1 font-display text-[2rem] leading-[1.02] tracking-wide text-foreground uppercase">
          {last}
        </h3>
      </div>
    </article>
  );
}

/**
 * Vodoravni slider igrača. Scroll je izvorni (touch i trackpad zadržavaju
 * momentum), gumbi samo pomiču pogled; traka pokazuje dokle se došlo.
 */
export default function PlayersCarousel({
  players,
  photos,
}: {
  players: RosterEntry[];
  photos: Record<number, string>;
}) {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;

    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft >= max - 8);
  }, []);

  const scrollBy = useCallback(
    (direction: 1 | -1) => {
      const el = scrollerRef.current;

      if (!el) return;
      el.scrollBy({
        left: direction * el.clientWidth * 0.8,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [reduceMotion],
  );

  return (
    <div>
      {/* Okomiti padding je nužan: `overflow-x: auto` kliparo i po Y osi, pa bi
          bez njega podignuta kartica i njena sjena bile odrezane. */}
      {/* Kartice igrača nemaju fokusabilnog sadržaja, pa bi bez `tabIndex` ovo
          skrolabilno područje bilo nedostupno tipkovnicom. */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        tabIndex={0}
        role="region"
        aria-label="Igrači prve momčadi"
        className="-my-8 flex snap-x snap-mandatory gap-4 overflow-x-auto py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            photo={photos[player.personId] ?? null}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center gap-5 pr-4 sm:pr-6 lg:pr-10">
        <div className="h-1 flex-1 rounded-full bg-border">
          <div
            className="h-1 rounded-full bg-club transition-[width] duration-150 ease-out"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            aria-label="Prethodni igrači"
            className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-[transform,background-color,border-color,opacity] duration-150 ease-out hover:border-club/50 hover:bg-secondary active:scale-[0.96] motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="size-4.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            aria-label="Sljedeći igrači"
            className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-[transform,background-color,border-color,opacity] duration-150 ease-out hover:border-club/50 hover:bg-secondary active:scale-[0.96] motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRight className="size-4.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
