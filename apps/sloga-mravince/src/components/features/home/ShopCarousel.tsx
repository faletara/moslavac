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

const ACCENT_BG: Record<ShopProduct["accent"], string> = {
  red: "bg-[linear-gradient(140deg,#ef3a40_0%,#c11a20_55%,#8f1216_100%)]",
  blue: "bg-[linear-gradient(140deg,#2b98e0_0%,#0d6bad_55%,#0a4f80_100%)]",
  gold: "bg-[linear-gradient(140deg,#d3c19c_0%,#b79f7e_55%,#8f7a58_100%)]",
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

function ProductCard({ product }: { product: ShopProduct }) {
  return (
    <article className="group w-56 shrink-0 snap-start sm:w-64">
      {/* Slika proizvoda (placeholder dok nema pravih fotografija) */}
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-black/5 transition-transform duration-300 ease-out group-hover:-translate-y-1 ${ACCENT_BG[product.accent]}`}
      >
        {/* Dijagonalni raster + sjaj za dubinu */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent,transparent_38px,rgba(255,255,255,0.05)_38px,rgba(255,255,255,0.05)_76px)]" />
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-black/15 blur-3xl" />

        {/* Silueta proizvoda */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="h-[48%] w-auto text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-out group-hover:scale-110"
            fill="currentColor"
            aria-hidden
          >
            <path d={ICON_PATHS[product.icon]} />
          </svg>
        </div>

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-club-red shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Dodaj u košaricu (hover) */}
        <button
          type="button"
          aria-label={`Dodaj ${product.name} u košaricu`}
          className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-club-red opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="mt-3.5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 truncate text-base font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-club-red">
          {product.name}
        </h3>
        <p className="mt-1.5 font-display text-lg font-black tabular-nums text-club-red">
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
          <div className="h-1 w-40 overflow-hidden rounded-full bg-black/10 sm:w-56">
            <div
              className="h-full rounded-full bg-club-red transition-[width] duration-150"
              style={{ width: `${Math.max(12, progress * 100)}%` }}
            />
          </div>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Sljedeći proizvodi"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-foreground transition-colors hover:border-club-red hover:text-club-red"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <Link
          href="/oprema"
          className="inline-flex shrink-0 items-center rounded-full bg-club-red px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:scale-105"
        >
          Cijela ponuda
        </Link>
      </div>
    </div>
  );
}
