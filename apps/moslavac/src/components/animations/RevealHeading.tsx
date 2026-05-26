"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

interface RevealHeadingProps {
  /** Each entry renders as its own clipped line. */
  lines: string[];
  /** Classes for the heading element. */
  className?: string;
  /** Classes for each visible line (font size lives here). */
  lineClassName?: string;
  /** Delay before the first line begins, in seconds. */
  delay?: number;
  staggerChildren?: number;
  /** Accessible label if the visible lines differ from the full phrase. */
  ariaLabel?: string;
}

/**
 * Section heading whose words slide up from behind a clipping mask as it
 * enters the viewport — the same reveal the hero uses, but scroll-triggered.
 */
export function RevealHeading({
  lines,
  className,
  lineClassName,
  delay = 0,
  staggerChildren = 0.12,
  ariaLabel,
}: RevealHeadingProps) {
  const reduced = useReducedMotion();
  const label = ariaLabel ?? lines.join(" ");

  if (reduced) {
    return (
      <h2 aria-label={label} className={className}>
        {lines.map((line) => (
          <span key={line} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </h2>
    );
  }

  return (
    <motion.h2
      aria-label={label}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren, delayChildren: delay } },
      }}
    >
      {lines.map((line) => (
        <span key={line} aria-hidden className="block overflow-hidden">
          <motion.span
            className={cn("block", lineClassName)}
            variants={{
              hidden: { y: "110%" },
              show: { y: 0, transition: { duration: 0.7, ease: EXPO_OUT } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}
