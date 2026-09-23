import type { Metadata } from "next";
import { resolveClubCompetitionOr404 } from "@/lib/app-shell/routes/clubScopeRoute";
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
  const competition = await resolveClubCompetitionOr404(competitionId);
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
  const competition = await resolveClubCompetitionOr404(competitionId);

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
