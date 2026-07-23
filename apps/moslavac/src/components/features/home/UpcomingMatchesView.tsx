"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeInView } from "@/components/animations";
import { HnsCrest } from "@/components/HnsCrest";
import {
  getCategoryChipClass,
  getCategoryShortLabel,
  getCompetitionCategory,
} from "@/lib/helpers/competition";
import { formatDateParts } from "@/lib/helpers/date";
import { buildMatchSlug } from "@/lib/helpers/slug";
import type { Match } from "@/types/hns";

const OUR_TEAM_KEYWORD = "moslavac";

function isOurTeam(name: string | null | undefined): boolean {
  return !!name && name.toLowerCase().includes(OUR_TEAM_KEYWORD);
}

function TeamRow({
  name,
  picture,
  isUs,
}: {
  name: string;
  picture: string;
  isUs: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <HnsCrest picture={picture} name={name} size={32} className="size-8" />
      <span
        className={`line-clamp-1 text-xs uppercase tracking-[0.12em] ${
          isUs ? "font-black text-foreground" : "font-semibold"
        }`}
      >
        {name}
      </span>
    </div>
  );
}

function SectionTitle() {
  return (
    <div className="flex flex-col items-center gap-4">
      <FadeInView delay={0.05}>
        <h2 className="text-center font-display text-[13vw] font-black uppercase leading-[0.85] sm:text-6xl md:text-7xl lg:text-8xl">
          Sljedeće utakmice
        </h2>
      </FadeInView>
    </div>
  );
}

function ScrollableRow({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    setIsOverflowing(scrollWidth > clientWidth + 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <div className="space-y-12">
      <div
        ref={scrollRef}
        className="-mt-4 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-1 pb-2 pt-4 motion-reduce:scroll-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {isOverflowing && (
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label="Prethodne utakmice"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            className="group inline-flex cursor-pointer items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground transition-colors hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="size-3 transition-transform duration-300 group-hover:-translate-x-1" />
            Prethodne
          </button>
          <span aria-hidden className="h-px w-8 bg-foreground" />
          <button
            type="button"
            aria-label="Sljedeće utakmice"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            className="group inline-flex cursor-pointer items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground transition-colors hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            Sljedeće
            <ChevronRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function UpcomingMatchesView({
  matches,
}: {
  matches: Match[];
}) {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-12 px-4 py-20 sm:py-28">
      <SectionTitle />
      <FadeInView delay={0.1}>
        <ScrollableRow>
          {matches.map((match) => {
            const { day, monthShort, weekdayShort, time } = formatDateParts(
              match.kickoffAtUtcMs ?? 0,
            );
            const category = getCompetitionCategory(match.competition?.name);
            const categoryLabel = getCategoryShortLabel(category);
            const chipClass = getCategoryChipClass(category);
            const homeIsUs = isOurTeam(match.homeTeam?.name);
            const awayIsUs = isOurTeam(match.awayTeam?.name);
            const venueIndicator = homeIsUs ? "D" : awayIsUs ? "G" : null;

            return (
              <Link
                key={match.id}
                href={`/utakmice/${buildMatchSlug(match)}`}
                aria-label={`${match.homeTeam?.name ?? ""} vs ${match.awayTeam?.name ?? ""}, ${day}. ${monthShort} ${time}`}
                className="group flex h-full w-72 shrink-0 snap-start flex-col gap-5 rounded-sm outline-none transition-transform duration-300 ease-out hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${chipClass}`}
                  >
                    {categoryLabel}
                  </span>
                  {venueIndicator && (
                    <>
                      <span aria-hidden className="h-3 w-px bg-current/20" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {venueIndicator === "D" ? "Doma" : "Gost"}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-6xl font-black leading-none tabular-nums">
                      {day}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {monthShort}
                      <span className="ml-2 text-muted-foreground/70">
                        {weekdayShort}
                      </span>
                    </span>
                  </div>
                  <span className="font-display text-xl font-bold uppercase tabular-nums">
                    {time}
                  </span>
                </div>

                <div className="mt-auto space-y-3 border-t-2 border-border pt-4 transition-colors duration-300 group-hover:border-primary">
                  <TeamRow
                    name={match.homeTeam?.name ?? "N/A"}
                    picture={match.homeTeam?.picture ?? ""}
                    isUs={homeIsUs}
                  />
                  <TeamRow
                    name={match.awayTeam?.name ?? "N/A"}
                    picture={match.awayTeam?.picture ?? ""}
                    isUs={awayIsUs}
                  />
                </div>
              </Link>
            );
          })}
        </ScrollableRow>
      </FadeInView>
    </section>
  );
}
