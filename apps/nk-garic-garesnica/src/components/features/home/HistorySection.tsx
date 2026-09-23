import { FadeInView, ParallaxImage } from "@/components/animations";

type HistorySectionProps = {
  founded: number;
  place: string;
  imageSrc: string;
};

/**
 * Povijest / naslijeđe — full-bleed snimak 100. obljetnice (klub složen u broj
 * "100" na terenu) s editorial parallaxom. Tekst živi NA fotografiji, ali u
 * jednom stupcu uz lijevi rub: scrim je zato bočni, a ne razvučen preko cijele
 * plohe — formacija "100" ostaje čitljiva desno, a tekst dobiva punu podlogu
 * ispod sebe umjesto poluprozirne. Statistike su kompaktan red u istom stupcu.
 * Sadržaj su SAMO provjerene činjenice (godina osnutka, 100+ godina, mjesto,
 * klupske boje).
 */
export default function HistorySection({
  founded,
  place,
  imageSrc,
}: HistorySectionProps) {
  const placeLocative = place.replace(/a$/, "i"); // Garešnica → Garešnici

  const stats = [
    { value: String(founded), label: "Godina osnutka" },
    { value: "100+", label: "Godina tradicije" },
  ];

  return (
    <section className="relative flex min-h-160 items-end overflow-hidden bg-navy-deep lg:min-h-190 lg:items-center">
      <ParallaxImage
        src={imageSrc}
        alt={`100 godina NK Garić ${place}`}
        className="absolute inset-0"
        imageClassName="object-[center_35%]"
        strength={7}
      />
      {/* Dva sloja: bočni scrim nosi čitljivost stupca na širokom ekranu, donji
          preuzima na mobitelu gdje stupac ide preko cijele širine. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, oklch(0.15 0.05 262 / 0.95) 0%, oklch(0.15 0.05 262 / 0.75) 42%, oklch(0.15 0.05 262 / 0.15) 78%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, oklch(0.15 0.05 262 / 0.97) 0%, oklch(0.15 0.05 262 / 0.9) 32%, oklch(0.15 0.05 262 / 0.45) 52%, transparent 72%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
        <FadeInView className="max-w-xl text-white lg:max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            Naša priča
          </p>
          <h2 className="mt-6 font-display text-[2.75rem] uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
            Više od{" "}
            <span
              className="text-stroke"
              // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
              // standardna svojstva, pa ga inline stil ovdje mora proširiti.
              style={
                { "--text-stroke-color": "#ffffff" } as React.CSSProperties
              }
            >
              stoljeća
            </span>{" "}
            nogometa u {placeLocative}.
          </h2>
          {/* Statistike — kompaktan red u istom stupcu, ne razvučen preko dna. */}
          <dl className="mt-10 grid max-w-md grid-cols-2 gap-x-4 border-t border-white/20 pt-6 sm:gap-x-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-white/75">
                  {s.label}
                </dt>
                <dd className="mt-2 font-display text-2xl leading-none tracking-tight sm:text-3xl lg:text-4xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </FadeInView>
      </div>
    </section>
  );
}
