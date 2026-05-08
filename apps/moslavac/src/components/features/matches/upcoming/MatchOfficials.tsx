"use client";

import { AnimatedLine, FadeInView } from "@/components/animations";
import { Skeleton } from "@/components/ui/skeleton";
import type { HnsMatchInfo } from "@/types/hns";

interface MatchOfficialsProps {
  refereeData: HnsMatchInfo | undefined;
  isLoading: boolean;
}

export default function MatchOfficials({
  refereeData,
  isLoading,
}: MatchOfficialsProps) {
  if (isLoading) {
    return (
      <section className="mt-20 sm:mt-28">
        <Skeleton className="mx-auto h-4 w-24" />
        <div className="mx-auto mt-8 max-w-md space-y-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </section>
    );
  }

  const officials = (refereeData?.matchOfficials ?? []).filter(
    (o) => (o.name ?? "").trim() !== "",
  );

  if (officials.length === 0) return null;

  return (
    <section className="mt-20 sm:mt-28">
      <FadeInView>
        <div className="flex flex-col items-center gap-6 text-center">
          <AnimatedLine className="mx-auto" />
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
            Sudačka ekipa
          </p>
          <h2 className="select-none font-black uppercase leading-[0.85] tracking-tighter text-[14vw] sm:text-6xl md:text-7xl">
            Suci
          </h2>
        </div>
      </FadeInView>

      <FadeInView delay={0.1}>
        <ul className="mx-auto mt-12 max-w-2xl divide-y divide-border/40">
          {officials.map((official, i) => (
            <li
              key={`${official.personId ?? official.name}-${i}`}
              className="grid grid-cols-[auto_1fr] items-center gap-6 py-4 sm:gap-10"
            >
              <span className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-xs sm:tracking-[0.3em]">
                {official.role ?? ""}
              </span>
              <span className="text-right text-sm font-black uppercase tracking-tight sm:text-base">
                {official.name}
              </span>
            </li>
          ))}
        </ul>
      </FadeInView>
    </section>
  );
}
