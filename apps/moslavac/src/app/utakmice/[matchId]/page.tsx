import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import MatchHero from "@/components/features/matches/MatchHero";
import MatchTabs from "@/components/features/matches/tabs/MatchTabs";
import { fetchAllCompetitionMatches } from "@/lib/hns/competitions";
import {
  fetchMatchEvents,
  fetchMatchInfo,
  fetchMatchLineups,
  fetchMatchReferees,
} from "@/lib/hns/matches";
import {
  fetchAllCompetitionScorers,
  fetchTeamStandings,
} from "@/lib/hns/standings";
import { formatDateTime } from "@/lib/helpers/date";
import { redirectToCanonical } from "@/lib/canonical";
import { BASE_URL } from "@/lib/siteUrl";
import { buildMatchSlug, parseTrailingId } from "@/lib/slug";

interface Props {
  params: Promise<{ matchId: string }>;
}

export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { matchId } = await params;
  const mid = parseTrailingId(matchId);
  const matchInfo = await fetchMatchInfo({ matchId: mid });
  if (!matchInfo) return {};

  const home = matchInfo.homeTeam?.name ?? "N/A";
  const away = matchInfo.awayTeam?.name ?? "N/A";
  const title = `${home} - ${away}`;
  const hasResult =
    matchInfo.score.home.current != null && matchInfo.score.away.current != null;
  const score = hasResult
    ? ` ${matchInfo.score.home?.current ?? 0}:${matchInfo.score.away?.current ?? 0}`
    : "";
  const competition = matchInfo.competition?.name?.trim();
  const description = `${home} protiv ${away}${score}${
    competition ? ` — ${competition}` : ""
  }. Rezultat, tijek utakmice, postave i statistika.`;
  const canonical = `${BASE_URL}/utakmice/${buildMatchSlug(matchInfo)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: "/naslovna.jpg", alt: title, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/naslovna.jpg"],
    },
  };
}

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

  // Competition-level data the tabs (standings / form / scorers) render.
  // Keyed off the match's competition, so it can only start once matchInfo
  // resolves — the three requests then run in parallel.
  const competitionId = matchInfo.competition?.id ?? null;
  const [standings, competitionMatches, scorers] =
    competitionId != null
      ? await Promise.all([
          fetchTeamStandings({ competitionId }),
          fetchAllCompetitionMatches({ competitionId }),
          fetchAllCompetitionScorers({ competitionId }),
        ])
      : [[], [], []];

  const { date, time } = formatDateTime(matchInfo.kickoffAtUtcMs ?? 0);
  const hasResult =
    matchInfo.score.home.current != null && matchInfo.score.away.current != null;
  const halfHome = matchInfo.score.home?.half;
  const halfAway = matchInfo.score.away?.half;
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
        homeScore={matchInfo.score.home?.current ?? 0}
        awayScore={matchInfo.score.away?.current ?? 0}
        time={time}
        date={date}
        place={matchInfo.facility?.place?.trim() || null}
        halfTime={showHalfTime ? `${halfHome}:${halfAway}` : null}
        attendance={attendance ?? null}
        events={events ?? undefined}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <MatchTabs
          match={matchInfo}
          events={events ?? undefined}
          lineups={lineups ?? undefined}
          refereeData={refereeData ?? undefined}
          refereesLoading={false}
          standings={standings}
          competitionMatches={competitionMatches}
          scorers={scorers}
        />
      </div>
    </div>
  );
}
