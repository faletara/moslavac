"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HnsCrest } from "@/components/HnsCrest";
import { cn } from "@/lib/utils";
import type { Match, MatchSide } from "@/types/hns";
import { EventIcon } from "./EventIcon";
import { floors, type RibbonItem } from "./timeline";

/**
 * Koliko posto osi dva znaka trebaju razmaka prije nego se preklope. Na
 * mobitelu je os ~220px pa znak od 24px zauzme više od 10% nje.
 */
const MIN_GAP = { narrow: 12, wide: 4.5 };

const WIDE = "(min-width: 640px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

/** `sm` i šire. Server pretpostavlja usko — gušći razmak ne škodi širokom ekranu. */
function useWide(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}
/** Visina jednog "kata" kad se znakovi slažu jedan iznad drugoga, u px. */
const FLOOR = 26;


/**
 * Lenta utakmice — vodoravna os od 0' do 90' iznad popisa. Domaći golovi i
 * kartoni vise iznad šine, gostujući ispod; grbovi lijevo označavaju redove.
 * Klik na znak skrola do njegovog retka u popisu i kratko ga istakne.
 */
export default function MatchRibbon({
  match,
  items,
  length,
  ourSide,
}: {
  match: Match;
  items: RibbonItem[];
  /** Duljina osi u minutama. */
  length: number;
  /** Naši golovi su crveni, kao crveni rub u popisu. */
  ourSide: MatchSide | null;
}) {
  const reduced = useReducedMotion();
  const wide = useWide();
  const flash = useRef<{ row: HTMLElement; timer: number } | null>(null);
  // Opis znaka pod mišem/fokusom. Stoji u svom redu iznad lente, a ne kao
  // tooltip uz znak — tooltip je prekrivao susjedne znakove i oznake osi.
  const [active, setActive] = useState<RibbonItem | null>(null);

  // Novi skok gasi prethodni bljesak, a odlazak sa stranice gasi tajmer.
  const clearFlash = () => {
    if (!flash.current) return;
    window.clearTimeout(flash.current.timer);
    delete flash.current.row.dataset.flash;
    flash.current = null;
  };

  useEffect(() => clearFlash, []);

  if (items.length === 0) return null;

  const level = floors(items, wide ? MIN_GAP.wide : MIN_GAP.narrow);
  const maxFloor = (side: "home" | "away") =>
    Math.max(
      0,
      ...items.filter((i) => i.side === side).map((i) => level.get(i.key) ?? 0),
    );

  const halfScore =
    match.score.home?.half != null && match.score.away?.half != null
      ? `${match.score.home.half}:${match.score.away.half}`
      : null;

  const jump = (anchor: string) => {
    const row = document.getElementById(anchor);

    if (!row) return;

    row.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
    clearFlash();
    row.dataset.flash = "";
    flash.current = { row, timer: window.setTimeout(clearFlash, 1600) };
  };

  /** Razmak od šine do najnižeg kata, u px — tu stane "noga" znaka. */
  const STEM = 10;

  const lane = (side: "home" | "away") => (
    <div
      className="relative"
      style={{ height: STEM + 34 + maxFloor(side) * FLOOR }}
    >
      {items
        .filter((item) => item.side === side)
        .map((item) => {
          const goal =
            item.eventKind === "goal" || item.eventKind === "own-goal";
          const ours = ourSide != null && item.side === ourSide;
          const distance = STEM + (level.get(item.key) ?? 0) * FLOOR;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => jump(item.anchor)}
              onMouseEnter={() => setActive(item)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(item)}
              onBlur={() => setActive(null)}
              aria-label={item.label}
              className={cn(
                "group absolute flex -translate-x-1/2 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-club-red focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                goal
                  ? "size-6 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 sm:size-7"
                  : "h-6 w-4 sm:h-7",
                goal &&
                  (ours
                    ? "bg-club-red text-white"
                    : "bg-ink-deep text-chalk dark:bg-chalk dark:text-ink-deep"),
              )}
              style={{
                left: `${item.position}%`,
                ...(side === "home"
                  ? { bottom: distance }
                  : { top: distance }),
              }}
            >
              {/* Noga — veže znak za njegovu minutu na šini. */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute left-1/2 w-px -translate-x-1/2 bg-foreground/30",
                  side === "home" ? "top-full" : "bottom-full",
                )}
                style={{ height: distance }}
              />
              <EventIcon
                kind={item.eventKind}
                className={cn(
                  goal && "size-3.5 text-current sm:size-4",
                  !goal &&
                    "h-3.5 w-2.5 transition-transform duration-200 group-hover:scale-110 sm:h-4 sm:w-[0.7rem]",
                )}
              />
            </button>
          );
        })}
    </div>
  );

  // Crtica svakih 15', plus kraj osi kad produžeci ne padnu na višekratnik.
  const minutes = Array.from(
    { length: Math.floor(length / 15) + 1 },
    (_, i) => i * 15,
  );

  if (minutes.at(-1) !== length) minutes.push(length);

  const crest = (team: Match["homeTeam"]) => (
    <HnsCrest
      picture={team?.picture}
      name={team?.name}
      size={28}
      className="size-6 sm:size-7"
    />
  );

  return (
    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[1.75rem_minmax(0,1fr)] sm:gap-x-6">
      <div />
      {/* Visina je rezervirana i kad je prazno, da lenta ne skače. */}
      <p
        aria-live="polite"
        className={cn(
          "mx-3 mb-3 h-4 truncate text-[0.62rem] font-bold uppercase leading-4 tracking-[0.16em] transition-opacity duration-150",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        {active?.label}
      </p>

      {/* Grbovi označavaju redove: domaći iznad šine, gosti ispod. */}
      <div className="flex items-end pb-2">{crest(match.homeTeam)}</div>
      <div className="mx-3">{lane("home")}</div>

      <div />
      <div className="relative mx-3 h-0.5 bg-foreground/15">
        {minutes.map((minute) => (
          <span
            key={minute}
            aria-hidden
            className={cn(
              "absolute top-1/2 w-px -translate-x-1/2 -translate-y-1/2",
              minute === 45
                ? "h-4 bg-foreground/50"
                : "hidden h-2 bg-foreground/25 sm:block",
              (minute === 0 || minute === length) && "block h-2",
            )}
            style={{ left: `${(minute / length) * 100}%` }}
          />
        ))}
      </div>

      <div className="flex items-start pt-2">{crest(match.awayTeam)}</div>
      <div className="mx-3">{lane("away")}</div>

      <div />
      <div className="relative mx-3 mt-1 h-3 text-[0.58rem] font-bold leading-none tracking-[0.12em] text-muted-foreground tabular-nums">
        {minutes.map((minute) => (
          <span
            key={minute}
            className={cn(
              "absolute top-0 flex h-3 -translate-x-1/2 items-center whitespace-nowrap",
              minute !== 0 &&
                minute !== 45 &&
                minute !== length &&
                "hidden sm:block",
              minute === 45 && "text-foreground",
            )}
            style={{ left: `${(minute / length) * 100}%` }}
          >
            {minute}&apos;
            {minute === 45 && halfScore && (
              <span className="ml-1.5 font-display text-[0.7rem] leading-none tracking-normal text-club-red">
                {halfScore}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
