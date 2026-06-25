import { soccerBall } from "@lucide/lab";
import { ArrowLeftRight, Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventIconProps {
  eventType: string;
  className?: string;
  /** Colours the substitution arrow: green for on, red for off. */
  subDirection?: "in" | "out";
}

/**
 * Single source of truth for event glyphs — used identically in the timeline
 * and the lineups so a goal/card/substitution always reads the same.
 */
export function EventIcon({
  eventType,
  className,
  subDirection,
}: EventIconProps) {
  const t = eventType.toLowerCase();

  if (t.includes("žuti") || t.includes("zuti")) {
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
  if (t.includes("crveni")) {
    return (
      <span
        role="img"
        aria-label="Crveni karton"
        className={cn("block h-3.5 w-2.5 rounded-[1px] bg-red-500", className)}
      />
    );
  }
  if (t.includes("zamjena")) {
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
  const missedPenalty =
    t.includes("neisko") || t.includes("promaš") || t.includes("promas");
  if (
    !missedPenalty &&
    (t.includes("pogod") ||
      t.includes("gol") ||
      t.includes("goal") ||
      t.includes("kazneni") ||
      t.includes("penal"))
  ) {
    return (
      <Icon
        iconNode={soccerBall}
        aria-label="Gol"
        strokeWidth={2}
        className={cn("size-4", className)}
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
