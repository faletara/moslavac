import type { Match } from "@/types/hns";

export function isFinished(match: Match): boolean {
  return match.liveStatus === "PLAYED";
}

/** Kick-off has happened and HNS is still reporting on the match. */
export function isLive(match: Match): boolean {
  return match.liveStatus === "RUNNING";
}

/**
 * The fixture will not be played at the advertised time. Callers must not show
 * a countdown for these — the kick-off they'd count down to is void.
 */
export function isCalledOff(match: Match): boolean {
  return match.liveStatus === "CANCELED" || match.liveStatus === "POSTPONED";
}

/** Croatian label for a called-off fixture, or null when it is still on. */
export function calledOffLabel(match: Match): string | null {
  if (match.liveStatus === "CANCELED") return "Otkazano";
  if (match.liveStatus === "POSTPONED") return "Odgođeno";
  return null;
}

/** Minute to display for a live match — `45+2` when HNS supplies it. */
export function liveMinute(match: Match): string | null {
  const display = match.currentMinute?.trim();
  if (display) return display;
  return match.minute != null ? `${match.minute}'` : null;
}
