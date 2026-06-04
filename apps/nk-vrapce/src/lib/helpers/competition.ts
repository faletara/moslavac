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

/** Display order for grouped views: oldest age category first, "unknown" last. */
export const CATEGORY_ORDER: CompetitionCategory[] = [
  "seniors",
  "juniors",
  "cadets",
  "older-pioneers",
  "younger-pioneers",
  "limaci",
  "prstici",
  "unknown",
];

export interface CompetitionCategoryGroup<T> {
  category: CompetitionCategory;
  label: string;
  items: T[];
}

/**
 * Buckets items by their competition category and returns only the non-empty
 * groups, ordered by {@link CATEGORY_ORDER}. The `getName` accessor lets this
 * work with any shape that carries a competition name.
 */
export function groupByCompetitionCategory<T>(
  items: T[],
  getName: (item: T) => string | null | undefined,
): CompetitionCategoryGroup<T>[] {
  const buckets = new Map<CompetitionCategory, T[]>();
  for (const item of items) {
    const category = getCompetitionCategory(getName(item));
    const bucket = buckets.get(category);
    if (bucket) bucket.push(item);
    else buckets.set(category, [item]);
  }

  return CATEGORY_ORDER.filter((category) => buckets.has(category)).map(
    (category) => ({
      category,
      label: getCategoryShortLabel(category),
      items: buckets.get(category) ?? [],
    }),
  );
}

/** Football acronyms that must stay uppercase when prettifying names. */
const COMPETITION_ACRONYMS = new Set([
  "NL",
  "NS",
  "NK",
  "HNL",
  "HNLŽ",
  "HNLŽM",
  "ŽNL",
  "MNL",
  "HŽNL",
  "ZNS",
]);

function capitalizeCompetitionWord(word: string): string {
  if (!word) return word;
  // Keep anything with digits intact: "2.", "1", scores, etc.
  if (/\d/.test(word)) return word;

  const letters = word.replace(/[^\p{L}]/gu, "");
  // Acronyms (NL, NS, HNLŽM…) stay uppercase.
  if (letters && COMPETITION_ACRONYMS.has(letters.toLocaleUpperCase("hr"))) {
    return word.toLocaleUpperCase("hr");
  }
  // Single letters are group markers ("A", "B") — keep them uppercase.
  if (letters.length === 1) return word.toLocaleUpperCase("hr");

  const lower = word.toLocaleLowerCase("hr");
  return lower.replace(/\p{L}/u, (c) => c.toLocaleUpperCase("hr"));
}

/**
 * Turns a raw HNS competition name into something readable in a menu:
 * drops the repeated season tag (e.g. "25/26") since the whole list is the
 * current season, and converts SHOUTING CAPS into normal case while keeping
 * acronyms and group letters intact.
 */
export function toReadableCompetitionName(
  name: string | null | undefined,
): string {
  if (!name) return "";
  return name
    .replace(/\b\d{2}\/\d{2}\b/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(capitalizeCompetitionWord)
    .join(" ")
    .replace(/[\s–-]+$/u, "")
    .trim();
}

/**
 * Default blue palette (anchored on #026CB6) — override per club via theme. Steps go
 * monotonically dark → light following age hierarchy: oldest (seniors) is the
 * deepest navy, youngest (prstići) the lightest. Brand blue lands on older
 * pioneers, the midpoint of the scale. Every shade stays saturated — no
 * pastels — so the chips read as one tight blue family.
 */
export function getCategoryChipClass(category: CompetitionCategory): string {
  switch (category) {
    case "seniors":
      return "bg-[#013F6B] text-white";
    case "juniors":
      return "bg-[#01497D] text-white";
    case "cadets":
      return "bg-[#015A99] text-white";
    case "older-pioneers":
      return "bg-[#026CB6] text-white";
    case "younger-pioneers":
      return "bg-[#1F7BBF] text-white";
    case "limaci":
      return "bg-[#3389C7] text-white";
    case "prstici":
      return "bg-[#4A98CF] text-white";
    case "unknown":
      return "bg-muted text-muted-foreground";
  }
}

export function getCategoryBorderClass(category: CompetitionCategory): string {
  switch (category) {
    case "seniors":
      return "border-[#013F6B]";
    case "juniors":
      return "border-[#01497D]";
    case "cadets":
      return "border-[#015A99]";
    case "older-pioneers":
      return "border-[#026CB6]";
    case "younger-pioneers":
      return "border-[#1F7BBF]";
    case "limaci":
      return "border-[#3389C7]";
    case "prstici":
      return "border-[#4A98CF]";
    case "unknown":
      return "border-border";
  }
}
