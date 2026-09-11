import { PageHero } from "@/components/layout/PageHero";
import { pluralize } from "@/lib/helpers/plural";

interface FirstTeamHeroProps {
  totalPlayers: number;
  clubName: string;
  founded: number | null;
  /** Npr. „Sezona 2026/27" — računa ga stranica, vidi `@/lib/season`. */
  seasonLabel: string;
}

export function FirstTeamHero({
  totalPlayers,
  clubName,
  founded,
  seasonLabel,
}: FirstTeamHeroProps) {
  return (
    <PageHero
      eyebrow={seasonLabel}
      title="Momčad"
      ariaLabel={`Momčad ${clubName}`}
      lineClassName="text-[16vw] sm:text-6xl md:text-7xl lg:text-8xl"
    >
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        {pluralize(totalPlayers, {
          one: "igrač",
          few: "igrača",
          many: "igrača",
        })}{" "}
        i stručni stožer koji nose dres {clubName}.
        {founded ? ` Klub od ${founded}.` : ""}
      </p>
    </PageHero>
  );
}
