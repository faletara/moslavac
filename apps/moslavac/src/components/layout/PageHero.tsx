import { FadeInView, RevealHeading } from "@/components/animations";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  /** Small uppercase label above the title, with a primary accent line. */
  eyebrow: string;
  /** Title text — pass an array to render multiple reveal lines. */
  title: string | string[];
  /** Description, meta line, or CTA rendered below the title. */
  children?: React.ReactNode;
  /** Optional hollow display watermark behind the header. */
  watermark?: string;
  /** Accessible label if the visible title differs from the full phrase. */
  ariaLabel?: string;
  align?: "center" | "left";
  /** Font-size classes for each reveal line (overrides the default). */
  lineClassName?: string;
  className?: string;
}

/**
 * Shared page header that carries the homepage's visual language onto every
 * subpage: a primary-accented eyebrow, a display-font reveal heading, and an
 * optional hollow watermark. Stays a single source of truth so subpages read
 * as part of the same brand without re-implementing the pattern each time.
 */
export function PageHero({
  eyebrow,
  title,
  children,
  watermark,
  ariaLabel,
  align = "center",
  lineClassName = "text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl",
  className,
}: PageHeroProps) {
  const lines = Array.isArray(title) ? title : [title];
  const centered = align === "center";

  return (
    <header
      className={cn(
        "relative isolate flex flex-col gap-8 overflow-hidden",
        centered ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {watermark && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 left-1/2 -z-10 -translate-x-1/2 select-none font-display font-black leading-none tracking-[-0.02em] text-foreground/4 text-[34vw] md:-top-12 md:text-[22vw]"
        >
          {watermark}
        </span>
      )}

      <FadeInView delay={0.05}>
        <p
          className={cn(
            "flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]",
            centered && "justify-center",
          )}
        >
          <span aria-hidden className="h-px w-8 bg-primary" />
          {eyebrow}
        </p>
      </FadeInView>

      <RevealHeading
        as="h1"
        lines={lines}
        ariaLabel={ariaLabel}
        delay={0.1}
        className="select-none text-balance font-display font-black uppercase leading-[0.85] tracking-[-0.02em]"
        lineClassName={lineClassName}
      />

      {children && <FadeInView delay={0.2}>{children}</FadeInView>}
    </header>
  );
}
