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

    // Footer je vidljiv samo dok je korisnik blizu dna stranice. Inače ga
    // skrivamo (opacity) da rubber-band overscroll na vrhu ne otkrije fiksni
    // footer iza sadržaja. Reveal animacija pri dnu ostaje netaknuta.
    let ticking = false;
    const updateVisibility = () => {
      const fromBottom =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);
      const near = fromBottom <= footer.offsetHeight + 80;
      footer.style.opacity = near ? "1" : "0";
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    };

    footer.style.transition = "opacity 0.2s ease";
    apply();
    updateVisibility();

    const ro = new ResizeObserver(() => {
      apply();
      updateVisibility();
    });
    ro.observe(footer);
    window.addEventListener("resize", apply);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      window.removeEventListener("scroll", onScroll);
      root.style.removeProperty("--footer-h");
      footer.style.removeProperty("opacity");
      footer.style.removeProperty("transition");
    };
  }, []);

  return null;
}
