import Image from "next/image";
import type { ReactNode } from "react";
import { AnimatedLine, FadeInView } from "@/components/animations";
import type { PayloadMedia } from "@/lib/payload/types";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string | null;
  /** Naslovna slika rubrike (opcionalno) — renderira se ispod naslova. */
  heroImage?: PayloadMedia | null;
  children?: ReactNode;
}

/**
 * Dosljedan premium naslovni blok rubrike: žuta linija + nadnaslov + veliki naslov.
 */
export function PageHero({ eyebrow, title, description, heroImage, children }: PageHeroProps) {
  return (
    <header className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
      <FadeInView delay={0.05}>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-blue sm:text-xs">
          {eyebrow}
        </p>
      </FadeInView>
      <FadeInView delay={0.1}>
        <h1 className="text-balance font-display text-4xl font-extrabold uppercase leading-[1.04] tracking-tight text-ink sm:text-6xl md:text-7xl">
          {title}
        </h1>
      </FadeInView>
      <AnimatedLine
        className="mx-auto h-[3px] w-10 rounded-full bg-brand-yellow"
        trigger="load"
      />
      {description && (
        <FadeInView delay={0.15}>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </FadeInView>
      )}
      {children}
      {heroImage?.url && (
        <FadeInView delay={0.2} className="w-full">
          <figure className="relative mt-6 aspect-[16/7] w-full overflow-hidden rounded-lg sm:mt-8">
            <Image
              src={heroImage.sizes?.hero?.url ?? heroImage.url}
              alt={heroImage.alt || title}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              priority
              className="object-cover"
            />
          </figure>
        </FadeInView>
      )}
    </header>
  );
}
