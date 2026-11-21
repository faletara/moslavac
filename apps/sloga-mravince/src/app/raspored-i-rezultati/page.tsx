import type { Metadata } from "next";
import { SCHEDULE_PATH } from "@/lib/competitionRoute";
import { ScheduleView, scheduleMetadata } from "@/components/features/schedule/ScheduleView";

// 30 min, isto kao u ScheduleView (Next segmentnu konfiguraciju čita statički).
export const revalidate = 1800;

export function generateMetadata(): Promise<Metadata> {
  return scheduleMetadata(SCHEDULE_PATH);
}

export default function ScheduleResultsPage() {
  return <ScheduleView requestedId={null} />;
}
