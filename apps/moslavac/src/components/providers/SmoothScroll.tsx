"use client";

import { useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";

/**
 * Site-wide Lenis smooth scrolling on the window. Skipped entirely for users
 * who prefer reduced motion — they get native scrolling.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.12, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
