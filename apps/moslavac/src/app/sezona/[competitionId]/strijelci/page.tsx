import type { Metadata } from "next";
import TopScorersTable from "@/components/features/competition/TopScorersTable";
import { redirectToCanonical } from "@/lib/canonical";
import { fetchCompetitionInfo } from "@/lib/hns/competitions";
import { fetchAllCompetitionScorers } from "@/lib/hns/standings";
import { BASE_URL } from "@/lib/siteUrl";
import { buildCompetitionSlug, parseTrailingId } from "@/lib/slug";

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
    title: `Strijelci - ${name}`,
    description: `Lista strijelaca za natjecanje ${name}.`,
    alternates: { canonical: `${BASE_URL}/sezona/${slug}/strijelci` },
  };
}

export default async function CompetitionScorersPage({ params }: Props) {
  const { competitionId } = await params;
  const cid = parseTrailingId(competitionId);
  const [info, scorers] = await Promise.all([
    fetchCompetitionInfo({ competitionId: cid }),
    fetchAllCompetitionScorers({ competitionId: cid }),
  ]);
  if (info) {
    redirectToCanonical(
      `/sezona/${competitionId}/strijelci`,
      `/sezona/${buildCompetitionSlug(info)}/strijelci`,
    );
  }
  return (
    <TopScorersTable
      scorers={scorers}
      isLoading={false}
      competitionId={cid}
    />
  );
}
