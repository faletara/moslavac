"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { HnsLineups, HnsMatch, HnsMatchEvent, HnsMatchInfo } from "@/types/hns";
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
  match: HnsMatch;
  events: HnsMatchEvent[] | undefined;
  lineups: HnsLineups | undefined;
  refereeData: HnsMatchInfo | undefined;
  refereesLoading: boolean;
}

export default function MatchTabs({
  match,
  events,
  lineups,
  refereeData,
  refereesLoading,
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
      <div className="flex justify-start overflow-x-auto border-b border-border [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
        <TabsList
          variant="line"
          className="w-max shrink-0 gap-0 [&>button]:px-3 [&>button]:text-xs [&>button]:font-black [&>button]:uppercase [&>button]:tracking-[0.15em] [&>button]:after:bottom-[-1px] [&>button]:after:h-0.5 [&>button]:after:bg-primary [&>button]:data-[state=active]:text-foreground sm:[&>button]:px-5 sm:[&>button]:text-sm sm:[&>button]:tracking-[0.18em]"
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
        />
      </TabsContent>

      <TabsContent value="postave">
        <MatchLineupsTab match={match} lineups={lineups} />
      </TabsContent>

      <TabsContent value="tablica">
        <div className="mx-auto max-w-4xl">
          <MatchStandingsTab
            competitionId={competitionId}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
          />
        </div>
      </TabsContent>

      <TabsContent value="forma">
        <MatchFormTab match={match} />
      </TabsContent>

      <TabsContent value="strijelci">
        <div className="mx-auto max-w-4xl">
          <MatchTopScorersTab
            competitionId={competitionId}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
