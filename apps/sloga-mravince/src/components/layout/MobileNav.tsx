"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Mobilni izbornik (< md) u stilu glavne aplikacije: hamburger otvara slide-in
 * drawer zdesna s velikim uppercase itemima. Zatvara se na Escape, klik na
 * pozadinu ili odabir itema; dok je otvoren zaključava scroll pozadine.
 */
export default function MobileNav({ items }: { items: readonly string[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Otvori navigaciju"
        className="ml-auto inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-foreground/5 md:hidden"
      >
        <Menu className="size-6" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            />
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-background shadow-2xl md:hidden"
            >
              <div className="flex h-20 shrink-0 items-center justify-end border-b border-border px-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Zatvori navigaciju"
                  className="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-foreground/5"
                >
                  <X className="size-6" />
                </button>
              </div>

              <nav
                aria-label="Glavna navigacija"
                className="flex flex-col gap-6 px-8 pt-10"
              >
                {items.map((item) => (
                  <span
                    key={item}
                    onClick={() => setOpen(false)}
                    className="cursor-default text-3xl font-black uppercase leading-none tracking-tighter text-foreground transition-colors hover:text-club-red"
                  >
                    {item}
                  </span>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
