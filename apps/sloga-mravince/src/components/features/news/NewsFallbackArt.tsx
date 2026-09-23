/**
 * Pozadina vijesti koja nema naslovnu sliku.
 *
 * Umjesto grba nasred praznog kadra (što se čita kao "slika nedostaje"),
 * crta se tiskani plakat: ime kluba u outlineu preko cijelog kadra i uski
 * crveni klin uz desni rub. Izgleda namjerno u sva tri formata.
 */

type FallbackSize = "hero" | "card" | "row";

const TYPE_SCALE: Record<FallbackSize, string> = {
  hero: "text-[13vw]",
  card: "text-[7.5rem]",
  row: "text-[2.1rem]",
};

const ROW_COUNT: Record<FallbackSize, number> = {
  hero: 3,
  card: 3,
  row: 2,
};

/**
 * Hero i kartica nose crne scrimove preko pozadine, pa outline mora krenuti
 * jače da nakon njih ostane vidljiv. Redak liste nema scrim.
 */
const STROKE_ALPHA: Record<FallbackSize, string> = {
  hero: "0.26",
  card: "0.24",
  row: "0.18",
};

export default function NewsFallbackArt({
  clubName,
  size,
}: {
  clubName: string;
  size: FallbackSize;
}) {
  const rows = ROW_COUNT[size];
  // Na maloj sličici puni stroke zatvori slova u mrlju, pa ide tanji.
  const stroke = size === "row" ? "text-stroke-thin" : "text-stroke";

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-deep">
      {/* Crveni klin — uska dijagonalna traka uz desni rub */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-6%] top-[-35%] h-[150%] w-[18%] rotate-18 bg-club-red/70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-16%] top-[-35%] h-[150%] w-[10%] rotate-18 bg-club-red/25"
      />

      {/* Ime kluba u outlineu, ponovljeno u redovima i pomaknuto svaki drugi red */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex flex-col justify-center"
      >
        {Array.from({ length: rows }).map((_, i) => (
          <span
            key={i}
            style={
              // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
              // standardna svojstva, pa ga inline stil ovdje mora proširiti.
              {
                "--text-stroke-color": `rgba(255,255,255,${STROKE_ALPHA[size]})`,
              } as React.CSSProperties
            }
            className={`block whitespace-nowrap font-display uppercase leading-[0.82] tracking-tight ${stroke} ${
              TYPE_SCALE[size]
            } ${i % 2 === 1 ? "translate-x-[-14%]" : "translate-x-[-3%]"}`}
          >
            {clubName} {clubName}
          </span>
        ))}
      </div>

      {/* Filmsko zrno — isti tretman kao na fotografijama */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.09] mix-blend-overlay"
      />
    </div>
  );
}
