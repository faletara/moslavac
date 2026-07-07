"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { RosterEntry, RosterPosition } from "@/types/roster";

const POSITION_LABEL: Record<Exclude<RosterPosition, "trener">, string> = {
  vratar: "Vratar",
  obrambeni: "Obrana",
  vezni: "Vezni red",
  napadac: "Napad",
};

function splitName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { first: "", last: parts[0] };
  const last = parts.pop() as string;
  return { first: parts.join(" "), last };
}

/** Ink kartica igrača — ogroman ghost broj, Anton prezime, crveni detalji. */
function PlayerCard({ player }: { player: RosterEntry }) {
  const { first, last } = splitName(player.displayName);
  const position =
    player.position !== "trener" ? POSITION_LABEL[player.position] : null;

  return (
    <article className="group relative h-80 w-60 shrink-0 snap-start overflow-hidden bg-ink-deep clip-corner sm:h-88 sm:w-68">
      {/* Ghost broj — dominantni element, na hover se lagano pomakne */}
      {player.jerseyNumber != null && (
        <span
          aria-hidden
          className="[--text-stroke-color:rgba(255,255,255,0.14)] absolute -right-3 -top-4 select-none font-display text-[11rem] leading-none tabular-nums text-stroke transition-transform duration-500 ease-out group-hover:-translate-y-2 sm:text-[13rem]"
        >
          {player.jerseyNumber}
        </span>
      )}

      {/* Crveni potpis uz lijevi rub */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 bg-club-red transition-[width] duration-300 group-hover:w-1.5"
      />

      {/* Broj + kapetanska oznaka */}
      <div className="absolute left-6 top-6 flex items-center gap-3">
        {player.jerseyNumber != null && (
          <span className="font-display text-4xl leading-none tabular-nums text-club-red">
            {player.jerseyNumber}
          </span>
        )}
        {player.captain && (
          <span className="flex h-6 w-6 items-center justify-center border border-club-gold text-[0.62rem] font-black text-club-gold">
            C
          </span>
        )}
      </div>

      {/* Ime + pozicija */}
      <div className="absolute inset-x-6 bottom-6">
        {position && (
          <p className="mb-2 text-[0.58rem] font-bold uppercase tracking-[0.3em] text-white/40">
            {position}
          </p>
        )}
        {first && (
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-white/65">
            {first}
          </p>
        )}
        <p className="mt-1.5 pt-[0.16em] font-display text-3xl uppercase leading-[1.12] tracking-wide text-white sm:text-4xl">
          {last}
        </p>
      </div>
    </article>
  );
}

export default function PlayersCarousel({
  players,
}: {
  players: RosterEntry[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  const scrollNext = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
    el.scrollBy({
      left: atEnd ? -el.scrollWidth : el.clientWidth * 0.8,
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      {/* Kontrole + CTA */}
      <div className="mt-10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-1 w-40 overflow-hidden bg-black/25 sm:w-56">
            <div
              className="h-full bg-white transition-[width] duration-150"
              style={{ width: `${Math.max(12, progress * 100)}%` }}
            />
          </div>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Sljedeći igrači"
            className="flex h-10 w-10 items-center justify-center border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <Link
          href="/momcad"
          className="group inline-flex shrink-0 items-center gap-3 bg-white px-7 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-ink-deep transition-colors duration-300 hover:bg-ink-deep hover:text-white"
        >
          Svi igrači
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
