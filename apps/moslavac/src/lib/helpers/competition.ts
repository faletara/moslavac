export type CompetitionCategory =
  | "seniors"
  | "juniors"
  | "cadets"
  | "older-pioneers"
  | "younger-pioneers"
  | "limaci"
  | "prstici"
  | "unknown";

export function getCompetitionCategory(
  name: string | null | undefined,
): CompetitionCategory {
  if (!name) return "unknown";
  const n = name.toLowerCase();

  if (n.includes("prsti")) return "prstici";
  if (n.includes("limač") || n.includes("limac")) return "limaci";
  if (n.includes("stariji pionir")) return "older-pioneers";
  if (n.includes("mlađi pionir") || n.includes("mladji pionir"))
    return "younger-pioneers";
  if (n.includes("pionir")) return "older-pioneers";
  if (n.includes("kadet")) return "cadets";
  if (n.includes("junior")) return "juniors";

  return "seniors";
}

export function getCategoryShortLabel(category: CompetitionCategory): string {
  switch (category) {
    case "seniors":
      return "Seniori";
    case "juniors":
      return "Juniori";
    case "cadets":
      return "Kadeti";
    case "older-pioneers":
      return "St. pioniri";
    case "younger-pioneers":
      return "Ml. pioniri";
    case "limaci":
      return "Limači";
    case "prstici":
      return "Prstići";
    case "unknown":
      return "Ostalo";
  }
}

export function getCategoryChipClass(category: CompetitionCategory): string {
  switch (category) {
    case "seniors":
      return "bg-foreground text-background";
    case "juniors":
      return "bg-foreground/85 text-background";
    case "cadets":
      return "bg-foreground/70 text-background";
    case "older-pioneers":
      return "bg-foreground/55 text-background";
    case "younger-pioneers":
      return "bg-foreground/40 text-background";
    case "limaci":
      return "bg-foreground/25 text-foreground";
    case "prstici":
      return "bg-foreground/15 text-foreground";
    case "unknown":
      return "bg-muted text-muted-foreground";
  }
}
