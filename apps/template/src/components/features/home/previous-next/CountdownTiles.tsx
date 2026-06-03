"use client";

import { useCountdown } from "@/lib/helpers/countdown";
import { cn } from "@/lib/utils";

type CountdownSize = "compact" | "hero";

interface CountdownTilesProps {
  targetUtc: number | null;
  size?: CountdownSize;
  className?: string;
}

interface TileProps {
  value: string;
  label: string;
  size: CountdownSize;
}

const TILE_BOX: Record<CountdownSize, string> = {
  compact:
    "min-w-[3.25rem] px-3 py-3 sm:min-w-[4.5rem] sm:px-5 sm:py-4 md:min-w-[3.75rem] md:px-3 md:py-3 lg:min-w-[5rem] lg:px-5 lg:py-4",
  hero: "min-w-[4.75rem] px-4 py-5 sm:min-w-[6.25rem] sm:px-6 sm:py-6 md:min-w-[7.5rem] md:px-7 md:py-7",
};

const LIVE_BADGE: Record<CountdownSize, string> = {
  compact: "px-5 py-3",
  hero: "px-8 py-5",
};

const TILE_GAP: Record<CountdownSize, string> = {
  compact: "gap-2 sm:gap-3",
  hero: "gap-2 sm:gap-3 md:gap-4",
};

function Tile({ value, label, size }: TileProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        TILE_BOX[size],
      )}
    >
      <span className="block">{value}</span>
      <span className="block">{label}</span>
    </div>
  );
}

export function CountdownTiles({
  targetUtc,
  size = "compact",
  className,
}: CountdownTilesProps) {
  const c = useCountdown(targetUtc);

  if (c?.isPast) {
    return (
      <span
        className={cn(
          "inline-block",
          LIVE_BADGE[size],
          className,
        )}
      >
        UŽIVO
      </span>
    );
  }

  const dd = c ? String(c.days).padStart(2, "0") : "··";
  const hh = c ? String(c.hours).padStart(2, "0") : "··";
  const mm = c ? String(c.minutes).padStart(2, "0") : "··";
  const ss = c ? String(c.seconds).padStart(2, "0") : "··";

  return (
    <div
      className={cn(
        "flex items-stretch justify-center",
        TILE_GAP[size],
        className,
      )}
    >
      <Tile value={dd} label="dana" size={size} />
      <Tile value={hh} label="sati" size={size} />
      <Tile value={mm} label="min" size={size} />
      <Tile value={ss} label="sek" size={size} />
    </div>
  );
}
