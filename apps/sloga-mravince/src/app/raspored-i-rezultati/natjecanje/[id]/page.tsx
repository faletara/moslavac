import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { parseCompetitionId, SCHEDULE_PATH } from "../../competition";
import { fetchCompetitionPagePaths } from "../../fetchCompetitionPagePaths";
import { ScheduleView, scheduleMetadata } from "../../ScheduleView";

// 30 min, isto kao u ScheduleView (Next segmentnu konfiguraciju čita statički).
export const revalidate = 1800;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const paths = await fetchCompetitionPagePaths({ revalidate });

  return paths.map((path) => ({ id: path.slice(path.lastIndexOf("/") + 1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return scheduleMetadata(`${SCHEDULE_PATH}/natjecanje/${id}`);
}

export default async function CompetitionSchedulePage({ params }: Props) {
  const { id } = await params;
  const competitionId = parseCompetitionId(id);

  // Kao i nepoznato natjecanje: nekad je neispravan `?competitionId=` prikazao popis.
  if (competitionId == null) redirect(SCHEDULE_PATH);

  return <ScheduleView requestedId={competitionId} />;
}
