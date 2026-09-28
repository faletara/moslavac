"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { HnsCrest } from "@/components/HnsCrest";
import { cn } from "@/lib/utils";
import type { Match } from "@/types/hns";
import { EventIcon } from "./EventIcon";
import type { RibbonItem } from "./timeline";

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
 * Znakovi koji stoje preblizu na osi slažu se u katove, dalje od šine — kao na
 * TV match centrima — pa se ne preklapaju ni kad padnu dva gola u tri minute.
 */
function floors(items: RibbonItem[], gap: number): Map<string, number> {
  const level = new Map<string, number>();

  for (const side of ["home", "away"] as const) {
    let last = -100;
    let floor = 0;

    for (const item of items.filter((i) => i.side === side)) {
      floor = item.position - last < gap ? floor + 1 : 0;
      level.set(item.key, floor);
      last = item.position;
    }
  }

  return level;
}

/**
 * Lenta utakmice — vodoravna os od 0' do 90' iznad popisa. Domaći golovi i
 * kartoni vise iznad šine, gostujući ispod; grbovi lijevo označavaju redove.
 * Klik na znak skrola do njegovog retka u popisu i kratko ga istakne.
 */
export default function MatchRibbon({
  match,
  items,
  length,
}: {
  match: Match;
  items: RibbonItem[];
  /** Duljina osi u minutama. */
  length: number;
}) {
  const reduced = useReducedMotion();
  const wide = useWide();
  const flash = useRef<{ row: HTMLElement; timer: number } | null>(null);

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

  const lane = (side: "home" | "away") => (
    <div
      className="relative"
      style={{ height: 36 + maxFloor(side) * FLOOR }}
    >
      {items
        .filter((item) => item.side === side)
        .map((item) => {
          const goal =
            item.eventKind === "goal" || item.eventKind === "own-goal";
          const offset = (level.get(item.key) ?? 0) * FLOOR;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => jump(item.anchor)}
              aria-label={item.label}
              className={cn(
                "group absolute flex size-6 -translate-x-1/2 sm:size-8 items-center justify-center outline-none transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-club-red active:scale-95",
                side === "home" ? "bottom-1" : "top-1",
                goal && "rounded-full bg-ink-deep text-chalk shadow-[0_6px_14px_-6px] shadow-ink-deep/70",
              )}
              style={{
                left: `${item.position}%`,
                ...(side === "home"
                  ? { marginBottom: offset }
                  : { marginTop: offset }),
              }}
            >
              <EventIcon
                kind={item.eventKind}
                className={cn(
                  goal && "size-3.5 sm:size-4",
                  item.eventKind === "goal" && "text-chalk",
                  !goal && "h-3.5 w-2.5 shadow-sm sm:h-[1.1rem] sm:w-3",
                )}
              />
              <span
                className={cn(
                  "pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap bg-ink-deep px-2.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-chalk opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block",
                  side === "home" ? "bottom-full mb-2" : "top-full mt-2",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
    </div>
  );

  return (
    <div className="border border-foreground/10 bg-white/60 px-4 py-5 sm:px-6 dark:bg-white/5">
      <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[2.25rem_minmax(0,1fr)] sm:gap-x-5">
        {/* Grbovi označavaju redove: domaći iznad šine, gosti ispod. */}
        <div className="flex items-end justify-center pb-1.5">
          <HnsCrest
            picture={match.homeTeam?.picture}
            name={match.homeTeam?.name}
            size={36}
            className="size-7 rounded-full bg-white p-0.5 ring-1 ring-black/5 sm:size-9"
          />
        </div>
        <div className="mx-4">{lane("home")}</div>

        <div />
        <div className="relative mx-4 h-px bg-foreground/25">
          {/* Početak, poluvrijeme, kraj */}
          {[0, (45 / length) * 100, 100].map((at) => (
            <span
              key={at}
              aria-hidden
              className={cn(
                "absolute top-1/2 w-px -translate-x-1/2 -translate-y-1/2 bg-foreground/40",
                at > 0 && at < 100 ? "h-5" : "h-3",
              )}
              style={{ left: `${at}%` }}
            />
          ))}
        </div>

        <div className="flex items-start justify-center pt-1.5">
          <HnsCrest
            picture={match.awayTeam?.picture}
            name={match.awayTeam?.name}
            size={36}
            className="size-7 rounded-full bg-white p-0.5 ring-1 ring-black/5 sm:size-9"
          />
        </div>
        <div className="mx-4">{lane("away")}</div>

        <div />
        <div className="relative mx-4 mt-2 h-3 text-[0.58rem] font-bold uppercase leading-none tracking-[0.16em] text-muted-foreground tabular-nums">
          <span className="absolute left-0 -translate-x-1/2">0&apos;</span>
          <span
            className="absolute -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${(45 / length) * 100}%` }}
          >
            45&apos;
            {halfScore && (
              <span className="ml-1.5 text-foreground">{halfScore}</span>
            )}
          </span>
          <span className="absolute right-0 translate-x-1/2">
            {length}&apos;
          </span>
        </div>
      </div>
    </div>
  );
}
