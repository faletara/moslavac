import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeInView } from "@/components/animations";

export interface HeroCta {
  label: string;
  href: string;
  /** Vanjski link (otvara u novom tabu, ArrowUpRight). */
  external?: boolean;
}

interface BrandedHeroProps {
  eyebrow: string;
  title: string;
  description?: string | null;
  cta?: HeroCta;
  /** Opcionalna pozadinska slika — renderira se ispod tamnog navy scrima. */
  backgroundImage?: string | null;
}

/**
 * Tamni navy naslovni blok podstranice — prati ritam homepagea (tamni hero →
 * bijelo tijelo → navy footer). Bijeli Saira naslov, žuti eyebrow akcent,
 * opcionalna foto isprana navy scrimom. Dijeli ga više podstranica.
 */
export function BrandedHero({
  eyebrow,
  title,
  description,
  cta,
  backgroundImage,
}: BrandedHeroProps) {
  return (
    <section className="relative isolate -mt-[5.5rem] w-full overflow-hidden bg-brand-navy">
      {backgroundImage && (
        <>
          {/* Pozadinska foto isprana navy scrimom da naslov ostane čitak. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-30">
            <Image
              src={backgroundImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div aria-hidden className="absolute inset-0 -z-20 bg-brand-navy/55" />
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-gradient-to-b from-brand-navy/85 via-brand-navy/40 to-brand-navy/95"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,24,47,0.6)_100%)]"
          />
        </>
      )}

      {/* Gornji padding uključuje visinu headera (5.5rem) jer hero ulazi pod
          prozirni header — tako sadržaj ne završi ispod njega. */}
      <div className="mx-auto w-full max-w-screen-xl px-6 pb-24 pt-[calc(6rem+5.5rem)] sm:pb-32 sm:pt-[calc(8rem+5.5rem)] lg:px-8">
        <FadeInView>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-yellow sm:text-xs">
              {eyebrow}
            </p>
            <h1 className="text-balance font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:text-6xl md:text-7xl">
              {title}
            </h1>
            {description && (
              <p className="max-w-xl text-base leading-relaxed text-white/70">
                {description}
              </p>
            )}

            {cta &&
              (cta.external ? (
                <a
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-2 inline-flex w-fit items-center gap-2 bg-brand-yellow px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-navy shadow-[0_10px_30px_-12px_rgba(255,203,5,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_rgba(255,203,5,0.9)]"
                >
                  {cta.label}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ) : (
                <Link
                  href={cta.href}
                  className="group mt-2 inline-flex w-fit items-center gap-2 bg-brand-yellow px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-navy shadow-[0_10px_30px_-12px_rgba(255,203,5,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_rgba(255,203,5,0.9)]"
                >
                  {cta.label}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
