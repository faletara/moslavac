"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import { FadeInView, RevealHeading } from "@/components/animations";
import { useTenant } from "@/components/providers/TenantProvider";

export default function YouTubePromoSection() {
  const reduced = useReducedMotion();
  const tenant = useTenant();
  const youtube = tenant.social?.youtube ?? "#";

  return (
    <section className="w-full px-4 py-20 sm:py-28">
      <FadeInView direction="up" distance={32}>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center sm:gap-10">
          <p className="flex items-center gap-2.5 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-club-red opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-1.5 rounded-full bg-club-red" />
            </span>
            Uživo na YouTubeu
          </p>

          <RevealHeading
            lines={["Gledajte", "utakmice", "uživo"]}
            className="select-none text-balance font-display font-black uppercase leading-[0.85] tracking-[-0.02em]"
            lineClassName="text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl"
          />

          <p className="max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
            Ne propustite nijednu utakmicu. Pretplatite se na naš YouTube kanal za
            prijenose uživo, najbolje trenutke i ekskluzivni sadržaj.
          </p>

          <div className="flex flex-col items-center gap-6 pt-2 sm:flex-row sm:gap-10">
            <motion.a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduced ? undefined : { scale: 1.04 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-3 rounded-full bg-club-red px-8 py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-chalk transition-colors duration-300 hover:bg-foreground sm:text-xs"
            >
              <FaYoutube className="size-4" />
              Pretplati se
            </motion.a>
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
