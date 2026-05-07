"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeInView } from "@/components/animations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api, getCometImageUrl } from "@/lib/api";
import { formatDateTime } from "@/lib/helpers/date";

function TeamRow({ name, picture }: { name: string; picture: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-8 shrink-0">
        {picture && <AvatarImage src={getCometImageUrl(picture)} alt={name} />}
        <AvatarFallback className="bg-transparent text-[10px] font-medium text-muted-foreground">
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="line-clamp-1 text-xs font-semibold uppercase tracking-[0.12em]">
        {name}
      </span>
    </div>
  );
}

function SectionTitle() {
  return (
    <FadeInView>
      <h2 className="text-center text-3xl font-black uppercase leading-none tracking-tighter md:text-4xl">
        Sljedeće utakmice
      </h2>
    </FadeInView>
  );
}

function ScrollableRow({ children }: { children: React.ReactNode }) {
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
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground transition-colors hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-30"
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
            className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground transition-colors hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            Sljedeće
            <ChevronRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function UpcomingMatchesSection() {
  const { data: matches, isLoading } = api.matches.useGetUpcomingMatches();

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl space-y-12 px-4">
        <SectionTitle />
        <div className="flex gap-8 overflow-x-auto pb-2">
          {["u1", "u2", "u3", "u4"].map((key) => (
            <div key={key} className="flex w-72 shrink-0 flex-col gap-5">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!matches || matches.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl space-y-12 px-4">
      <SectionTitle />
      <FadeInView delay={0.1}>
        <ScrollableRow>
          {matches.map((match) => {
            const { date, time } = formatDateTime(match.dateTimeUTC ?? 0);

            return (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                aria-label={`${match.homeTeam?.name ?? ""} vs ${match.awayTeam?.name ?? ""} — ${date} ${time}`}
                className="group flex w-72 shrink-0 snap-start flex-col gap-5 rounded-sm outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
              >
                <p className="line-clamp-2 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  {match.competition?.name ?? ""}
                </p>

                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-3xl font-black uppercase leading-none tracking-tighter tabular-nums">
                    {date}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {time}
                  </span>
                </div>

                <div className="space-y-3 border-t border-border/60 pt-4">
                  <TeamRow
                    name={match.homeTeam?.name ?? "N/A"}
                    picture={match.homeTeam?.picture ?? ""}
                  />
                  <TeamRow
                    name={match.awayTeam?.name ?? "N/A"}
                    picture={match.awayTeam?.picture ?? ""}
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
