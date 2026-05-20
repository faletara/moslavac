"use client";

import Link from "next/link";
import { AnimatedLine, FadeInView } from "@/components/animations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <section className="mt-20 sm:mt-28">
        <p className="text-center text-sm text-muted-foreground">
          Postave će biti objavljene neposredno prije utakmice.
        </p>
      </section>
    );
  }

  const homeName = match.homeTeam?.name ?? "Domaći";
  const awayName = match.awayTeam?.name ?? "Gosti";

  const homeColumn = (
    <LineupColumn
      teamName={homeName}
      teamPicture={match.homeTeam?.picture ?? null}
      teamLineup={lineups?.home ?? null}
      competitionId={competitionId}
    />
  );

  const awayColumn = (
    <LineupColumn
      teamName={awayName}
      teamPicture={match.awayTeam?.picture ?? null}
      teamLineup={lineups?.away ?? null}
      competitionId={competitionId}
    />
  );

  return (
    <section className="mt-20 sm:mt-28">
      <FadeInView>
        <div className="flex flex-col items-center gap-6 text-center">
          <AnimatedLine className="mx-auto" />
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
            Tko je u igri
          </p>
          <h2 className="select-none font-black uppercase leading-[0.85] tracking-tighter text-[14vw] sm:text-6xl md:text-7xl">
            Postave
          </h2>
        </div>
      </FadeInView>

      <FadeInView delay={0.1}>
        <Tabs
          defaultValue="home"
          className="mx-auto mt-12 max-w-5xl md:hidden"
        >
          <TabsList variant="line" className="mx-auto w-full justify-center">
            <TabsTrigger value="home" className="px-3 text-xs uppercase tracking-tight">
              {homeName}
            </TabsTrigger>
            <TabsTrigger value="away" className="px-3 text-xs uppercase tracking-tight">
              {awayName}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="home" className="mt-8">
            {homeColumn}
          </TabsContent>
          <TabsContent value="away" className="mt-8">
            {awayColumn}
          </TabsContent>
        </Tabs>

        <div className="mx-auto mt-12 hidden max-w-5xl gap-12 md:grid md:grid-cols-2 md:gap-16">
          {homeColumn}
          {awayColumn}
        </div>
      </FadeInView>
    </section>
  );
}

function LineupColumn({
  teamName,
  teamPicture,
  teamLineup,
  competitionId,
}: {
  teamName: string;
  teamPicture: string | null;
  teamLineup: HnsLineups["home"];
  competitionId: number | null;
}) {
  if (!teamLineup) return null;

  const players = teamLineup.players ?? [];
  const starters = players.filter((p) => p.starting === true);
  const substitutes = players.filter((p) => p.starting !== true);
  const teamInitials = teamName.slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-border/60 pb-3">
        <Avatar className="size-9 shrink-0">
          {teamPicture && (
            <AvatarImage src={getCometImageUrl(teamPicture)} alt={teamName} />
          )}
          <AvatarFallback className="text-[0.55rem] font-semibold uppercase tracking-[0.15em]">
            {teamInitials}
          </AvatarFallback>
        </Avatar>
        <h3 className="line-clamp-1 text-sm font-black uppercase tracking-tight">
          {teamName}
        </h3>
      </div>

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
          href={`/statistika/${player.personId}/${competitionId}`}
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
