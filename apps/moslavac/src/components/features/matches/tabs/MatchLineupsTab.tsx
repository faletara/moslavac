import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCometImageUrl } from "@/lib/api";
import type { HnsLineups, HnsMatch, HnsTeamPlayer } from "@/types/hns";

interface MatchLineupsTabProps {
  match: HnsMatch;
  lineups: HnsLineups | undefined;
}

export default function MatchLineupsTab({
  match,
  lineups,
}: MatchLineupsTabProps) {
  const competitionId = match.competition?.id ?? null;
  const hasLineups =
    (lineups?.home?.players?.length ?? 0) > 0 ||
    (lineups?.away?.players?.length ?? 0) > 0;

  if (!hasLineups) {
    return (
      <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
        <p className="text-center text-sm text-muted-foreground">
          Postave će biti objavljene neposredno prije utakmice.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
      <h2 className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
        Postave
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <LineupColumn
          teamName={match.homeTeam?.name ?? "N/A"}
          teamLineup={lineups?.home ?? null}
          competitionId={competitionId}
        />
        <LineupColumn
          teamName={match.awayTeam?.name ?? "N/A"}
          teamLineup={lineups?.away ?? null}
          competitionId={competitionId}
        />
      </div>
    </section>
  );
}

function LineupColumn({
  teamName,
  teamLineup,
  competitionId,
}: {
  teamName: string;
  teamLineup: HnsLineups["home"];
  competitionId: number | null;
}) {
  if (!teamLineup) return null;

  const players = teamLineup.players ?? [];
  const starters = players.filter((p) => p.starting === true);
  const substitutes = players.filter((p) => p.starting !== true);

  return (
    <div>
      <h3 className="border-b border-border/60 pb-3 text-[0.65rem] font-semibold uppercase tracking-[0.25em]">
        {teamName}
      </h3>

      <ul className="mt-2">
        {starters.map((player, i) => (
          <PlayerRow
            key={`s-${player.personId ?? player.shirtNumber ?? "x"}-${player.name ?? i}`}
            player={player}
            competitionId={competitionId}
          />
        ))}
      </ul>

      {substitutes.length > 0 && (
        <>
          <p className="mt-8 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Zamjene
          </p>
          <ul className="mt-2">
            {substitutes.map((player, i) => (
              <PlayerRow
                key={`sub-${player.personId ?? player.shirtNumber ?? "x"}-${player.name ?? i}`}
                player={player}
                competitionId={competitionId}
                muted
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function PlayerRow({
  player,
  competitionId,
  muted = false,
}: {
  player: HnsTeamPlayer;
  competitionId: number | null;
  muted?: boolean;
}) {
  const playerName = player.name ?? "";
  const isLinkable =
    player.personId != null &&
    competitionId != null &&
    player.hideProfile !== true;

  const inner = (
    <div
      className={`flex items-center gap-3 border-b border-border/40 py-2.5 text-sm ${
        muted ? "text-muted-foreground" : ""
      }`}
    >
      <span className="w-6 text-right font-medium tabular-nums text-xs text-muted-foreground">
        {player.shirtNumber ?? "—"}
      </span>
      <Avatar className="size-7 shrink-0">
        {player.picture && (
          <AvatarImage
            src={getCometImageUrl(player.picture)}
            alt={playerName}
          />
        )}
        <AvatarFallback className="text-[0.5rem] font-semibold uppercase">
          {playerName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className={muted ? "" : "font-medium"}>{playerName}</span>
      {player.captain && (
        <span className="ml-auto rounded border border-border px-1.5 py-px text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          K
        </span>
      )}
    </div>
  );

  return (
    <li>
      {isLinkable ? (
        <Link
          href={`/stats/${player.personId}/${competitionId}`}
          className="block transition-colors hover:bg-muted/30"
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </li>
  );
}
