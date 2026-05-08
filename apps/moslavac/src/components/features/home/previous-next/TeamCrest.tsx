"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCometImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { HnsTeam } from "@/types/hns";

type CrestSize = "sm" | "md" | "lg";

interface TeamCrestProps {
  team: HnsTeam | null;
  size?: CrestSize;
  showName?: boolean;
  className?: string;
}

const AVATAR_SIZE: Record<CrestSize, string> = {
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

function fallbackInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

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
      <Avatar className={AVATAR_SIZE[size]}>
        {picture && (
          <AvatarImage src={getCometImageUrl(picture)} alt={name} />
        )}
        <AvatarFallback className="bg-transparent text-xs font-bold opacity-70">
          {fallbackInitials(name)}
        </AvatarFallback>
      </Avatar>
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
