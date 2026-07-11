import type { Match, MatchEvent, MatchInfo, TeamRanking } from "@/types/hns";
import EventsTimeline from "./EventsTimeline";
import MatchFacts from "./MatchFacts";
import TeamForm from "./TeamForm";

interface OverviewTabProps {
  match: Match;
  events: MatchEvent[];
  info: MatchInfo | null;
  standings: TeamRanking[];
  /** True once the ball is rolling — a fixture that hasn't started has no run of play. */
  started: boolean;
}

/**
 * Pregled — tijek utakmice (samo kad je počela), forma obiju momčadi, pa podaci
 * o utakmici. Za nadolazeću utakmicu odbrojavanje već stoji u hero-u, pa ovdje
 * ostaju forma i podaci.
 */
export default function OverviewTab({
  match,
  events,
  info,
  standings,
  started,
}: OverviewTabProps) {
  return (
    <div className="space-y-16 md:space-y-20">
      {started && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Tijek utakmice
          </h3>
          <div className="mt-6">
            <EventsTimeline match={match} events={events} />
          </div>
        </section>
      )}

      <TeamForm match={match} standings={standings} />

      <MatchFacts match={match} info={info} />
    </div>
  );
}
