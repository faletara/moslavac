import { notFound } from "next/navigation";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import MatchHero from "@/components/features/matches/MatchHero";
import MatchTabs from "@/components/features/matches/tabs/MatchTabs";
import {
  fetchMatchEvents,
  fetchMatchInfo,
  fetchMatchLineups,
  fetchMatchReferees,
} from "@/lib/hns/matches";
import { formatDateTime } from "@/lib/helpers/date";
import { redirectToCanonical } from "@/lib/canonical";
import { buildMatchSlug, parseTrailingId } from "@/lib/slug";

interface Props {
  params: Promise<{ matchId: string }>;
}

export const revalidate = 30;

export default async function MatchInfoPage({ params }: Props) {
  const { matchId } = await params;
  const mid = parseTrailingId(matchId);

  const [matchInfo, events, lineups, refereeData] = await Promise.all([
    fetchMatchInfo({ matchId: mid }),
    fetchMatchEvents({ matchId: mid }),
    fetchMatchLineups({ matchId: mid }),
    fetchMatchReferees({ matchId: mid }),
  ]);

  if (!matchInfo) notFound();

  // Collapse numeric/partial-slug duplicates onto the canonical slug URL.
  redirectToCanonical(
    `/utakmice/${matchId}`,
    `/utakmice/${buildMatchSlug(matchInfo)}`,
  );

  const { date, time } = formatDateTime(matchInfo.dateTimeUTC ?? 0);
  const hasResult =
    matchInfo.homeTeamResult != null && matchInfo.awayTeamResult != null;
  const halfHome = matchInfo.homeTeamResult?.half;
  const halfAway = matchInfo.awayTeamResult?.half;
  const showHalfTime = hasResult && halfHome != null && halfAway != null;
  const attendance = matchInfo.attendance;

  const eyebrow = [
    matchInfo.roundOrder != null ? `Kolo ${matchInfo.roundOrder}` : null,
    matchInfo.competition?.name?.trim() || null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="pb-24">
      <TrackEvent
        event="Match View"
        props={{ matchId: mid, competition: matchInfo.competition?.name ?? "" }}
      />

      <MatchHero
        eyebrow={eyebrow}
        homeName={matchInfo.homeTeam?.name ?? "N/A"}
        homePicture={matchInfo.homeTeam?.picture ?? null}
        awayName={matchInfo.awayTeam?.name ?? "N/A"}
        awayPicture={matchInfo.awayTeam?.picture ?? null}
        hasResult={hasResult}
        homeScore={matchInfo.homeTeamResult?.current ?? 0}
        awayScore={matchInfo.awayTeamResult?.current ?? 0}
        time={time}
        date={date}
        place={matchInfo.facility?.place?.trim() || null}
        halfTime={showHalfTime ? `${halfHome}:${halfAway}` : null}
        attendance={attendance ?? null}
      />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <MatchTabs
          match={matchInfo}
          events={events ?? undefined}
          lineups={lineups ?? undefined}
          refereeData={refereeData ?? undefined}
          refereesLoading={false}
        />
      </div>
    </div>
  );
}
