import { ParallaxImage } from "@/components/animations";

/**
 * Stadion — fullscreen filmski interludij: parallax fotografija Glavice s
 * ogromnim outlined watermarkom preko sredine, meta podaci uz donji rub.
 */
export default function StadiumSection() {
  return (
    <section className="relative h-[72vh] min-h-120 overflow-hidden md:h-[85vh]">
      <ParallaxImage
        src="/stadium.jpg"
        alt="Stadion Glavica, Mravince"
        sizes="100vw"
        className="h-full w-full"
        strength={9}
      />
      {/* Scrim + zrno */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-1/4 bg-linear-to-b from-black/40 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay"
      />

      {/* Ogroman outlined watermark preko sredine */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          aria-hidden
          className="[--text-stroke-color:rgba(255,255,255,0.55)] select-none font-display text-[16.5vw] uppercase leading-none text-stroke-thick"
        >
          Glavica
        </span>
      </div>

      {/* Meta uz donji rub */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-6 px-6 pb-10 md:pb-14">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-club-gold">
              Naš dom
            </p>
            <h2 className="mt-2 font-display text-4xl uppercase leading-none tracking-wide text-white md:text-5xl">
              Stadion Glavica
            </h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
              Mravince · Dalmacija
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="font-display text-4xl leading-none tabular-nums text-white md:text-5xl">
              1500
            </p>
            <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-white/50">
              Kapacitet
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
