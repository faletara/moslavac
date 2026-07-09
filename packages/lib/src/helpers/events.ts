import type { MatchEvent } from "@/types/hns";

export const formatEventTime = (
  minute: number,
  stoppageTime?: number
): string => (stoppageTime ? `${minute}+${stoppageTime}` : `${minute}'`);

// Event types are keyed by the stable HNS fcd code exposed by the adapter.
const GOAL_FCD_NAMES = new Set(["GOAL", "PENALTY", "PENALTY_GOAL", "OWN_GOAL"]);
const PENALTY_GOAL_FCD_NAMES = new Set(["PENALTY", "PENALTY_GOAL"]);
const MISSED_PENALTY_FCD_NAMES = new Set(["PENALTY_FAILED"]);
const YELLOW_FCD_NAMES = new Set(["YELLOW"]);
const RED_FCD_NAMES = new Set(["RED", "SECOND_YELLOW"]);
const SUBSTITUTION_FCD_NAMES = new Set(["SUBSTITUTION"]);

const hasFcd = (event: MatchEvent, set: Set<string>): boolean => {
  const fcd = event.type.code;
  return !!fcd && set.has(fcd);
};

export const isGoalEvent = (event: MatchEvent): boolean =>
  hasFcd(event, GOAL_FCD_NAMES);

export const isPenaltyGoalEvent = (event: MatchEvent): boolean =>
  hasFcd(event, PENALTY_GOAL_FCD_NAMES);

export const isMissedPenaltyEvent = (event: MatchEvent): boolean =>
  hasFcd(event, MISSED_PENALTY_FCD_NAMES);

export const isYellowCardEvent = (event: MatchEvent): boolean =>
  hasFcd(event, YELLOW_FCD_NAMES);

export const isRedCardEvent = (event: MatchEvent): boolean =>
  hasFcd(event, RED_FCD_NAMES);

export const isSubstitutionEvent = (event: MatchEvent): boolean =>
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
  events: MatchEvent[],
  side: "home" | "away",
): ScorerEntry[] => {
  const goals = events.filter(
    (e) =>
      (isGoalEvent(e) || isMissedPenaltyEvent(e)) &&
      e.side === side,
  );

  const map = new Map<string, ScorerEntry>();
  for (const goal of goals) {
    const name = (goal.player?.name ?? "").trim() || "Nepoznat strijelac";
    const missed = isMissedPenaltyEvent(goal);
    const entry: ScorerGoal = {
      minute: goal.minute ?? 0,
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
  events: MatchEvent[] | undefined,
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
  events: MatchEvent[] | undefined,
): CardCounts => {
  const counts: CardCounts = {
    homeYellow: 0,
    homeRed: 0,
    awayYellow: 0,
    awayRed: 0,
  };
  for (const event of events ?? []) {
    const isHome = event.side === "home";
    const isAway = event.side === "away";
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
  events: MatchEvent[] | undefined,
): number => (events ?? []).filter(isSubstitutionEvent).length;

export interface ScoreSnapshot {
  home: number;
  away: number;
}

export const buildScoreProgression = (
  events: MatchEvent[] | undefined,
): Map<number, ScoreSnapshot> => {
  const map = new Map<number, ScoreSnapshot>();
  if (!events) return map;

  const sorted = [...events].sort((a, b) => {
    const aMin = a.minute ?? 0;
    const bMin = b.minute ?? 0;
    if (aMin !== bMin) return aMin - bMin;
    return (a.orderNumber ?? 0) - (b.orderNumber ?? 0);
  });

  let home = 0;
  let away = 0;
  for (const e of sorted) {
    if (!isGoalEvent(e)) continue;
    if (e.side === "home") home += 1;
    else if (e.side === "away") away += 1;
    if (e.id != null) map.set(e.id, { home, away });
  }
  return map;
};
