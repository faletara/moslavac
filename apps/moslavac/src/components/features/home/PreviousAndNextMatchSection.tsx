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
    <section
      id="utakmice"
      className="dark relative scroll-mt-20 overflow-hidden bg-navy-deep text-foreground"
    >
      {/* Faint centre glow keeps the scoreboard lit */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-club/10 blur-[140px]"
      />
      {hasNext && nextMatch != null && (
        <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
          <NextMatchHero match={nextMatch} />
        </div>
      )}
      {hasPrev && previousMatch != null && (
        <div className="border-t border-foreground/10 bg-foreground/[0.03]">
          <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-20">
            <PreviousMatchCard match={previousMatch} />
          </div>
        </div>
      )}
    </section>
  );
}
