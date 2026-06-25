"use client";

import { AnimatedLine, FadeInView } from "@/components/animations";

interface MatchTabHeadingProps {
  eyebrow: string;
  title: string;
}

/**
 * Shared editorial heading for every match tab — the club's AnimatedLine +
 * accented eyebrow + oversized display title, so Tablica / Strijelci / Forma /
 * Postave all carry the same weight as the Match Room.
 */
export function MatchTabHeading({ eyebrow, title }: MatchTabHeadingProps) {
  return (
    <FadeInView>
      <div className="flex flex-col items-center gap-5 text-center">
        <AnimatedLine className="mx-auto" />
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
          {eyebrow}
        </p>
        <h2 className="select-none font-display font-black uppercase leading-[0.85] tracking-tighter text-[13vw] sm:text-6xl md:text-7xl">
          {title}
        </h2>
      </div>
    </FadeInView>
  );
}
