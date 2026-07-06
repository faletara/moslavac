import { fetchMatchSlots } from "@/lib/hns/competitions";
import { NextMatchHero } from "./previous-next/NextMatchHero";
import { PreviousMatchCard } from "./previous-next/PreviousMatchCard";

function isValidMatch<T extends object>(
  match: T | null | undefined,
): match is T {
  return match != null && Object.keys(match).length > 0;
}

/**
 * Match centar — the dark scoreboard world that continues straight out of the
 * hero: upcoming fixture with countdown, then the latest result as a band.
 */
export default async function PreviousAndNextMatchSection() {
  const data = await fetchMatchSlots();

  const nextMatch = data?.next ?? null;
  const previousMatch = data?.previous ?? null;
  const hasNext = isValidMatch(nextMatch);
  const hasPrev = isValidMatch(previousMatch);

  if (!hasNext && !hasPrev) return null;

  return (
    <section id="utakmice" className="scroll-mt-20">
      {hasNext && nextMatch != null && (
        <div className="dark relative overflow-hidden bg-navy-deep text-foreground">
          {/* Faint centre glow keeps the scoreboard lit */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-160 w-240 -translate-x-1/2 rounded-full bg-club/10 blur-[140px]"
          />
          <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
            <NextMatchHero match={nextMatch} />
          </div>
        </div>
      )}
      {hasPrev && previousMatch != null && (
        <div className="border-t border-border bg-background text-foreground">
          <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-20">
            <PreviousMatchCard match={previousMatch} />
          </div>
        </div>
      )}
    </section>
  );
}
