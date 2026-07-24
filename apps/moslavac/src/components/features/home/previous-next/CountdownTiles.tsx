"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCountdown } from "@/lib/helpers/countdown";
import { TIME_UNIT_FORMS, pluralForm } from "@/lib/helpers/plural";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.1, 0.25, 1] as const;

type CountdownSize = "compact" | "hero";

interface CountdownTilesProps {
  targetUtc: number | null;
  size?: CountdownSize;
  className?: string;
}

interface TileProps {
  value: string;
  label: string;
  delay: number;
  size: CountdownSize;
}

const TILE_BOX: Record<CountdownSize, string> = {
  compact:
    "min-w-[3.25rem] px-3 py-3 sm:min-w-[4.5rem] sm:px-5 sm:py-4 md:min-w-[3.75rem] md:px-3 md:py-3 lg:min-w-[5rem] lg:px-5 lg:py-4 border border-foreground/15 bg-foreground/[0.03] text-foreground",
  hero: "min-w-[4.75rem] px-4 py-5 sm:min-w-[6.25rem] sm:px-6 sm:py-6 md:min-w-[7.5rem] md:px-7 md:py-7 border border-foreground/15 bg-foreground/[0.05] text-foreground",
};

const TILE_DIGIT: Record<CountdownSize, string> = {
  compact: "text-2xl sm:text-4xl md:text-3xl lg:text-5xl",
  hero: "text-4xl sm:text-6xl md:text-8xl",
};

const TILE_LABEL: Record<CountdownSize, string> = {
  compact: "mt-2 text-[0.5rem] tracking-[0.3em] sm:text-[0.55rem] opacity-50",
  hero: "mt-3 text-[0.6rem] tracking-[0.4em] sm:text-xs text-primary",
};

const LIVE_BADGE: Record<CountdownSize, string> = {
  compact:
    "px-5 py-3 text-xl sm:text-2xl md:text-3xl border border-foreground/30",
  hero: "px-8 py-5 text-2xl sm:text-3xl md:text-4xl bg-club-red text-chalk shadow-[0_0_60px_-12px_var(--club-red)]",
};

const TILE_GAP: Record<CountdownSize, string> = {
  compact: "gap-2 sm:gap-3",
  hero: "gap-2 sm:gap-3 md:gap-4",
};

const TILE_RADIUS: Record<CountdownSize, string> = {
  compact: "rounded-lg",
  hero: "rounded-xl",
};

/** Fixed-width digit so the scoreboard never jitters as seconds tick. */
function Digit({ char }: { char: string }) {
  return <span className="inline-block w-[0.62em] text-center">{char}</span>;
}

function Tile({ value, label, delay, size }: TileProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={cn(
        "flex flex-col items-center justify-center",
        TILE_RADIUS[size],
        TILE_BOX[size],
      )}
    >
      <span
        className={cn(
          "block whitespace-nowrap font-display font-black leading-none",
          TILE_DIGIT[size],
        )}
      >
        <Digit char={value.charAt(0)} />
        <Digit char={value.charAt(1)} />
      </span>
      <span className={cn("block font-bold uppercase", TILE_LABEL[size])}>
        {label}
      </span>
    </motion.div>
  );
}

export function CountdownTiles({
  targetUtc,
  size = "compact",
  className,
}: CountdownTilesProps) {
  const reduced = useReducedMotion();
  const c = useCountdown(targetUtc);

  if (c?.isPast) {
    return (
      <motion.span
        initial={{ opacity: 0, y: reduced ? 0 : 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
        className={cn(
          "inline-block rounded-xl font-display font-black uppercase tracking-[0.3em]",
          LIVE_BADGE[size],
          className,
        )}
      >
        UŽIVO
      </motion.span>
    );
  }

  const dd = c ? String(c.days).padStart(2, "0") : "00";
  const hh = c ? String(c.hours).padStart(2, "0") : "00";
  const mm = c ? String(c.minutes).padStart(2, "0") : "00";
  const ss = c ? String(c.seconds).padStart(2, "0") : "00";

  return (
    <div
      className={cn(
        "flex items-stretch justify-center",
        TILE_GAP[size],
        className,
      )}
    >
      <Tile
        value={dd}
        label={pluralForm(c?.days ?? 0, TIME_UNIT_FORMS.day)}
        delay={0.3}
        size={size}
      />
      <Tile
        value={hh}
        label={pluralForm(c?.hours ?? 0, TIME_UNIT_FORMS.hour)}
        delay={0.35}
        size={size}
      />
      <Tile
        value={mm}
        label={pluralForm(c?.minutes ?? 0, TIME_UNIT_FORMS.minute)}
        delay={0.4}
        size={size}
      />
      <Tile
        value={ss}
        label={pluralForm(c?.seconds ?? 0, TIME_UNIT_FORMS.second)}
        delay={0.45}
        size={size}
      />
    </div>
  );
}
