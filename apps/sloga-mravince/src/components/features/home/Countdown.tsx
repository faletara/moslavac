"use client";

import { type CountdownState, useCountdown } from "@/lib/helpers/countdown";
import { cn } from "@/lib/utils";

interface CountdownProps {
  /** Kickoff u epoch ms (UTC). */
  target: number;
  className?: string;
}

const TILES: { key: keyof CountdownState; label: string }[] = [
  { key: "days", label: "Dana" },
  { key: "hours", label: "Sati" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sek" },
];

/**
 * Live odbrojavanje do početka utakmice u Anton pločicama s odrezanim kutom.
 * Do prvog ticka renderira crtice (hydration-safe), kad istekne staje na nuli.
 */
export default function Countdown({ target, className }: CountdownProps) {
  const state = useCountdown(target);

  return (
    <div className={cn("flex items-start gap-2.5 sm:gap-4", className)}>
      {TILES.map(({ key, label }, i) => (
        <div key={key} className="flex items-start gap-2.5 sm:gap-4">
          {i > 0 && (
            <span
              aria-hidden
              className="pt-2 font-display text-3xl leading-none text-white/25 sm:text-4xl"
            >
              :
            </span>
          )}
          <div className="flex flex-col items-center">
            <span className="min-w-14 bg-white/6 px-2 py-3 text-center font-display text-4xl leading-none tabular-nums text-white ring-1 ring-white/12 clip-corner sm:min-w-20 sm:text-6xl">
              {state ? String(state[key]).padStart(2, "0") : "––"}
            </span>
            <span className="mt-2 text-[0.58rem] font-bold uppercase tracking-[0.28em] text-white/45">
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
