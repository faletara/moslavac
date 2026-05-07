"use client";

import { AnimatedLine, FadeInView } from "@/components/animations";

interface FirstTeamHeroProps {
  totalPlayers: number;
  clubName: string;
  founded: number | null;
}

export function FirstTeamHero({ totalPlayers, clubName, founded }: FirstTeamHeroProps) {
  return (
    <header className="flex flex-col items-center gap-8 text-center">
      <AnimatedLine className="mx-auto" />
      <FadeInView delay={0.05}>
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
          Prva momčad · Sezona 2025/26
        </p>
      </FadeInView>
      <FadeInView delay={0.1}>
        <h1
          aria-label={`Momčad ${clubName}`}
          className="select-none text-balance font-black uppercase leading-[0.85] tracking-tighter"
        >
          <span className="block text-[20vw] sm:text-7xl md:text-8xl lg:text-9xl">
            Momčad
          </span>
        </h1>
      </FadeInView>
      <FadeInView delay={0.15}>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {totalPlayers} igrača i stručni stožer koji nose dres {clubName}.
          {founded ? ` Klub od ${founded}.` : ""}
        </p>
      </FadeInView>
    </header>
  );
}
