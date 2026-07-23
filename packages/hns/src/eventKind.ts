import type { MatchEventKind, MatchEventType } from "@/types/hns";

/**
 * HNS exposes a stable per-event code (`fcdName`) alongside a free-text name.
 * The code is authoritative; the name is only consulted when a competition
 * omits the code, which older HNS datasets do.
 */
const KIND_BY_CODE: Record<string, MatchEventKind> = {
  GOAL: "goal",
  PENALTY: "goal",
  PENALTY_GOAL: "goal",
  OWN_GOAL: "own-goal",
  PENALTY_FAILED: "other",
  YELLOW: "yellow",
  RED: "red",
  SECOND_YELLOW: "red",
  SUBSTITUTION: "sub",
};

/**
 * The wording drifts between competitions ("Pogodak", "Gol", "Kazneni udarac"),
 * so match on substrings rather than an exact table — an unseen phrasing
 * degrades to `other` instead of throwing the event away.
 */
function kindFromName(typeName: string): MatchEventKind {
  const t = typeName.toLowerCase();

  // A second yellow IS a sending-off, so it must land on `red` here exactly as
  // the SECOND_YELLOW code does — otherwise the same event reads differently
  // depending on whether HNS sent a code.
  const yellow = t.includes("žuti") || t.includes("zuti");
  if (yellow && (t.includes("drugi") || t.includes("2."))) return "red";
  if (yellow) return "yellow";
  if (t.includes("crveni")) return "red";
  if (t.includes("zamjena") || t.includes("izmjena")) return "sub";
  if (t.includes("autogol") || t.includes("vlastit")) return "own-goal";

  // "Neiskorišten kazneni udarac" must not read as a goal.
  const missed =
    t.includes("neisko") || t.includes("promaš") || t.includes("promas");
  if (
    !missed &&
    (t.includes("pogod") ||
      t.includes("gol") ||
      t.includes("goal") ||
      t.includes("kazneni") ||
      t.includes("penal"))
  ) {
    return "goal";
  }

  return "other";
}

/** Semantic kind of a match event, so no component parses HNS text itself. */
export function eventKind(type: Pick<MatchEventType, "code" | "name">) {
  const byCode = type.code ? KIND_BY_CODE[type.code] : undefined;
  return byCode ?? kindFromName(type.name);
}
