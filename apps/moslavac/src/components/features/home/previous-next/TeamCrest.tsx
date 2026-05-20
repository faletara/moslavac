"use client";

import { HnsCrest } from "@/components/HnsCrest";
import { cn } from "@/lib/utils";
import type { HnsTeam } from "@/types/hns";

type CrestSize = "sm" | "md" | "lg";

interface TeamCrestProps {
  team: HnsTeam | null;
  size?: CrestSize;
  showName?: boolean;
  className?: string;
}

const CREST_PX: Record<CrestSize, number> = {
  sm: 48,
  md: 80,
  lg: 128,
};

const CREST_CLASS: Record<CrestSize, string> = {
  sm: "size-10 sm:size-12",
  md: "size-14 md:size-20",
  lg: "size-20 sm:size-24 md:size-32",
};

const NAME_SIZE: Record<CrestSize, string> = {
  sm: "text-xs sm:text-sm",
  md: "text-sm sm:text-base md:text-lg",
  lg: "text-base sm:text-lg md:text-xl",
};

const NAME_WIDTH: Record<CrestSize, string> = {
  sm: "max-w-[8ch]",
  md: "max-w-[10ch] md:max-w-[14ch]",
  lg: "max-w-[12ch] md:max-w-[16ch]",
};

export function TeamCrest({
  team,
  size = "md",
  showName = true,
  className,
}: TeamCrestProps) {
  const name = team?.name ?? "N/A";
  const picture = team?.picture ?? "";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <HnsCrest
        picture={picture}
        name={name}
        size={CREST_PX[size]}
        className={cn(CREST_CLASS[size], "object-contain")}
      />
      {showName && (
        <span
          className={cn(
            "line-clamp-2 text-center font-black uppercase leading-tight tracking-tight",
            NAME_SIZE[size],
            NAME_WIDTH[size],
          )}
        >
          {name}
        </span>
      )}
    </div>
  );
}
