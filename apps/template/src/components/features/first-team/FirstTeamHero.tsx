interface FirstTeamHeroProps {
  totalPlayers: number;
  clubName: string;
  founded: number | null;
}

export function FirstTeamHero({ totalPlayers, clubName, founded }: FirstTeamHeroProps) {
  return (
    <header className="flex flex-col items-center gap-8 text-center">
      <p>
        Prva momčad · Sezona 2025/26
      </p>
      <h1 aria-label={`Momčad ${clubName}`}>
        <span className="block">
          Momčad
        </span>
      </h1>
      <p className="max-w-md">
        {totalPlayers} igrača i stručni stožer koji nose dres {clubName}.
        {founded ? ` Klub od ${founded}.` : ""}
      </p>
    </header>
  );
}
