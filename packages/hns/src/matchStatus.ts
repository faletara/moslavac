import type { HnsMatch } from "@/types/hns";

export function isFinished(match: HnsMatch): boolean {
  return match.liveStatus === "PLAYED";
}
