import { cn } from "@/lib/utils";

/** Klupske boje za mekani ambijentalni glow (žuta dominira, plava sekundarno). */
const GLOW_RGB = {
  yellow: "255,203,5",
  blue: "27,160,224",
} as const;

interface BrandGlowProps {
  /** Boja glowa — "yellow" je primarni klupski akcent. */
  color?: keyof typeof GLOW_RGB;
  /** Jačina (alpha) sredine glowa. Zadano suptilno. */
  intensity?: number;
  /** Pozicioniranje + veličina (npr. "-right-[10%] -top-[8%] h-[40vmax] w-[40vmax]"). */
  className?: string;
}

/**
 * Suptilni radijalni brand glow — daje toplinu i dubinu svijetlim plohama.
 * Dekorativno: pointer-events-none, aria-hidden, sjedi iza sadržaja (-z-10).
 * Roditelj treba biti `relative` (idealno `relative isolate`).
 */
export function BrandGlow({
  color = "yellow",
  intensity = 0.14,
  className,
}: BrandGlowProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -z-10 rounded-full",
        className,
      )}
      style={{
        background: `radial-gradient(closest-side, rgba(${GLOW_RGB[color]},${intensity}), transparent 70%)`,
      }}
    />
  );
}
