"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedLineProps {
  className?: string;
  delay?: number;
  duration?: number;
  /** "scroll" uses whileInView; "load" animates immediately on mount */
  trigger?: "scroll" | "load";
}

export function AnimatedLine({
  className,
  delay = 0,
  duration = 0.4,
  trigger = "scroll",
}: AnimatedLineProps) {
  const reduced = useReducedMotion();

  const initial = reduced ? { scaleX: 1 } : { scaleX: 0 };
  const animate = { scaleX: 1 };
  const transition = { duration, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };

  if (trigger === "load") {
    return (
      <motion.span
        aria-hidden
        className={cn("block h-px w-12 bg-foreground", className)}
        initial={initial}
        animate={animate}
        transition={transition}
        style={{ transformOrigin: "left" }}
      />
    );
  }

  return (
    <motion.span
      aria-hidden
      className={cn("block h-px w-12 bg-foreground", className)}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={transition}
      style={{ transformOrigin: "left" }}
    />
  );
}
