import { soccerBall } from "@lucide/lab";
import { ArrowLeftRight, Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchEventKind } from "@/types/hns";

interface EventIconProps {
  kind: MatchEventKind;
  className?: string;
  /** Colours the substitution arrow: green for on, red for off. */
  subDirection?: "in" | "out";
}

/**
 * Single source of truth for event glyphs — used identically in the timeline
 * and the lineups so a goal/card/substitution always reads the same.
 */
export function EventIcon({ kind, className, subDirection }: EventIconProps) {
  if (kind === "yellow") {
    return (
      <span
        role="img"
        aria-label="Žuti karton"
        className={cn(
          "block h-3.5 w-2.5 rounded-[1px] bg-yellow-400",
          className,
        )}
      />
    );
  }
  if (kind === "red") {
    return (
      <span
        role="img"
        aria-label="Crveni karton"
        className={cn("block h-3.5 w-2.5 rounded-[1px] bg-red-500", className)}
      />
    );
  }
  if (kind === "sub") {
    return (
      <ArrowLeftRight
        aria-label={
          subDirection === "out"
            ? "Izašao"
            : subDirection === "in"
              ? "Ušao"
              : "Zamjena"
        }
        strokeWidth={2.5}
        className={cn(
          "size-4",
          subDirection === "in" && "text-emerald-500",
          subDirection === "out" && "text-red-500",
          !subDirection && "text-muted-foreground",
          className,
        )}
      />
    );
  }
  if (kind === "goal" || kind === "own-goal") {
    return (
      <Icon
        iconNode={soccerBall}
        aria-label={kind === "own-goal" ? "Autogol" : "Gol"}
        strokeWidth={2}
        className={cn(
          "size-4",
          kind === "own-goal" && "text-red-500",
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "block size-1.5 rounded-full bg-muted-foreground",
        className,
      )}
    />
  );
}
