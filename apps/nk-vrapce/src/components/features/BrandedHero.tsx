import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeInView } from "@/components/animations";

/** Fina filmska grain tekstura — daje dubinu tamnim navy plohama. */
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

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
  /** Opcionalna pozadinska slika (npr. atmosfera tribina) iza navy overlaya. */
  backgroundImage?: string | null;
}

/**
 * Full-bleed brandirani naslovni blok podstranice: navy + glowovi + grb watermark
 * + grain, golemi naslov, opcionalni stat strip, CTA i pozadinska slika.
 * Dijeli ga više podstranica radi konzistentnog brandinga.
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
    <section className="relative isolate w-full overflow-hidden bg-brand-navy">
      {/* Pozadinska slika + navy overlay (opcionalno) */}
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="-z-30 object-cover object-center"
          />
          <div className="absolute inset-0 -z-20 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/55" />
          <div className="absolute inset-0 -z-20 bg-gradient-to-t from-brand-navy/90 via-transparent to-brand-navy/50" />
        </>
      )}

      {/* Grb watermark — samo kad nema pozadinske slike */}
      {!backgroundImage && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-1/2 -z-20 h-[150%] w-1/2 -translate-y-1/2 opacity-[0.06] sm:-right-8 sm:w-[38%]"
        >
          <Image
            src="/grb-vrapce.png"
            alt=""
            fill
            sizes="40vw"
            className="object-contain object-right"
          />
        </div>
      )}
      {/* Brand glowovi */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[6%] -top-[20%] -z-10 h-2/3 w-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,203,5,0.16), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[30%] left-1/4 -z-10 h-2/3 w-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(27,160,224,0.18), transparent 70%)",
        }}
      />
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.1] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN_URL }}
      />

      <div className="mx-auto w-full max-w-screen-xl px-6 py-24 sm:py-32 lg:px-8">
        <FadeInView>
          <div className="flex max-w-3xl flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-gradient-to-r from-brand-yellow to-transparent" />
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-brand-yellow sm:text-xs">
                {eyebrow}
              </p>
            </div>
            <h1 className="text-balance text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white sm:text-7xl md:text-8xl">
              {title}
            </h1>
            {description && (
              <p className="max-w-xl text-base leading-relaxed text-white/70">
                {description}
              </p>
            )}

            {stats && stats.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-x-12 gap-y-5 border-t border-white/10 pt-7">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <span className="text-3xl font-black uppercase tracking-tight text-brand-yellow sm:text-4xl">
                      {stat.value}
                    </span>
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/50">
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
                  className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-navy shadow-[0_8px_30px_-6px_rgba(255,203,5,0.5)] transition-all hover:scale-[1.03] hover:shadow-[0_10px_40px_-6px_rgba(255,203,5,0.65)]"
                >
                  {cta.label}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ) : (
                <Link
                  href={cta.href}
                  className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-navy shadow-[0_8px_30px_-6px_rgba(255,203,5,0.5)] transition-all hover:scale-[1.03] hover:shadow-[0_10px_40px_-6px_rgba(255,203,5,0.65)]"
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
