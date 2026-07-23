import type { Metadata } from "next";
import {
  fetchCompetitionInfo,
  fetchCurrentSeasonCompetitions,
} from "@/lib/hns/competitions";
import { BASE_URL } from "@/lib/siteUrl";
import { buildCompetitionSlug, parseTrailingId } from "@/lib/helpers/slug";
import SeasonLayoutClient from "./SeasonLayoutClient";

interface Params {
  competitionId: string;
}

export async function generateStaticParams() {
  const competitions = await fetchCurrentSeasonCompetitions();
  return competitions
    .filter((c): c is typeof c & { id: number } => c.id != null)
    .map((c) => ({ competitionId: buildCompetitionSlug(c) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { competitionId } = await params;
  const id = parseTrailingId(competitionId);
  const info = await fetchCompetitionInfo({ competitionId: id });
  const name = info?.name ?? "Sezona";
  const slug = info ? buildCompetitionSlug(info) : competitionId;
  const description = `Ljestvica, utakmice i statistike za natjecanje ${name}.`;
  return {
    title: name,
    description,
    alternates: {
      canonical: `${BASE_URL}/sezona/${slug}`,
    },
    openGraph: {
      type: "website",
      title: name,
      description,
      images: [{ url: "/naslovna.jpg", alt: name, width: 1200, height: 630 }],
    },
  };
}

export default async function SeasonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { competitionId } = await params;
  const id = parseTrailingId(competitionId);
  const info = await fetchCompetitionInfo({ competitionId: id });
  return (
    <SeasonLayoutClient competitionId={id} competitionName={info?.name ?? null}>
      {children}
    </SeasonLayoutClient>
  );
}
