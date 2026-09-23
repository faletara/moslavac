import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopScorersTable from "@/components/features/competition/TopScorersTable";
import { redirectToCanonical } from "@/lib/helpers/canonical";
import { fetchCompetitionInfo } from "@/lib/hns/competitions";
import { fetchAllCompetitionScorers } from "@/lib/hns/standings";
import { BASE_URL } from "@/lib/siteUrl";
import { buildCompetitionSlug, parseTrailingId } from "@/lib/helpers/slug";

interface Props {
  params: Promise<{ competitionId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitionId } = await params;
  const cid = parseTrailingId(competitionId);

  if (cid == null) notFound();
  const info = await fetchCompetitionInfo({ competitionId: cid });

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

  if (cid == null) notFound();

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
