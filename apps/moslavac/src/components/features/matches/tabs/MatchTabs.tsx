"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type {
  Lineups,
  Match,
  MatchEvent,
  MatchInfo,
  PlayerStats,
  TeamRanking,
} from "@/types/hns";
import MatchFormTab from "./MatchFormTab";
import MatchLineupsTab from "./MatchLineupsTab";
import MatchOverviewTab from "./MatchOverviewTab";
import MatchStandingsTab from "./MatchStandingsTab";
import MatchTopScorersTab from "./MatchTopScorersTab";

const TAB_VALUES = [
  "pregled",
  "postave",
  "tablica",
  "forma",
  "strijelci",
] as const;
type TabValue = (typeof TAB_VALUES)[number];
const DEFAULT_TAB: TabValue = "pregled";

interface MatchTabsProps {
  match: Match;
  events: MatchEvent[] | undefined;
  lineups: Lineups | undefined;
  refereeData: MatchInfo | undefined;
  refereesLoading: boolean;
  standings: TeamRanking[];
  competitionMatches: Match[];
  scorers: PlayerStats[];
}

export default function MatchTabs({
  match,
  events,
  lineups,
  refereeData,
  refereesLoading,
  standings,
  competitionMatches,
  scorers,
}: MatchTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab: TabValue = useMemo(() => {
    const param = searchParams.get("tab");
    return TAB_VALUES.includes(param as TabValue)
      ? (param as TabValue)
      : DEFAULT_TAB;
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === DEFAULT_TAB) {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  };

  const competitionId = match.competition?.id ?? null;
  const homeTeamId = match.homeTeam?.id ?? null;
  const awayTeamId = match.awayTeam?.id ?? null;

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="mt-12 sm:mt-16"
    >
      <div className="-mx-4 overflow-x-auto border-b border-border px-4 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <TabsList
          variant="line"
          className="grid min-w-max shrink-0 grid-cols-5 gap-0 sm:w-full sm:min-w-0 [&>button]:min-w-0 [&>button]:px-2.5 [&>button]:text-[0.65rem] [&>button]:font-black [&>button]:uppercase [&>button]:tracking-[0.1em] [&>button]:after:bottom-[-1px] [&>button]:after:h-0.5 [&>button]:after:bg-primary [&>button]:data-[state=active]:text-foreground sm:[&>button]:px-3 sm:[&>button]:text-xs sm:[&>button]:tracking-[0.14em] md:[&>button]:px-5 md:[&>button]:text-sm md:[&>button]:tracking-[0.16em]"
        >
          <TabsTrigger value="pregled">Pregled</TabsTrigger>
          <TabsTrigger value="postave">Postave</TabsTrigger>
          <TabsTrigger value="tablica">Tablica</TabsTrigger>
          <TabsTrigger value="forma">Forma</TabsTrigger>
          <TabsTrigger value="strijelci">Strijelci</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="pregled">
        <MatchOverviewTab
          match={match}
          events={events}
          lineups={lineups}
          refereeData={refereeData}
          refereesLoading={refereesLoading}
          competitionMatches={competitionMatches}
          standings={standings}
        />
      </TabsContent>

      <TabsContent value="postave">
        <MatchLineupsTab match={match} lineups={lineups} />
      </TabsContent>

      <TabsContent value="tablica">
        <div className="mx-auto max-w-4xl">
          <MatchStandingsTab
            standings={standings}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
          />
        </div>
      </TabsContent>

      <TabsContent value="forma">
        <MatchFormTab
          match={match}
          competitionMatches={competitionMatches}
          standings={standings}
        />
      </TabsContent>

      <TabsContent value="strijelci">
        <div className="mx-auto max-w-4xl">
          <MatchTopScorersTab
            competitionId={competitionId}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
            scorers={scorers}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
