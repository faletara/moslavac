import type { Match } from "@/types/hns";

export function isFinished(match: Match): boolean {
  return match.liveStatus === "PLAYED";
}
