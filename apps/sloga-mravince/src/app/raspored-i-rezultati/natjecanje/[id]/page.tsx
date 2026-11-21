import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { parsePositiveInt } from "@/lib/helpers/validate";
import { competitionPagePath, SCHEDULE_PATH } from "../../competition";
import { fetchCompetitionPageIds } from "../../fetchCompetitionPageIds";
import { ScheduleView, scheduleMetadata } from "../../ScheduleView";

// 30 min, isto kao u ScheduleView (Next segmentnu konfiguraciju čita statički).
export const revalidate = 1800;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await fetchCompetitionPageIds({ revalidate });

  return ids.map((id) => ({ id: String(id) }));
}

// Kanonska adresa gradi se iz raščlanjenog id-a, nikad iz sirovog segmenta;
// neispravan segment (`012`, `1e1`) ionako preusmjerava na popis.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const competitionId = parsePositiveInt((await params).id);

  return scheduleMetadata(
    competitionId == null ? SCHEDULE_PATH : competitionPagePath(competitionId),
  );
}

export default async function CompetitionSchedulePage({ params }: Props) {
  const competitionId = parsePositiveInt((await params).id);

  // Kao i nepoznato natjecanje: nekad je neispravan `?competitionId=` prikazao popis.
  if (competitionId == null) redirect(SCHEDULE_PATH);

  return <ScheduleView requestedId={competitionId} />;
}
