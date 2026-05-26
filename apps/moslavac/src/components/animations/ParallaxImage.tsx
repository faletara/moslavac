"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Classes for the clipping frame (sizing, aspect ratio, positioning). */
  className?: string;
  /** Classes for the underlying <Image>. */
  imageClassName?: string;
  /**
   * Vertical travel as a percentage of the oversized inner layer height.
   * The inner layer is 124% tall, so keep this below ~12% to avoid gaps.
   */
  strength?: number;
}

/**
 * Image that drifts vertically within a clipping frame as it scrolls through
 * the viewport — the classic editorial parallax. The inner layer is sized
 * larger than the frame so the translation never exposes an empty edge.
 */
export function ParallaxImage({
  src,
  alt,
  sizes = "100vw",
  priority,
  className,
  imageClassName,
  strength = 8,
}: ParallaxImageProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${strength}%`, `${strength}%`],
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-x-0 -top-[12%] h-[124%]"
        style={reduced ? undefined : { y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      </motion.div>
    </div>
  );
}
