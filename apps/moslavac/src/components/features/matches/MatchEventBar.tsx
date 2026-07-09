"use client";

import { motion } from "framer-motion";
import { HnsCrest } from "@/components/HnsCrest";
import {
  isGoalEvent,
  isRedCardEvent,
  isSubstitutionEvent,
  isYellowCardEvent,
} from "@/lib/helpers/events";
import { cn } from "@/lib/utils";
import type { MatchEvent } from "@/types/hns";
import { EventIcon } from "./shared/EventIcon";

interface MatchEventBarProps {
  events: MatchEvent[];
  homeName: string;
  homePicture: string | null;
  awayName: string;
  awayPicture: string | null;
}

function isBarEvent(e: MatchEvent): boolean {
  return (
    isGoalEvent(e) ||
    isYellowCardEvent(e) ||
    isRedCardEvent(e) ||
    isSubstitutionEvent(e)
  );
}

/**
 * Broadcast event bar — a horizontal rail spanning the match minutes. Both
 * crests sit stacked on the left (home top, away bottom) to label the two rows,
 * and every goal/card/substitution is pinned at its minute (home above the
 * line, away below). Icons scale down on mobile to survive the narrow width.
 */
export default function MatchEventBar({
  events,
  homeName,
  homePicture,
  awayName,
  awayPicture,
}: MatchEventBarProps) {
  const barEvents = events.filter(
    (e) =>
      isBarEvent(e) &&
      e.side != null &&
      e.minute != null,
  );

  if (barEvents.length === 0) return null;

  const minuteOf = (e: MatchEvent) => (e.minute ?? 0) + (e.stoppageTime ?? 0);
  const domainMax = Math.max(90, ...barEvents.map(minuteOf));
  const pct = (m: number) => Math.min(97, Math.max(3, (m / domainMax) * 100));

  // Stack events that sit too close horizontally into vertical "floors" away
  // from the rail so the icons never overlap (à la broadcast match centres).
  const MIN_GAP = 5; // percent of the rail before two icons would collide
  const level = new Map<MatchEvent, number>();
  const assignFloors = (lane: MatchEvent[]) => {
    const sorted = [...lane].sort((a, b) => minuteOf(a) - minuteOf(b));
    let lastPct = -100;
    let floor = 0;
    for (const e of sorted) {
      const p = pct(minuteOf(e));
      floor = p - lastPct < MIN_GAP ? floor + 1 : 0;
      level.set(e, floor);
      lastPct = p;
    }
  };
  assignFloors(barEvents.filter((e) => e.side === "home"));
  assignFloors(barEvents.filter((e) => e.side === "away"));

  return (
    <motion.div
      className="mx-auto w-full max-w-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="flex items-stretch gap-2.5 sm:gap-4">
        {/* Both crests hug the rail — home just above, away just below — so each
            clearly labels its row of events */}
        <div className="flex w-7 shrink-0 flex-col sm:w-9">
          <div className="flex flex-1 items-end justify-center pb-1">
            <HnsCrest
              picture={homePicture}
              name={homeName}
              size={36}
              className="size-6 sm:size-8"
            />
          </div>
          <div className="flex flex-1 items-start justify-center pt-1">
            <HnsCrest
              picture={awayPicture}
              name={awayName}
              size={36}
              className="size-6 sm:size-8"
            />
          </div>
        </div>

        <div className="relative h-14 flex-1 sm:h-16">
          {/* Rail */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary/80"
          />
          {/* Kickoff / full-time ticks */}
          <span
            aria-hidden
            className="absolute left-0 top-1/2 h-2.5 w-px -translate-y-1/2 bg-foreground/30"
          />
          <span
            aria-hidden
            className="absolute right-0 top-1/2 h-2.5 w-px -translate-y-1/2 bg-foreground/30"
          />

          {barEvents.map((e, i) => {
            const minute = minuteOf(e);
            const isHome = e.side === "home";
            const floor = level.get(e) ?? 0;
            const offset = 6 + floor * 21;
            const label = `${e.player?.shortName ?? e.player?.name ?? ""} ${minute}'`.trim();
            return (
              <div
                key={`${e.id ?? i}`}
                className={cn(
                  "group absolute -translate-x-1/2 origin-center scale-[0.7] sm:scale-100",
                  isHome ? "bottom-1/2" : "top-1/2",
                )}
                style={{
                  left: `${pct(minute)}%`,
                  ...(isHome
                    ? { marginBottom: `${offset}px` }
                    : { marginTop: `${offset}px` }),
                }}
              >
                <span title={label} className="block">
                  <EventIcon typeName={e.type.name} />
                </span>
                {/* Hover tooltip (desktop) */}
                <span
                  className={cn(
                    "pointer-events-none absolute left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-foreground/15 bg-navy-deep px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.15em] text-foreground opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 sm:block",
                    isHome ? "bottom-full mb-2" : "top-full mt-2",
                  )}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
