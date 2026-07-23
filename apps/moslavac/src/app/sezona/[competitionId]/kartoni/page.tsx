import type { Metadata } from "next";
import CardsTable from "@/components/features/competition/CardsTable";
import { redirectToCanonical } from "@/lib/helpers/canonical";
import { fetchCompetitionInfo } from "@/lib/hns/competitions";
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
  const info = await fetchCompetitionInfo({
    competitionId: parseTrailingId(competitionId),
  });
  const slug = info ? buildCompetitionSlug(info) : competitionId;
  const name = info?.name ?? "Sezona";
  return {
    title: `Kartoni - ${name}`,
    description: `Žuti i crveni kartoni za natjecanje ${name}.`,
    alternates: { canonical: `${BASE_URL}/sezona/${slug}/kartoni` },
  };
}

export default async function CompetitionCardsPage({ params }: Props) {
  const { competitionId } = await params;
  const cid = parseTrailingId(competitionId);
  const [info, yellowCards, redCards] = await Promise.all([
    fetchCompetitionInfo({ competitionId: cid }),
    fetchAllCompetitionYellowCards({ competitionId: cid }),
    fetchAllCompetitionRedCards({ competitionId: cid }),
  ]);
  if (info) {
    redirectToCanonical(
      `/sezona/${competitionId}/kartoni`,
      `/sezona/${buildCompetitionSlug(info)}/kartoni`,
    );
  }
  return (
    <CardsTable
      yellowCards={yellowCards}
      redCards={redCards}
      isLoading={false}
      competitionId={cid}
    />
  );
}
