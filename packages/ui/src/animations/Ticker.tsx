"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface TickerProps {
  /** Entries shown in sequence, separated by a small diamond accent. */
  items: string[];
  className?: string;
  /** Classes for each text entry. */
  itemClassName?: string;
  /** Seconds for one full loop. */
  duration?: number;
  /** How many times the entry set repeats inside one loop half. */
  repeat?: number;
  reverse?: boolean;
}

function TickerHalf({
  items,
  itemClassName,
  repeat,
}: Pick<TickerProps, "items" | "itemClassName"> & { repeat: number }) {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: repeat }, (_, r) => (
        <Fragment key={r}>
          {items.map((item, i) => (
            <Fragment key={`${r}-${item}-${i}`}>
              <span className={cn("whitespace-nowrap px-6", itemClassName)}>
                {item}
              </span>
              <span
                aria-hidden
                className="size-1.5 shrink-0 rotate-45 bg-primary/70"
              />
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Infinite horizontal marquee. The track holds two identical halves and
 * translates by -50%, so the loop is seamless. Pure CSS animation — pauses
 * for reduced-motion users.
 */
export function Ticker({
  items,
  className,
  itemClassName,
  duration = 36,
  repeat = 4,
  reverse = false,
}: TickerProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn("flex overflow-hidden", className)}
      style={
        {
          "--marquee-duration": `${duration}s`,
        } as React.CSSProperties
      }
    >
      <div
        className="flex w-max animate-marquee items-center motion-reduce:[animation:none]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        <TickerHalf items={items} itemClassName={itemClassName} repeat={repeat} />
        <div aria-hidden className="flex shrink-0 items-center">
          <TickerHalf
            items={items}
            itemClassName={itemClassName}
            repeat={repeat}
          />
        </div>
      </div>
    </div>
  );
}
