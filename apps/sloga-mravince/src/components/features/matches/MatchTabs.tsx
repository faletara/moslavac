"use client";

import { useRouter, useSearchParams } from "next/navigation";
import StandingsTable from "@/components/features/standings/StandingsTable";
import { cn } from "@/lib/utils";
import type {
  Lineups,
  Match,
  MatchEvent,
  MatchInfo,
  TeamRanking,
} from "@/types/hns";
import LineupsTab from "./LineupsTab";
import OverviewTab from "./OverviewTab";

const DEFAULT_TAB = "pregled";

interface MatchTabsProps {
  match: Match;
  events: MatchEvent[];
  lineups: Lineups | null;
  info: MatchInfo | null;
  standings: TeamRanking[];
  started: boolean;
}

/** Ima li ijedna strana objavljenu postavu. */
export function hasLineups(lineups: Lineups | null): boolean {
  if (!lineups) return false;
  return (
    (lineups.home?.players.length ?? 0) > 0 ||
    (lineups.away?.players.length ?? 0) > 0
  );
}

/**
 * Tabovi match stranice — sloga chipovi s odrezanim kutom, ne shadcn `Tabs`.
 * Aktivni tab živi u `?tab=` pa je stanje dijeljivo linkom i preživi refresh.
 *
 * Tab set se prilagođava podacima: Treća NL često nema objavljene postave, a
 * prazan tab je kliknuto obećanje koje ne postoji — pa se u tom slučaju
 * "Postave" jednostavno ne prikazuje.
 */
export default function MatchTabs({
  match,
  events,
  lineups,
  info,
  standings,
  started,
}: MatchTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabs = [
    { value: "pregled", label: "Pregled" },
    ...(hasLineups(lineups) ? [{ value: "postave", label: "Postave" }] : []),
    ...(standings.length > 0 ? [{ value: "tablica", label: "Tablica" }] : []),
  ];

  const requested = searchParams.get("tab");
  const active = tabs.some((tab) => tab.value === requested)
    ? (requested as string)
    : DEFAULT_TAB;

  const select = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === DEFAULT_TAB) params.delete("tab");
    else params.set("tab", value);
    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  };

  return (
    <>
      <div
        role="tablist"
        aria-label="Odjeljci utakmice"
        className="flex flex-wrap gap-2.5 border-b border-foreground/10 pb-8"
      >
        {tabs.map((tab) => {
          const selected = tab.value === active;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.value}`}
              id={`tab-${tab.value}`}
              onClick={() => select(tab.value)}
              className={cn(
                "clip-corner px-4 py-3 text-[0.66rem] font-black uppercase transition-colors",
                selected
                  ? "bg-ink-deep text-chalk"
                  : "bg-white text-foreground ring-1 ring-foreground/10 hover:text-club-red",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="mt-12 md:mt-16"
      >
        {active === "pregled" && (
          <OverviewTab
            match={match}
            events={events}
            info={info}
            standings={standings}
            started={started}
          />
        )}

        {active === "postave" && lineups && (
          <LineupsTab match={match} lineups={lineups} />
        )}

        {active === "tablica" && (
          <StandingsTable
            rows={standings}
            ringTeamIds={[match.homeTeam?.id, match.awayTeam?.id]}
          />
        )}
      </div>
    </>
  );
}
