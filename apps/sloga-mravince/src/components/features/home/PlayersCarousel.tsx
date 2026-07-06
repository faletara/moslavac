"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { RosterEntry } from "@/types/roster";

function splitName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { first: "", last: parts[0] };
  const last = parts.pop() as string;
  return { first: parts.join(" "), last };
}

function PlayerCard({
  player,
  featured,
}: {
  player: RosterEntry;
  featured: boolean;
}) {
  const { first, last } = splitName(player.displayName);
  return (
    <article
      className={`relative h-75 shrink-0 snap-start overflow-hidden rounded-xl bg-[linear-gradient(135deg,#e5292f_0%,#a51419_100%)] ${
        featured ? "w-75 sm:w-90" : "w-52.5 sm:w-60"
      }`}
    >
      {/* Dijagonalni pattern + sjaj za dubinu */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent,transparent_38px,rgba(255,255,255,0.045)_38px,rgba(255,255,255,0.045)_76px)]" />
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

      {/* Placeholder silueta igrača (dok nema pravih fotografija) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <svg
          viewBox="0 0 200 220"
          className="h-[80%] w-auto text-white/[0.14]"
          fill="currentColor"
          aria-hidden
        >
          <circle cx="100" cy="72" r="44" />
          <path d="M18 220C18 158 54 126 100 126s82 32 82 94Z" />
        </svg>
      </div>

      {/* Scrim pri dnu za čitljivost imena */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/30 to-transparent" />

      {/* Broj dresa */}
      {player.jerseyNumber != null && (
        <span className="absolute left-5 top-4 text-6xl font-black leading-none tracking-tight text-white/95 tabular-nums">
          {player.jerseyNumber}
        </span>
      )}

      {/* Kapetanska oznaka */}
      {player.captain && (
        <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/50 text-xs font-bold text-white">
          C
        </span>
      )}

      {/* Ime */}
      <div className="absolute inset-x-5 bottom-5">
        {first && (
          <p className="text-sm font-medium uppercase tracking-wide text-white/80">
            {first}
          </p>
        )}
        <p className="text-2xl font-extrabold uppercase leading-none tracking-tight text-white">
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
    el.scrollBy({ left: atEnd ? -el.scrollWidth : el.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {players.map((player, i) => (
          <PlayerCard key={player.id} player={player} featured={i === 0} />
        ))}
      </div>

      {/* Kontrole + CTA */}
      <div className="mt-8 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-1 w-40 overflow-hidden rounded-full bg-black/10 sm:w-56">
            <div
              className="h-full rounded-full bg-club-red transition-[width] duration-150"
              style={{ width: `${Math.max(12, progress * 100)}%` }}
            />
          </div>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Sljedeći igrači"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-foreground transition-colors hover:border-club-red hover:text-club-red"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <Link
          href="/momcad"
          className="inline-flex shrink-0 items-center rounded-full bg-club-red px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:scale-105"
        >
          Svi igrači
        </Link>
      </div>
    </div>
  );
}
