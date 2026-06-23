import { PageHero } from "@/components/layout/PageHero";

interface FirstTeamHeroProps {
  totalPlayers: number;
  clubName: string;
  founded: number | null;
}

export function FirstTeamHero({
  totalPlayers,
  clubName,
  founded,
}: FirstTeamHeroProps) {
  return (
    <PageHero
      eyebrow="Prva momčad · Sezona 2025/26"
      title="Momčad"
      ariaLabel={`Momčad ${clubName}`}
      lineClassName="text-[16vw] sm:text-6xl md:text-7xl lg:text-8xl"
    >
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        {totalPlayers} igrača i stručni stožer koji nose dres {clubName}.
        {founded ? ` Klub od ${founded}.` : ""}
      </p>
    </PageHero>
  );
}
