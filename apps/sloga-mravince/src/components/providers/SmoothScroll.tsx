"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Lenis smooth-scroll preko cijele stranice. Native scroll ostaje izvor
 * istine (framer-motion useScroll radi netaknuto), Lenis samo izglađuje.
 * Poštuje prefers-reduced-motion — tada se uopće ne inicijalizira.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.115, wheelMultiplier: 1 });
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
