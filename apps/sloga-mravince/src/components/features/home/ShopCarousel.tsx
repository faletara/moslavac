"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

export type ShopIcon =
  | "jersey"
  | "shirt"
  | "tracksuit"
  | "scarf"
  | "beanie"
  | "bottle";

export interface ShopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  badge?: string;
  accent: "red" | "blue" | "gold";
  icon: ShopIcon;
}

const ACCENT_RAIL: Record<ShopProduct["accent"], string> = {
  red: "bg-club-red",
  blue: "bg-club-blue",
  gold: "bg-club-gold",
};

const ACCENT_TEXT: Record<ShopProduct["accent"], string> = {
  red: "text-club-red",
  blue: "text-club-blue",
  gold: "text-club-gold",
};

const ACCENT_BADGE_TEXT: Record<ShopProduct["accent"], string> = {
  red: "text-white",
  blue: "text-white",
  gold: "text-ink-deep",
};

// Prepoznatljiva silueta po tipu proizvoda (placeholder dok nema fotografija).
const ICON_PATHS: Record<ShopIcon, string> = {
  jersey:
    "M8.4 3 10 4.4a3 3 0 0 0 4 0L15.6 3 21 5.6l-1.9 4.8-2.6-1V21H7.5V9.4l-2.6 1L3 5.6 8.4 3Z",
  shirt:
    "M8.7 3.5 10 4.6a3 3 0 0 0 4 0l1.3-1.1 4.7 2.4-1.7 4.2-2.3-.9V20.5H7V9.2l-2.3.9L3 5.9l5.7-2.4Z",
  tracksuit:
    "M8.4 3 10 4.4a3 3 0 0 0 4 0L15.6 3 21 5.6l-1.9 4.8-2.6-1V21H7.5V9.4l-2.6 1L3 5.6 8.4 3Zm3.6 3.4-.9.9 0 12.7h1.8V7.3l-.9-.9Z",
  scarf:
    "M9 2a3.5 3.5 0 0 0-3.5 3.5v4A3.5 3.5 0 0 0 9 13h.4v7.5a1.6 1.6 0 0 0 3.2 0V13H15a3.5 3.5 0 0 0 3.5-3.5v-4A3.5 3.5 0 0 0 15 2H9Z",
  beanie:
    "M12 3.5A7.5 7.5 0 0 0 4.5 11v1.3h15V11A7.5 7.5 0 0 0 12 3.5ZM3.4 13.1a1.9 1.9 0 0 0 0 3.8h17.2a1.9 1.9 0 0 0 0-3.8H3.4Z",
  bottle:
    "M9.7 2h4.6v1.8l1 1.6a3 3 0 0 1 .5 1.6V20.4A1.6 1.6 0 0 1 14.2 22H9.8a1.6 1.6 0 0 1-1.6-1.6V7a3 3 0 0 1 .5-1.6l1-1.6V2Zm-1.2 7.3v2.2h7V9.3h-7Z",
};

function formatPrice(price: number): string {
  return `${price.toFixed(2).replace(".", ",")} €`;
}

/** Ink kartica proizvoda — ghost silueta, rezani kut, potpis u boji varijante. */
function ProductCard({ product }: { product: ShopProduct }) {
  return (
    <article className="group relative h-80 w-56 shrink-0 snap-start overflow-hidden bg-ink-deep clip-corner sm:h-88 sm:w-64">
      {/* Rubni potpis boje varijante */}
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 transition-[width] duration-300 group-hover:w-1.5 ${ACCENT_RAIL[product.accent]}`}
      />

      {/* Ghost silueta proizvoda */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="h-[54%] w-auto text-white/[0.07] transition-transform duration-500 ease-out group-hover:scale-110"
          fill="currentColor"
          aria-hidden
        >
          <path d={ICON_PATHS[product.icon]} />
        </svg>
      </div>

      {/* Eyebrow + oznaka */}
      <div className="absolute left-6 top-6 right-6 flex items-start justify-between gap-3">
        <p className="text-[0.58rem] font-bold uppercase tracking-[0.3em] text-white/40">
          {product.category}
        </p>
        {product.badge && (
          <span
            className={`shrink-0 px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-[0.2em] ${ACCENT_RAIL[product.accent]} ${ACCENT_BADGE_TEXT[product.accent]}`}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Dodaj u košaricu (hover) */}
      <button
        type="button"
        aria-label={`Dodaj ${product.name} u košaricu`}
        className="absolute bottom-20 right-6 flex h-10 w-10 translate-y-2 items-center justify-center border border-white/30 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white hover:text-ink-deep sm:bottom-24"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Naziv + cijena */}
      <div className="absolute inset-x-6 bottom-6">
        <h3 className="truncate pt-[0.14em] font-display text-xl uppercase leading-[1.12] tracking-wide text-white transition-colors group-hover:text-white/80 sm:text-2xl">
          {product.name}
        </h3>
        <p className={`mt-2 font-display text-lg tabular-nums ${ACCENT_TEXT[product.accent]}`}>
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}

export default function ShopCarousel({
  products,
}: {
  products: ShopProduct[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  const scrollNext = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
    el.scrollBy({
      left: atEnd ? -el.scrollWidth : el.clientWidth * 0.8,
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Kontrole + CTA */}
      <div className="mt-8 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-1 w-40 overflow-hidden bg-black/10 sm:w-56">
            <div
              className="h-full bg-club-red transition-[width] duration-150"
              style={{ width: `${Math.max(12, progress * 100)}%` }}
            />
          </div>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Sljedeći proizvodi"
            className="flex h-10 w-10 items-center justify-center border border-black/15 text-foreground transition-colors hover:border-club-red hover:text-club-red"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <Link
          href="/oprema"
          className="group inline-flex shrink-0 items-center gap-3 bg-club-red px-7 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-ink-deep"
        >
          Cijela ponuda
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
