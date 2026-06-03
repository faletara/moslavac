"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HnsCrest } from "@/components/HnsCrest";
import { useOurTeamId } from "@/components/providers/TenantProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import {
  getCategoryChipClass,
  getCategoryShortLabel,
  getCompetitionCategory,
} from "@/lib/helpers/competition";
import { formatDateParts } from "@/lib/helpers/date";
import { buildMatchSlug } from "@/lib/slug";

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
      <HnsCrest picture={picture} name={name} size={32} />
      <span className={`line-clamp-1 ${isUs ? "" : ""}`}>
        {name}
      </span>
    </div>
  );
}

function SectionTitle() {
  return (
    <h2>
      Sljedeće utakmice
    </h2>
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
    <div>
      <div
        ref={scrollRef}
        className="-mt-4 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-1 pb-2 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            className="inline-flex items-center gap-3 disabled:pointer-events-none"
          >
            <ChevronLeft className="size-3" />
            Prethodne
          </button>
          <span aria-hidden className="h-px w-8" />
          <button
            type="button"
            aria-label="Sljedeće utakmice"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            className="inline-flex items-center gap-3 disabled:pointer-events-none"
          >
            Sljedeće
            <ChevronRight className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function UpcomingMatchesSection() {
  const { data: matches, isLoading } = api.matches.useGetUpcomingMatches();
  const ourTeamId = useOurTeamId();

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4">
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
    <section className="mx-auto w-full max-w-7xl px-4">
      <SectionTitle />
      <ScrollableRow>
        {matches.map((match) => {
          const { day, monthShort, weekdayShort, time } = formatDateParts(
            match.dateTimeUTC ?? 0,
          );
          const category = getCompetitionCategory(match.competition?.name);
          const categoryLabel = getCategoryShortLabel(category);
          const chipClass = getCategoryChipClass(category);
          const homeIsUs =
            ourTeamId != null && match.homeTeam?.id === ourTeamId;
          const awayIsUs =
            ourTeamId != null && match.awayTeam?.id === ourTeamId;
          const venueIndicator = homeIsUs ? "D" : awayIsUs ? "G" : null;

          return (
            <Link
              key={match.id}
              href={`/utakmice/${buildMatchSlug(match)}`}
              aria-label={`${match.homeTeam?.name ?? ""} vs ${match.awayTeam?.name ?? ""} — ${day}. ${monthShort} ${time}`}
              className="flex w-72 shrink-0 snap-start flex-col gap-5"
            >
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-1 ${chipClass}`}>
                  {categoryLabel}
                </span>
                {venueIndicator && (
                  <span>
                    · {venueIndicator === "D" ? "Doma" : "Gost"}
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span>
                    {day}
                  </span>
                  <span>
                    {monthShort}
                    <span className="ml-2">
                      {weekdayShort}
                    </span>
                  </span>
                </div>
                <span>
                  {time}
                </span>
              </div>

              <div className="space-y-3 pt-4">
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
    </section>
  );
}
