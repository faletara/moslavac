"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import {
  AnimatedCounter,
  FadeInView,
  RevealHeading,
} from "@/components/animations";
import type { YouTubeChannelStats } from "@/lib/youtube/getChannelStats";

type YouTubePromoSectionProps = {
  youtubeUrl?: string | null;
  stats?: YouTubeChannelStats | null;
};

type YouTubePromoContentProps = YouTubePromoSectionProps & {
  reducedMotion: boolean;
};

const numberFormatter = new Intl.NumberFormat("hr-HR");

export default function YouTubePromoSection({
  youtubeUrl,
  stats,
}: YouTubePromoSectionProps) {
  const reduced = useReducedMotion();

  return (
    <section className="w-full px-4 py-20 sm:py-28">
      <FadeInView direction="up" distance={32}>
        <YouTubePromoContent
          youtubeUrl={youtubeUrl}
          stats={stats}
          reducedMotion={Boolean(reduced)}
        />
      </FadeInView>
    </section>
  );
}

function ChannelStat({
  value,
  label,
  reducedMotion,
}: {
  value: number;
  label: string;
  reducedMotion: boolean;
}) {
  const formatted = numberFormatter.format(value);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="font-display text-3xl font-black tabular-nums leading-none sm:text-4xl">
        {reducedMotion ? (
          formatted
        ) : (
          <AnimatedCounter
            value={value}
            format={(n) => numberFormatter.format(n)}
          />
        )}
      </span>
      <span className="text-[0.55rem] font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.65rem]">
        {label}
      </span>
    </div>
  );
}

export function YouTubePromoContent({
  youtubeUrl,
  stats,
  reducedMotion,
}: YouTubePromoContentProps) {
  const youtube = youtubeUrl ?? null;
  const hasChannel = youtube != null;
  const headingLines = hasChannel
    ? ["Pratite", "Moslavac", "na YouTubeu"]
    : ["YouTube", "kanal", "nije dostupan"];
  const description = hasChannel
    ? "Pretplatite se na službeni YouTube kanal Moslavca za prijenose utakmica, najbolje trenutke i klupski sadržaj."
    : "Službeni YouTube kanal još nije dostupan. Kada ga klub pokrene, ovdje ćemo objaviti provjerenu poveznicu.";

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center sm:gap-10">
      <p className="flex items-center gap-2.5 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
        <span className="relative flex size-1.5">
          <span className="relative inline-flex size-1.5 rounded-full bg-club-red" />
        </span>
        {hasChannel ? "Službeni YouTube kanal" : "YouTube kanal"}
      </p>

      <RevealHeading
        lines={headingLines}
        className="select-none text-balance font-display font-black uppercase leading-[0.85] tracking-[-0.02em]"
        lineClassName={
          hasChannel
            ? "text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl"
            : "text-[11vw] sm:text-6xl md:text-7xl lg:text-8xl"
        }
      />

      <p className="max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>

      {hasChannel && stats ? (
        <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-6 sm:gap-x-16">
          {stats.subscriberCount != null ? (
            <ChannelStat
              value={stats.subscriberCount}
              label="Pretplatnika"
              reducedMotion={reducedMotion}
            />
          ) : null}
          <ChannelStat
            value={stats.videoCount}
            label="Videa"
            reducedMotion={reducedMotion}
          />
          <ChannelStat
            value={stats.viewCount}
            label="Pregleda"
            reducedMotion={reducedMotion}
          />
        </div>
      ) : null}

      <div className="flex min-h-11 items-center justify-center pt-2">
        {youtube ? (
          <motion.a
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Posjeti YouTube kanal (otvara se u novoj kartici)"
            whileHover={reducedMotion ? undefined : { scale: 1.04 }}
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            className="inline-flex min-h-11 items-center gap-3 rounded-full bg-club-red px-8 py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-chalk transition-colors duration-300 hover:bg-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-3 focus-visible:ring-offset-background sm:text-xs"
          >
            <FaYoutube aria-hidden className="size-4" />
            Posjeti kanal
          </motion.a>
        ) : (
          <p className="inline-flex min-h-11 items-center gap-3 border-y border-border px-3 py-3 text-xs font-semibold text-muted-foreground sm:text-sm">
            <FaYoutube aria-hidden className="size-4 shrink-0 text-club-red" />
            Kanal trenutačno nije dostupan
          </p>
        )}
      </div>
    </div>
  );
}
