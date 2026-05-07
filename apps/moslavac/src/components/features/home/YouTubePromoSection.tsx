"use client";

import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import { AnimatedCounter, FadeInView } from "@/components/animations";
import { useTenant } from "@/components/providers/TenantProvider";
import { Button } from "@/components/ui/button";

export default function YouTubePromoSection() {
  const tenant = useTenant();
  const youtube = tenant.social?.youtube ?? "#";

  return (
    <section className="w-full px-4 py-16 sm:py-24">
      <FadeInView direction="up" distance={32}>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center sm:gap-10">
          <p className="flex items-center gap-2 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-red-500" />
            </span>
            Uživo · YouTube
          </p>

          <h2 className="select-none text-balance font-black uppercase leading-[0.9] tracking-tighter text-foreground">
            <span className="block text-[12vw] sm:text-6xl md:text-7xl lg:text-8xl">
              Gledajte naše
            </span>
            <span className="block text-[12vw] sm:text-6xl md:text-7xl lg:text-8xl">
              utakmice uživo
            </span>
          </h2>

          <p className="max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
            Ne propustite nijednu utakmicu. Pretplatite se na naš YouTube kanal za
            prijenose uživo, najbolje trenutke i ekskluzivni sadržaj.
          </p>

          <div className="flex flex-col items-center gap-6 pt-2 sm:flex-row sm:gap-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button asChild size="lg" className="rounded-full px-8">
                <a href={youtube} target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="size-5" />
                  Pretplati se
                </a>
              </Button>
            </motion.div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-black tracking-tight tabular-nums">
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
