import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchClubCompetition } from "@/lib/hns/clubScope";
import { fetchCurrentSeasonCompetitions } from "@/lib/hns/competitions";
import { BASE_URL } from "@/lib/siteUrl";
import { buildCompetitionSlug } from "@/lib/helpers/slug";
import { seasonTag } from "@/lib/season";
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
  const competition = await fetchClubCompetition(competitionId);

  if (!competition) notFound();
  const name = competition.name;
  const slug = buildCompetitionSlug(competition);
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
  // Tuđe natjecanje završava ovdje, prije ikakvog fan-outa na HNS.
  const competition = await fetchClubCompetition(competitionId);

  if (!competition) notFound();

  return (
    <SeasonLayoutClient
      competitionId={competition.id}
      competitionName={competition.name}
      seasonTag={seasonTag()}
    >
      {children}
    </SeasonLayoutClient>
  );
}
