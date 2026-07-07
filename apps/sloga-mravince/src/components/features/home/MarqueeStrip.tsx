import { Fragment, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface MarqueeStripProps {
  items: string[];
  ariaLabel?: string;
  className?: string;
  /** Seconds for one full loop. */
  duration?: number;
}

function StripHalf({ items }: { items: string[] }) {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: 3 }, (_, r) => (
        <Fragment key={r}>
          {items.map((item, i) => (
            <Fragment key={`${r}-${i}`}>
              <span className="whitespace-nowrap px-8 font-display text-xl uppercase leading-none tracking-wide sm:text-2xl">
                {item}
              </span>
              <span
                aria-hidden
                className="size-2 shrink-0 rotate-45 bg-white/50"
              />
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Crvena heritage marquee traka — potpis između hero-a i sadržaja. Čisti CSS
 * marquee (dvije identične polovice, -50% translate), pauzira se za
 * reduced-motion korisnike.
 */
export default function MarqueeStrip({
  items,
  ariaLabel,
  className,
  duration = 28,
}: MarqueeStripProps) {
  if (items.length === 0) return null;

  const accessibleText = ariaLabel ?? items.join(" · ");

  return (
    <div
      className={cn(
        "flex overflow-hidden border-y border-black/25 bg-club-red py-3.5 text-white sm:py-4",
        className,
      )}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <span className="sr-only">{accessibleText}</span>
      <div
        aria-hidden
        className="flex w-max animate-marquee items-center motion-reduce:[animation:none]"
      >
        <StripHalf items={items} />
        <StripHalf items={items} />
      </div>
    </div>
  );
}
