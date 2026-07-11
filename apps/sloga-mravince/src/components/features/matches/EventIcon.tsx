import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type EventKind = "goal" | "own-goal" | "yellow" | "red" | "sub" | "other";

/**
 * HNS names event types in free text, and the wording drifts between
 * competitions ("Pogodak", "Gol", "Kazneni udarac"). Match on substrings rather
 * than an id table so an unseen phrasing degrades to `other` instead of
 * throwing away the event.
 */
export function eventKind(typeName: string): EventKind {
  const t = typeName.toLowerCase();

  if (t.includes("žuti") || t.includes("zuti")) return "yellow";
  if (t.includes("crveni")) return "red";
  if (t.includes("zamjena") || t.includes("izmjena")) return "sub";
  if (t.includes("autogol") || t.includes("vlastita")) return "own-goal";

  // "Neiskorišten kazneni udarac" must not read as a goal.
  const missed =
    t.includes("neisko") || t.includes("promaš") || t.includes("promas");
  if (
    !missed &&
    (t.includes("pogod") ||
      t.includes("gol") ||
      t.includes("kazneni") ||
      t.includes("penal"))
  ) {
    return "goal";
  }

  return "other";
}

const LABEL: Record<EventKind, string> = {
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
  kind: EventKind;
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
