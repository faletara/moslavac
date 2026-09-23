import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CardsTable from "@/components/features/competition/CardsTable";
import { redirectToCanonical } from "@/lib/helpers/canonical";
import { fetchClubCompetition } from "@/lib/hns/clubScope";
import {
  fetchAllCompetitionRedCards,
  fetchAllCompetitionYellowCards,
} from "@/lib/hns/standings";
import { BASE_URL } from "@/lib/siteUrl";
import { buildCompetitionSlug, parseTrailingId } from "@/lib/helpers/slug";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitionId } = await params;
  const cid = parseTrailingId(competitionId);
  const competition = cid == null ? null : await fetchClubCompetition(cid);

  if (!competition) notFound();
  const slug = buildCompetitionSlug(competition);
  const name = competition.name;

  return {
    title: `Kartoni - ${name}`,
    description: `Žuti i crveni kartoni za natjecanje ${name}.`,
    alternates: { canonical: `${BASE_URL}/sezona/${slug}/kartoni` },
  };
}

export default async function CompetitionCardsPage({ params }: Props) {
  const { competitionId } = await params;
  const cid = parseTrailingId(competitionId);
  const competition = cid == null ? null : await fetchClubCompetition(cid);

  if (!competition) notFound();

  redirectToCanonical(
    `/sezona/${competitionId}/kartoni`,
    `/sezona/${buildCompetitionSlug(competition)}/kartoni`,
  );

  const [yellowCards, redCards] = await Promise.all([
    fetchAllCompetitionYellowCards({ competitionId: competition.id }),
    fetchAllCompetitionRedCards({ competitionId: competition.id }),
  ]);

  return (
    <CardsTable
      yellowCards={yellowCards}
      redCards={redCards}
      isLoading={false}
      competitionId={competition.id}
    />
  );
}
