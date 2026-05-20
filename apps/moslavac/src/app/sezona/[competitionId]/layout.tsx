import type { Metadata } from "next";
import {
  fetchCompetitionInfo,
  fetchCurrentSeasonCompetitions,
} from "@/lib/hns/competitions";
import SeasonLayoutClient from "./SeasonLayoutClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

interface Params {
  competitionId: string;
}

export async function generateStaticParams() {
  const competitions = await fetchCurrentSeasonCompetitions();
  return competitions
    .filter((c): c is typeof c & { id: number } => c.id != null)
    .map((c) => ({ competitionId: String(c.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { competitionId } = await params;
  const info = await fetchCompetitionInfo({
    competitionId: Number(competitionId),
  });
  const name = info?.name ?? "Sezona";
  return {
    title: name,
    description: `Ljestvica, utakmice i statistike za natjecanje ${name}.`,
    alternates: {
      canonical: `${BASE_URL}/sezona/${competitionId}`,
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
  return (
    <SeasonLayoutClient competitionId={Number(competitionId)}>
      {children}
    </SeasonLayoutClient>
  );
}
