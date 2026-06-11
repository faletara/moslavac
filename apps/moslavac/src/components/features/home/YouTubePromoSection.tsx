"use client";

import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import {
  AnimatedCounter,
  FadeInView,
  RevealHeading,
} from "@/components/animations";
import { useTenant } from "@/components/providers/TenantProvider";

export default function YouTubePromoSection() {
  const tenant = useTenant();
  const youtube = tenant.social?.youtube ?? "#";

  return (
    <section className="w-full px-4 py-20 sm:py-28">
      <FadeInView direction="up" distance={32}>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center sm:gap-10">
          <p className="flex items-center gap-2.5 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-club-red opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-club-red" />
            </span>
            Uživo · YouTube
          </p>

          <RevealHeading
            lines={["Gledajte naše", "utakmice uživo"]}
            className="select-none text-balance font-display font-black uppercase leading-[0.85]"
            lineClassName="text-[12vw] sm:text-7xl md:text-8xl"
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
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 rounded-full bg-club-red px-8 py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-chalk transition-colors duration-300 hover:bg-foreground sm:text-xs"
            >
              <FaYoutube className="size-4" />
              Pretplati se
            </motion.a>

            <div className="flex items-center gap-3">
              <span className="font-display text-3xl font-black tabular-nums">
                <AnimatedCounter value={150} suffix="+" />
              </span>
              <span className="text-[0.6rem] font-medium uppercase leading-tight tracking-[0.2em] text-muted-foreground sm:text-xs">
                Pretplatnika
                <br />
                na kanalu
              </span>
            </div>
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
