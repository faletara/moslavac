import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchEventKind } from "@/types/hns";

const LABEL: Record<MatchEventKind, string> = {
  goal: "Gol",
  "own-goal": "Autogol",
  yellow: "Žuti karton",
  red: "Crveni karton",
  sub: "Zamjena",
  other: "Događaj",
};

/**
 * Znakovi događaja u sloga poster jeziku — geometrijski, bez ilustracija:
 * gol je pun crni disk, autogol crveni, kartoni su pravokutnici, zamjena strelica.
 */
export function EventIcon({
  kind,
  className,
}: {
  kind: MatchEventKind;
  className?: string;
}) {
  const label = LABEL[kind];

  if (kind === "yellow" || kind === "red") {
    return (
      <span
        role="img"
        aria-label={label}
        className={cn(
          "block h-4 w-2.5",
          kind === "yellow" ? "bg-yellow-400" : "bg-club-red",
          className,
        )}
      />
    );
  }

  if (kind === "sub") {
    return (
      <ArrowLeftRight
        aria-label={label}
        strokeWidth={2.5}
        className={cn("size-4 text-muted-foreground", className)}
      />
    );
  }

  if (kind === "goal" || kind === "own-goal") {
    return (
      <span
        role="img"
        aria-label={label}
        className={cn(
          "block size-3.5 rounded-full",
          kind === "goal" ? "bg-foreground" : "bg-club-red",
          className,
        )}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={label}
      className={cn("block size-1.5 rotate-45 bg-muted-foreground", className)}
    />
  );
}
