"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

interface RevealHeadingProps {
  /** Each entry renders as its own clipped line. */
  lines: string[];
  /** Heading level to render. Defaults to `h2`. */
  as?: "h1" | "h2";
  /** Classes for the heading element. */
  className?: string;
  /** Classes for each visible line (font size lives here). */
  lineClassName?: string;
  /** Delay before the first line begins, in seconds. */
  delay?: number;
  staggerChildren?: number;
  /** Accessible label if the visible lines differ from the full phrase. */
  ariaLabel?: string;
  /**
   * Extra vertical padding so tall display fonts (e.g. Anton) aren't clipped by
   * the reveal mask. Opt-in per club — leave off for fonts that don't need it.
   */
  rhythm?: boolean;
}

/**
 * Section heading whose words slide up from behind a clipping mask as it
 * enters the viewport — the same reveal the hero uses, but scroll-triggered.
 */
export function RevealHeading({
  lines,
  as = "h2",
  className,
  lineClassName,
  delay = 0,
  staggerChildren = 0.12,
  ariaLabel,
  rhythm = false,
}: RevealHeadingProps) {
  const reduced = useReducedMotion();
  const label = ariaLabel ?? lines.join(" ");
  const Heading = as;
  const MotionHeading = motion[as];

  if (reduced) {
    return (
      <Heading aria-label={label} className={className}>
        {lines.map((line) => (
          <span
            key={line}
            className={cn(
              "block whitespace-nowrap",
              rhythm && "pt-[0.24em]",
              lineClassName,
            )}
          >
            {line}
          </span>
        ))}
      </Heading>
    );
  }

  return (
    <MotionHeading
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
        <span
          key={line}
          aria-hidden
          className={cn(
            "block overflow-hidden",
            rhythm && "-mt-[0.08em] pt-[0.28em] pb-[0.06em]",
          )}
        >
          <motion.span
            className={cn(
              "block whitespace-nowrap",
              rhythm && "pt-[0.04em]",
              lineClassName,
            )}
            variants={{
              hidden: { y: "110%" },
              show: { y: 0, transition: { duration: 0.7, ease: EXPO_OUT } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionHeading>
  );
}
