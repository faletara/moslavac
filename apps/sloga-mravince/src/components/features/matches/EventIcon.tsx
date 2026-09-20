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
 * Lopta u lucide crtežu — isti glif koji moslavac uzima iz `@lucide/lab`, ovdje
 * upisan izravno: jedan icon node ne opravdava još jednu ovisnost u appu.
 */
function SoccerBall({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M11.9 6.7s-3 1.3-5 3.6c0 0 0 3.6 1.9 5.9 0 0 3.1.7 6.2 0 0 0 1.9-2.3 1.9-5.9 0 .1-2-2.3-5-3.6" />
      <path d="M11.9 6.7V2" />
      <path d="M16.9 10.4s3-1.4 4.5-1.6" />
      <path d="M15 16.3s1.9 2.7 2.9 3.7" />
      <path d="M8.8 16.3S6.9 19 6 20" />
      <path d="M2.6 8.7C4 9 7 10.4 7 10.4" />
    </svg>
  );
}

/**
 * Znakovi događaja u sloga poster jeziku — geometrijski, bez ilustracija:
 * gol je lopta, autogol crvena lopta, kartoni su pravokutnici, zamjena strelica.
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
      <SoccerBall
        label={label}
        className={cn(
          "size-4",
          kind === "goal" ? "text-foreground" : "text-club-red",
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
