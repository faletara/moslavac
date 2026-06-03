import { notFound } from "next/navigation";
import { HnsCrest } from "@/components/HnsCrest";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import MatchTabs from "@/components/features/matches/tabs/MatchTabs";
import {
  fetchMatchEvents,
  fetchMatchInfo,
  fetchMatchLineups,
  fetchMatchReferees,
} from "@/lib/hns/matches";
import { formatDateTime } from "@/lib/helpers/date";
import { parseTrailingId } from "@/lib/slug";

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

  const { date, time } = formatDateTime(matchInfo.dateTimeUTC ?? 0);
  const hasResult =
    matchInfo.homeTeamResult != null && matchInfo.awayTeamResult != null;
  const halfHome = matchInfo.homeTeamResult?.half;
  const halfAway = matchInfo.awayTeamResult?.half;
  const showHalfTime = hasResult && halfHome != null && halfAway != null;
  const attendance = matchInfo.attendance;

  return (
    <div className="container mx-auto mt-16 max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
      <TrackEvent
        event="Match View"
        props={{ matchId: mid, competition: matchInfo.competition?.name ?? "" }}
      />

      <p className="text-center">
        {[
          matchInfo.roundOrder != null ? `Kolo ${matchInfo.roundOrder}` : null,
          matchInfo.competition?.name?.trim() || null,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <div className="mt-12 grid grid-cols-3 items-center gap-4 sm:mt-16 sm:gap-10">
        <TeamDisplay
          name={matchInfo.homeTeam?.name ?? "N/A"}
          picture={matchInfo.homeTeam?.picture ?? null}
        />

        <div className="flex flex-col items-center gap-4 text-center">
          {hasResult ? (
            <div className="flex items-baseline gap-3 sm:gap-6">
              <span>
                {matchInfo.homeTeamResult?.current ?? 0}
              </span>
              <span>
                :
              </span>
              <span>
                {matchInfo.awayTeamResult?.current ?? 0}
              </span>
            </div>
          ) : (
            <span>
              {time}
            </span>
          )}

          <div className="flex flex-col gap-1.5">
            {showHalfTime && (
              <p>
                Poluvrijeme {halfHome}:{halfAway}
              </p>
            )}
            <p>
              {date}
            </p>
            {matchInfo.facility?.place && (
              <p>
                {matchInfo.facility.place}
              </p>
            )}
            {hasResult && attendance != null && attendance > 0 && (
              <p>
                {attendance} gledatelja
              </p>
            )}
          </div>
        </div>

        <TeamDisplay
          name={matchInfo.awayTeam?.name ?? "N/A"}
          picture={matchInfo.awayTeam?.picture ?? null}
        />
      </div>

      <MatchTabs
        match={matchInfo}
        events={events ?? undefined}
        lineups={lineups ?? undefined}
        refereeData={refereeData ?? undefined}
        refereesLoading={false}
      />
    </div>
  );
}

function TeamDisplay({
  name,
  picture,
}: {
  name: string;
  picture: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <HnsCrest
        picture={picture}
        name={name}
        size={96}
        className="size-16 sm:size-24"
      />
      <span className="line-clamp-2">
        {name}
      </span>
    </div>
  );
}
