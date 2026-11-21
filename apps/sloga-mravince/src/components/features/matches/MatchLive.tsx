"use client";

import { Suspense } from "react";
import { useLiveMatch } from "@/components/ui/use-live-match";
import { isFinished, isLive } from "@/lib/hns/matchStatus";
import type { LiveMatch, Match, MatchInfo, TeamRanking } from "@/types/hns";
import MatchHero from "./MatchHero";
import MatchTabs from "./MatchTabs";

interface MatchLiveProps {
  match: Match;
  initialLive: LiveMatch;
  info: MatchInfo | null;
  standings: TeamRanking[];
}

/**
 * Hero i tabovi utakmice nad `LiveMatch`-om iz preglednika. Stranica je
 * statična (keš 1 dan); rezultat, status, minuta, događaji i postave dolaze iz
 * `useLiveMatch` i prekrivaju serverski renderiranu utakmicu. Suci i tablica
 * ostaju serverski.
 */
export default function MatchLive({
  match,
  initialLive,
  info,
  standings,
}: MatchLiveProps) {
  const live = useLiveMatch(initialLive, match.kickoffAtUtcMs);

  const current: Match = {
    ...match,
    score: live.score,
    liveStatus: live.liveStatus,
    minute: live.minute,
    currentMinute: live.currentMinute,
  };

  const started = isLive(current) || isFinished(current);

  return (
    <>
      <MatchHero match={current} />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        <Suspense fallback={null}>
          <MatchTabs
            match={current}
            events={live.events}
            lineups={live.lineups}
            info={info}
            standings={standings}
            started={started}
          />
        </Suspense>
      </section>
    </>
  );
}
