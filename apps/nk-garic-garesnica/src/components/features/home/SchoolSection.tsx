import { ArrowRight, Check } from "lucide-react";
import { FadeInView, ParallaxImage } from "@/components/animations";

type SchoolSectionProps = {
  imageSrc: string;
  email: string | null;
  facebook: string | null;
};

const POINTS = [
  "Za najmlađe uzraste",
  "Treninzi u Garešnici",
  "Vodstvo i oprema kluba",
];

/**
 * Škola nogometa — svijetla sekcija (ne treći puni royal poster zaredom):
 * fotografija s igrališta lijevo, plava CTA kartica desno u istom jeziku kao
 * kartice rezultata/igrača (rounded-[28px], meka sjena). Copy je faktičan,
 * bez izmišljenih brojki i termina.
 */
export default function SchoolSection({
  imageSrc,
  email,
  facebook,
}: SchoolSectionProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto w-full max-w-350 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <FadeInView>
          <h2 className="font-display text-6xl uppercase leading-[0.9] tracking-tight text-foreground lg:text-8xl">
            Škola <span className="text-club">nogometa</span>
          </h2>
        </FadeInView>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <FadeInView className="lg:col-span-7">
            <ParallaxImage
              src={imageSrc}
              alt="Škola nogometa NK Garić Garešnica"
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="aspect-4/3 h-full rounded-[28px] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_36px_-22px_rgba(15,23,42,0.35)] lg:aspect-auto"
              imageClassName="object-[center_30%]"
              strength={6}
            />
          </FadeInView>

          <FadeInView delay={0.1} className="lg:col-span-5">
            <div className="relative isolate flex h-full flex-col justify-between overflow-hidden rounded-[28px] bg-club px-7 py-8 text-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_36px_-22px_rgba(15,23,42,0.35)] sm:px-9 sm:py-10">
              <span
                aria-hidden
                className="halftone halftone-fade-b pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 opacity-25"
                style={
                  // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
                  // standardna svojstva, pa ga inline stil ovdje mora proširiti.
                  {
                    "--halftone-color": "rgba(255,255,255,0.65)",
                  } as React.CSSProperties
                }
              />

              <div>
                <p className="max-w-sm text-base leading-relaxed text-white sm:text-lg">
                  Škola nogometa NK Garić Garešnica okuplja najmlađe uzraste
                  na klupskom igralištu u Garešnici. Dođi na trening i
                  zaigraj.
                </p>

                <ul className="mt-7 space-y-3.5">
                  {POINTS.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-3.5 border-b border-white/20 pb-3.5 text-base font-medium"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
                        <Check className="size-3.5 text-club" strokeWidth={2} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <p className="text-sm text-white/85">
                  Prijava i sve informacije putem kluba.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {email && (
                    <a
                      href={`mailto:${email}?subject=${encodeURIComponent("Škola nogometa")}`}
                      className="inline-flex items-center gap-3 rounded-full bg-white py-3 pl-6 pr-3 text-base font-bold text-club transition-transform active:scale-[0.96] motion-reduce:active:scale-100"
                    >
                      Prijavi dijete
                      <span className="flex size-8 items-center justify-center rounded-full bg-club">
                        <ArrowRight className="size-4.5 text-white" strokeWidth={2} />
                      </span>
                    </a>
                  )}
                  {facebook && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-white/60 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-white hover:text-club"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}
