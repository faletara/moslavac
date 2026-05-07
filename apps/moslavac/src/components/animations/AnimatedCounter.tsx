"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  suffix?: string;
}

export function AnimatedCounter({ value, className, suffix = "" }: AnimatedCounterProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20, mass: 0.8 });
  const display = useTransform(spring, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!isInView) return;
    if (reduced) {
      motionValue.set(value);
      spring.set(value);
    } else {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue, spring, reduced]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
