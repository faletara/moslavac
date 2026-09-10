import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import { formatDateTime } from "@/lib/helpers/date";
import { buildMatchSlug } from "@/lib/helpers/slug";
import type { Match } from "@/types/hns";

/**
 * Rezultat kao kartica na vrhu automatskog izvještaja. Objava inače počinje
 * zidom teksta bez ijedne slike — grbovi i brojka daju joj lice, a cijela je
 * kartica poveznica na stranicu utakmice.
 */
export function MatchResultCard({ match }: { match: Match }) {
  const home = match.homeTeam;
  const away = match.awayTeam;
  const homeGoals = match.score.home.current;
  const awayGoals = match.score.away.current;
  if (!home || !away || homeGoals == null || awayGoals == null) return null;

  const { date, time } = match.kickoffAtUtcMs
    ? formatDateTime(match.kickoffAtUtcMs)
    : { date: "", time: "" };

  return (
    <Link
      href={`/raspored-i-rezultati/${buildMatchSlug(match)}`}
      className="mt-8 block border border-foreground/10 bg-background px-6 py-8 transition-colors hover:border-club-red clip-corner"
    >
      <div className="flex items-center justify-between gap-4">
        <TeamSide name={home.name} picture={home.picture} />

        <div className="text-center">
          <p className="font-display text-5xl leading-none tabular-nums md:text-6xl">
            {homeGoals}
            <span className="mx-1.5 text-club-red">:</span>
            {awayGoals}
          </p>
          {date && (
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
              {date} · {time}
            </p>
          )}
        </div>

        <TeamSide name={away.name} picture={away.picture} />
      </div>

      {match.competition?.name && (
        <p className="mt-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
          {match.competition.name}
          {match.matchDayDescription ? ` · ${match.matchDayDescription}` : ""}
        </p>
      )}
    </Link>
  );
}

function TeamSide({
  name,
  picture,
}: {
  name: string;
  picture: string | null;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3 text-center">
      <HnsCrest picture={picture} name={name} size={56} />
      <span className="font-display text-base uppercase leading-tight tracking-wide sm:text-lg">
        {name}
      </span>
    </div>
  );
}
