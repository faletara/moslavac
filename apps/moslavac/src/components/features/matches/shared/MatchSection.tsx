"use client";

import { AnimatedLine, FadeInView } from "@/components/animations";
import { cn } from "@/lib/utils";

interface MatchSectionProps {
  /** Small uppercase label above the title. */
  eyebrow: string;
  /** Display-font section title. */
  title: string;
  children: React.ReactNode;
  className?: string;
  /** Overrides the default content wrapper (`mx-auto mt-12 max-w-3xl`). */
  contentClassName?: string;
}

/**
 * Editorial section header for the match overview: the club's signature
 * AnimatedLine, accented eyebrow and oversized display heading, so the block
 * carries the homepage's typographic language instead of reading as flat text.
 *
 * Held deliberately thin. A `tone="dark"` full-bleed canvas and a hollow
 * watermark used to live here, but no caller ever passed them; the navy
 * scoreboard sections build that treatment themselves. Add a branch back only
 * when a second call site actually needs it.
 */
export function MatchSection({
  eyebrow,
  title,
  children,
  className,
  contentClassName,
}: MatchSectionProps) {
  return (
    <section className={cn("relative isolate", className)}>
      <FadeInView>
        <div className="flex flex-col items-center gap-5 text-center">
          <AnimatedLine className="mx-auto" />
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
            {eyebrow}
          </p>
          <h2 className="select-none font-display font-black uppercase leading-[0.85] tracking-tighter text-[14vw] sm:text-6xl md:text-7xl">
            {title}
          </h2>
        </div>
      </FadeInView>

      <FadeInView delay={0.1}>
        <div className={cn("mx-auto mt-12 max-w-3xl", contentClassName)}>
          {children}
        </div>
      </FadeInView>
    </section>
  );
}
