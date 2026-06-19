"use client";

import { AnimatedLine, FadeInView } from "@/components/animations";
import { cn } from "@/lib/utils";

interface MatchSectionProps {
  /** Small uppercase label above the title. */
  eyebrow: string;
  /** Display-font section title. */
  title: string;
  children: React.ReactNode;
  /** Hollow display word set behind the heading (homepage signature). */
  watermark?: string;
  /** "dark" renders a full-bleed navy-deep canvas with club glows. */
  tone?: "light" | "dark";
  className?: string;
  /** Overrides the default content wrapper (`mx-auto mt-12 max-w-3xl`). */
  contentClassName?: string;
}

/**
 * Editorial section header for the match overview — the club's signature
 * AnimatedLine + accented eyebrow + oversized display heading, plus a hollow
 * watermark and an optional dark full-bleed canvas so each block carries the
 * homepage's depth and light/dark rhythm rather than reading as flat text.
 */
export function MatchSection({
  eyebrow,
  title,
  children,
  watermark,
  tone = "light",
  className,
  contentClassName,
}: MatchSectionProps) {
  const dark = tone === "dark";

  return (
    <section
      className={cn(
        "relative isolate",
        // Full-bleed breakout: span the viewport even inside a max-w container.
        dark &&
          "dark left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-navy-deep py-20 text-foreground sm:py-28",
        className,
      )}
    >
      {dark && (
        <>
          <div
            aria-hidden
            className="absolute -top-[14vw] left-[10%] -z-20 size-[44vw] rounded-full bg-club/20 blur-[120px]"
          />
          <div
            aria-hidden
            className="absolute -bottom-[14vw] right-[8%] -z-20 size-[36vw] rounded-full bg-club/12 blur-[100px]"
          />
        </>
      )}

      {watermark && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-1/2 top-6 -z-10 -translate-x-1/2 select-none whitespace-nowrap font-display font-black uppercase leading-none tracking-[-0.04em] text-[30vw] sm:text-[19vw]",
            dark ? "text-foreground/[0.06]" : "text-foreground/[0.045]",
          )}
        >
          {watermark}
        </span>
      )}

      <div className={cn(dark && "mx-auto max-w-4xl px-4 sm:px-6")}>
        <FadeInView>
          <div className="flex flex-col items-center gap-5 text-center">
            <AnimatedLine
              className={cn("mx-auto", dark && "bg-primary")}
            />
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
      </div>
    </section>
  );
}
