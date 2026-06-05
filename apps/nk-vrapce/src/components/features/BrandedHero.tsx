import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeInView } from "@/components/animations";
import { BrandGlow } from "@/components/ui/BrandGlow";

export interface HeroStat {
  value: string;
  label: string;
}

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
  stats?: HeroStat[];
  cta?: HeroCta;
  /** Opcionalna pozadinska slika — renderira se "isprano" ispod bijelog washa. */
  backgroundImage?: string | null;
}

/**
 * Svijetli editorial naslovni blok podstranice: bijela podloga, mekani brand
 * glow (žuta dominira, plava akcent), mirna tipografija s jasnom hijerarhijom,
 * opcionalni stat strip i CTA. Dijeli ga više podstranica radi konzistentnosti.
 */
export function BrandedHero({
  eyebrow,
  title,
  description,
  stats,
  cta,
  backgroundImage,
}: BrandedHeroProps) {
  return (
    <section className="relative isolate w-full overflow-hidden bg-surface">
      {/* Opcionalna pozadinska slika — isprana jakim bijelim washom da
          ostane suptilna tekstura, a tekst (ink) čitak. */}
      {backgroundImage && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-30">
            <Image
              src={backgroundImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-gradient-to-r from-surface via-surface/92 to-surface/70"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-gradient-to-t from-surface via-surface/45 to-surface/85"
          />
        </>
      )}

      {/* Mekani brand glow */}
      <BrandGlow
        color="yellow"
        intensity={0.14}
        className="-left-[6%] -top-[20%] h-[40vmax] w-[40vmax]"
      />
      <BrandGlow
        color="blue"
        intensity={0.1}
        className="-bottom-[30%] left-1/4 h-[36vmax] w-[36vmax]"
      />

      <div className="mx-auto w-full max-w-screen-xl px-6 py-20 sm:py-28 lg:px-8">
        <FadeInView>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="h-[3px] w-10 rounded-full bg-brand-yellow" />
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-blue sm:text-xs">
                {eyebrow}
              </p>
            </div>
            <h1 className="text-balance font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl md:text-7xl">
              {title}
            </h1>
            {description && (
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}

            {stats && stats.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-x-12 gap-y-5 border-t border-line pt-7">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <span className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
                      {stat.value}
                    </span>
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {cta &&
              (cta.external ? (
                <a
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-navy shadow-[0_10px_30px_-12px_rgba(255,203,5,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_rgba(255,203,5,0.9)]"
                >
                  {cta.label}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ) : (
                <Link
                  href={cta.href}
                  className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-navy shadow-[0_10px_30px_-12px_rgba(255,203,5,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_rgba(255,203,5,0.9)]"
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
