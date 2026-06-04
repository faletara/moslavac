import type { ReactNode } from "react";
import { AnimatedLine, FadeInView } from "@/components/animations";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string | null;
  children?: ReactNode;
}

/**
 * Dosljedan premium naslovni blok rubrike: žuta linija + nadnaslov + veliki naslov.
 */
export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <header className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
      <AnimatedLine className="mx-auto bg-brand-yellow" trigger="load" />
      <FadeInView delay={0.05}>
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          {eyebrow}
        </p>
      </FadeInView>
      <FadeInView delay={0.1}>
        <h1 className="text-balance text-4xl font-black uppercase leading-[1.04] tracking-tighter sm:text-6xl md:text-7xl">
          {title}
        </h1>
      </FadeInView>
      {description && (
        <FadeInView delay={0.15}>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </FadeInView>
      )}
      {children}
    </header>
  );
}
