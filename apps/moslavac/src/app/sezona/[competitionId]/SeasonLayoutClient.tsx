import SeasonTabsNav from "@/components/features/competition/SeasonTabsNav";
import { PageHero } from "@/components/layout/PageHero";
import { buildCompetitionSlug } from "@/lib/helpers/slug";

export default function SeasonLayoutClient({
  competitionId,
  competitionName,
  children,
}: {
  competitionId: number;
  competitionName: string | null;
  children: React.ReactNode;
}) {
  const competitionSlug = competitionName
    ? buildCompetitionSlug({ id: competitionId, name: competitionName })
    : String(competitionId);

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8">
      <PageHero
        eyebrow={competitionName?.trim() || "Prvenstvo"}
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
