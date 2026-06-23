"use client";

import SeasonTabsNav from "@/components/features/competition/SeasonTabsNav";
import { PageHero } from "@/components/layout/PageHero";
import { api } from "@/lib/api";
import { buildCompetitionSlug } from "@/lib/slug";

export default function SeasonLayoutClient({
  competitionId,
  children,
}: {
  competitionId: number;
  children: React.ReactNode;
}) {
  const { data: info } = api.competitions.useGetCompetitionInfo({
    competitionId,
    enabled: !!competitionId,
  });

  const competitionSlug = info?.name
    ? buildCompetitionSlug({ id: competitionId, name: info.name })
    : String(competitionId);

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8">
      <PageHero
        eyebrow={info?.name?.trim() || "Prvenstvo"}
        title="Sezona"
        watermark="25/26"
        lineClassName="text-[15vw] sm:text-6xl md:text-7xl lg:text-8xl"
      />

      <div className="mt-12 sm:mt-16">
        <SeasonTabsNav competitionSlug={competitionSlug} />
      </div>

      <div className="mt-10 sm:mt-12">{children}</div>
    </div>
  );
}
