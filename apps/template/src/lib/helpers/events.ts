import type { HnsMatchEvent } from "@/types/hns";

export const formatEventTime = (
  minuteFull: number,
  stoppageTime?: number
): string => (stoppageTime ? `${minuteFull}+${stoppageTime}` : `${minuteFull}'`);

// HNS event types — keyed by stable `eventType.fcdName` enum (not the localized `name`,
// which can vary, e.g. PENALTY_FAILED appears as both "Neiskorišteni kazneni udarac" and
// "Promašaj"). Verified against /api/live/match/{id}/events.
const GOAL_FCD_NAMES = new Set(["GOAL", "PENALTY", "PENALTY_GOAL", "OWN_GOAL"]);
const PENALTY_GOAL_FCD_NAMES = new Set(["PENALTY", "PENALTY_GOAL"]);
const MISSED_PENALTY_FCD_NAMES = new Set(["PENALTY_FAILED"]);
const YELLOW_FCD_NAMES = new Set(["YELLOW"]);
const RED_FCD_NAMES = new Set(["RED", "SECOND_YELLOW"]);
const SUBSTITUTION_FCD_NAMES = new Set(["SUBSTITUTION"]);

const hasFcd = (event: HnsMatchEvent, set: Set<string>): boolean => {
  const fcd = event.eventType?.fcdName;
  return !!fcd && set.has(fcd);
};

export const isGoalEvent = (event: HnsMatchEvent): boolean =>
  hasFcd(event, GOAL_FCD_NAMES);

export const isPenaltyGoalEvent = (event: HnsMatchEvent): boolean =>
  hasFcd(event, PENALTY_GOAL_FCD_NAMES);

export const isMissedPenaltyEvent = (event: HnsMatchEvent): boolean =>
  hasFcd(event, MISSED_PENALTY_FCD_NAMES);

export const isYellowCardEvent = (event: HnsMatchEvent): boolean =>
  hasFcd(event, YELLOW_FCD_NAMES);

export const isRedCardEvent = (event: HnsMatchEvent): boolean =>
  hasFcd(event, RED_FCD_NAMES);

export const isSubstitutionEvent = (event: HnsMatchEvent): boolean =>
  hasFcd(event, SUBSTITUTION_FCD_NAMES);

export interface ScorerGoal {
  minute: number;
  isPenalty: boolean;
  isMissedPenalty: boolean;
}

export interface ScorerEntry {
  name: string;
  personId: number | null;
  picture: string | null;
  goals: ScorerGoal[];
}

const groupScorersForSide = (
  events: HnsMatchEvent[],
  side: "home" | "away",
): ScorerEntry[] => {
  const goals = events.filter(
    (e) =>
      (isGoalEvent(e) || isMissedPenaltyEvent(e)) &&
      (side === "home" ? e.homeTeam === true : e.homeTeam === false),
  );

  const map = new Map<string, ScorerEntry>();
  for (const goal of goals) {
    const name = (goal.player?.name ?? "").trim() || "Nepoznat strijelac";
    const missed = isMissedPenaltyEvent(goal);
    const entry: ScorerGoal = {
      minute: goal.minuteFull ?? goal.minute ?? 0,
      isPenalty: missed || isPenaltyGoalEvent(goal),
      isMissedPenalty: missed,
    };
    const existing = map.get(name);
    if (existing) {
      existing.goals.push(entry);
      if (existing.personId == null && goal.player?.personId != null) {
        existing.personId = goal.player.personId;
      }
      if (!existing.picture && goal.player?.picture) {
        existing.picture = goal.player.picture;
      }
    } else {
      map.set(name, {
        name,
        personId: goal.player?.personId ?? null,
        picture: goal.player?.picture ?? null,
        goals: [entry],
      });
    }
  }
  return Array.from(map.values()).map((s) => ({
    ...s,
    goals: s.goals.sort((a, b) => a.minute - b.minute),
  }));
};

export const getScorers = (
  events: HnsMatchEvent[] | undefined,
): { home: ScorerEntry[]; away: ScorerEntry[] } => ({
  home: groupScorersForSide(events ?? [], "home"),
  away: groupScorersForSide(events ?? [], "away"),
});

export interface CardCounts {
  homeYellow: number;
  homeRed: number;
  awayYellow: number;
  awayRed: number;
}

export const getCardCounts = (
  events: HnsMatchEvent[] | undefined,
): CardCounts => {
  const counts: CardCounts = {
    homeYellow: 0,
    homeRed: 0,
    awayYellow: 0,
    awayRed: 0,
  };
  for (const event of events ?? []) {
    const isHome = event.homeTeam === true;
    const isAway = event.homeTeam === false;
    if (isYellowCardEvent(event)) {
      if (isHome) counts.homeYellow += 1;
      else if (isAway) counts.awayYellow += 1;
    } else if (isRedCardEvent(event)) {
      if (isHome) counts.homeRed += 1;
      else if (isAway) counts.awayRed += 1;
    }
  }
  return counts;
};

export const countSubstitutions = (
  events: HnsMatchEvent[] | undefined,
): number => (events ?? []).filter(isSubstitutionEvent).length;

export interface ScoreSnapshot {
  home: number;
  away: number;
}

export const buildScoreProgression = (
  events: HnsMatchEvent[] | undefined,
): Map<number, ScoreSnapshot> => {
  const map = new Map<number, ScoreSnapshot>();
  if (!events) return map;

  const sorted = [...events].sort((a, b) => {
    const aMin = a.minuteFull ?? a.minute ?? 0;
    const bMin = b.minuteFull ?? b.minute ?? 0;
    if (aMin !== bMin) return aMin - bMin;
    return (a.orderNumber ?? 0) - (b.orderNumber ?? 0);
  });

  let home = 0;
  let away = 0;
  for (const e of sorted) {
    if (!isGoalEvent(e)) continue;
    if (e.homeTeam === true) home += 1;
    else if (e.homeTeam === false) away += 1;
    if (e.eventId != null) map.set(e.eventId, { home, away });
  }
  return map;
};
