"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Mobilni izbornik (< md): hamburger otvara slide-in ink drawer zdesna s
 * velikim Anton itemima i rednim brojevima. Zatvara se na Escape, klik na
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
        className="ml-auto inline-flex size-10 items-center justify-center rounded-md text-chalk transition-colors hover:bg-chalk/10 md:hidden"
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
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-ink-deep text-chalk shadow-2xl md:hidden"
            >
              <div className="flex h-20 shrink-0 items-center justify-end border-b border-chalk/10 px-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Zatvori navigaciju"
                  className="inline-flex size-10 items-center justify-center rounded-md text-chalk transition-colors hover:bg-chalk/10"
                >
                  <X className="size-6" />
                </button>
              </div>

              <nav
                aria-label="Glavna navigacija"
                className="flex flex-col gap-7 px-8 pt-12"
              >
                {items.map((item, i) => (
                  <span
                    key={item}
                    onClick={() => setOpen(false)}
                    className="flex cursor-default items-baseline gap-4"
                  >
                    <span className="text-[0.6rem] font-bold tabular-nums tracking-[0.3em] text-club-red">
                      0{i + 1}
                    </span>
                    <span className="font-display text-4xl uppercase leading-none tracking-wide transition-colors hover:text-club-red">
                      {item}
                    </span>
                  </span>
                ))}
              </nav>

              <p className="mt-auto px-8 pb-8 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-chalk/40">
                HNK Sloga Mravince · od 1925.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
