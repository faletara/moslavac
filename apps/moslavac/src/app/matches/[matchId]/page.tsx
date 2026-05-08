import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import MatchTabs from "@/components/features/matches/tabs/MatchTabs";
import { getCometImageUrl } from "@/lib/api";
import {
  fetchMatchEvents,
  fetchMatchInfo,
  fetchMatchLineups,
  fetchMatchReferees,
} from "@/lib/hns/matches";
import { formatDateTime } from "@/lib/helpers/date";

interface Props {
  params: Promise<{ matchId: string }>;
}

export default async function MatchInfoPage({ params }: Props) {
  const { matchId } = await params;
  const mid = Number(matchId);

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

      <p className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
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
            <div className="flex items-baseline gap-3 font-black uppercase leading-none tracking-tighter sm:gap-6">
              <span className="text-6xl tabular-nums sm:text-7xl md:text-8xl">
                {matchInfo.homeTeamResult?.current ?? 0}
              </span>
              <span className="text-3xl font-light text-muted-foreground sm:text-5xl">
                :
              </span>
              <span className="text-6xl tabular-nums sm:text-7xl md:text-8xl">
                {matchInfo.awayTeamResult?.current ?? 0}
              </span>
            </div>
          ) : (
            <span className="font-black uppercase leading-none tracking-tighter text-5xl tabular-nums sm:text-6xl">
              {time}
            </span>
          )}

          <div className="flex flex-col gap-1.5">
            {showHalfTime && (
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:tracking-[0.35em]">
                Poluvrijeme {halfHome}:{halfAway}
              </p>
            )}
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:tracking-[0.35em]">
              {date}
            </p>
            {matchInfo.facility?.place && (
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground/80 sm:tracking-[0.35em]">
                {matchInfo.facility.place}
              </p>
            )}
            {hasResult && attendance != null && attendance > 0 && (
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground/80 sm:tracking-[0.35em]">
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
      <Avatar className="size-16 sm:size-24">
        {picture && <AvatarImage src={getCometImageUrl(picture)} alt={name} />}
        <AvatarFallback className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="line-clamp-2 text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.2em] sm:text-xs sm:tracking-[0.25em]">
        {name}
      </span>
    </div>
  );
}
