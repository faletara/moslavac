"use client";

import { useEffect } from "react";

/**
 * "Reveal footer" efekt: footer je fiksiran na dnu viewporta iza sadržaja, a
 * bijeli sadržaj-wrapper klizi preko njega. Da bi se otkrio pri dnu stranice,
 * sadržaj treba donji razmak jednak visini footera. Visina footera je
 * responzivna pa je mjerimo i upisujemo u `--footer-h` (bez magičnih brojeva).
 */
export default function FooterReveal() {
  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty("--footer-h", `${footer.offsetHeight}px`);
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(footer);
    window.addEventListener("resize", apply);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      root.style.removeProperty("--footer-h");
    };
  }, []);

  return null;
}
