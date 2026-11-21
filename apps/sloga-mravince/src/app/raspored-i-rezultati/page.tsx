import type { Metadata } from "next";
import { SCHEDULE_PATH } from "./competition";
import { ScheduleView, scheduleMetadata } from "./ScheduleView";

// 30 min, isto kao u ScheduleView (Next segmentnu konfiguraciju čita statički).
export const revalidate = 1800;

export function generateMetadata(): Promise<Metadata> {
  return scheduleMetadata(SCHEDULE_PATH);
}

export default function ScheduleResultsPage() {
  return <ScheduleView requestedId={null} />;
}
